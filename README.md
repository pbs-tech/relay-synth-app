# relay-synth

Vue 3 frontend for [Relay Synth](https://relay-synth.peebles.lol).

Authentication is [Auth0](https://auth0.com) Universal Login. The app holds no
passwords and no credential forms; it obtains an access token from Auth0 and
sends it to [`relay-synth-api`](https://github.com/pbs-tech/relay-synth-api) as
`Authorization: Bearer <token>`.

## Configuration

Every API route except the health check requires a token, so the app needs to be
configured before it can do anything beyond Home, About and Play.

```bash
cp .env.example .env.local
```

| Variable | Required | Meaning |
| --- | --- | --- |
| `VUE_APP_AUTH0_DOMAIN` | yes | Tenant domain, e.g. `relay-synth.eu.auth0.com` |
| `VUE_APP_AUTH0_CLIENT_ID` | yes | Client ID of the SPA application |
| `VUE_APP_AUTH0_AUDIENCE` | no | Token audience. Defaults to the API URL |
| `VUE_APP_API_BASE_URL` | no | API base URL. Defaults to the prod API |
| `VUE_APP_AUTH0_REDIRECT_URI` | no | Defaults to `<origin>/callback` |
| `VUE_APP_AUTH0_LOGOUT_URI` | no | Defaults to `<origin>` |

For local development that is all you need: `npm run serve` reads `.env.local`
and vue-cli inlines the values into the dev bundle.

### Runtime configuration

vue-cli inlines `VUE_APP_*` at build time, which used to mean the bundle *was*
the configuration: dev and prod needed separate builds, so the artifact you
tested was never the artifact you shipped.

A build now also writes `dist/config.json` (`scripts/write-runtime-config.js`),
which the app fetches before it mounts. The keys are the variable names without
the `VUE_APP_` prefix:

```json
{
    "AUTH0_DOMAIN": "relay-synth.eu.auth0.com",
    "AUTH0_CLIENT_ID": "...",
    "API_BASE_URL": "https://api.relay-synth.peebles.lol"
}
```

Precedence is `config.json`, then the build-time `VUE_APP_*` value, then the
built-in default. A key that is missing or empty falls through to the next one,
and a deploy with no `config.json` at all behaves exactly as it did before -
which is what keeps `.env.local` working under `npm run serve`, where no file is
generated.

What this buys, concretely: one bundle can serve any environment, so the same
artifact can be promoted between them, and changing configuration does not need
a build at all - see Deploying below.

The loader is in `src/config/runtime.js`. Note the ordering constraint in
`src/main.js`: installing the router resolves the first route immediately, and
that route's guard reads the Auth0 config, so the fetch has to be awaited before
`app.use(router)` - not merely before `mount()`.

The values all come from the API's Terraform outputs:

```bash
terraform -chdir=terraform output auth0_domain
terraform -chdir=terraform output auth0_spa_client_id
terraform -chdir=terraform output auth0_audience
terraform -chdir=terraform output api_endpoint
```

With `VUE_APP_AUTH0_DOMAIN` or `VUE_APP_AUTH0_CLIENT_ID` unset the app still
builds and serves its unauthenticated pages; anything behind the router guard
redirects to `/401` rather than to a login that cannot work.

## Auth0 setup

The tenant is managed by Terraform in `relay-synth-api` (`terraform/auth0.tf`),
which creates the API resource server, the SPA application and a post-login
Action that adds namespaced `email` and `nickname` claims. Set `auth0_domain` in
that repo's tfvars and apply; the SPA client ID comes back as an output.

**Two things there need attention before login will work end to end:**

1. **The callback URL needs a path.** `auth0_client.spa` sets
   `callbacks = var.frontend_urls`, and `frontend_urls` is the bare origin
   (`https://relay-synth.peebles.lol`). This app redirects to `<origin>/callback`,
   which is not on that list, so Auth0 will reject the callback. Either add the
   callback URL to the tenant's allowed callbacks, or set
   `VUE_APP_AUTH0_REDIRECT_URI` to the bare origin. Note that `frontend_urls`
   also feeds `web_origins`, which must *not* have a path — so if it is changed
   in Terraform, callbacks needs its own variable.
2. **The dev origin scheme is mismatched.** `environments/dev.tfvars` lists
   `http://localhost:8080`, but `npm run serve` serves HTTPS (`vue.config.js`
   sets `devServer.https: true`). Auth0 compares these exactly, so local login
   needs `https://localhost:8080` registered.

### Sessions across reloads

Tokens are held in memory, never in `localStorage` — the previous implementation
persisted a JWT there where any XSS on the origin could read it. The trade-off is
that a full page reload has no refresh token to reuse and falls back to a silent
iframe against the Auth0 session cookie, which browsers that block third-party
cookies will refuse. Configuring an **Auth0 custom domain** on this site's own
parent domain makes that cookie first-party and fixes it. Until then a reload may
require signing in again.

### End-to-end tests

Universal Login is hosted on the tenant, so Cypress does not drive it. Specs
exchange credentials for a token directly, which needs the **Password grant**
enabled on the application and a **Default Directory** set on the tenant. Copy
`cypress.env.example.json` to `cypress.env.json` (gitignored) and fill it in.

## Deploying

The site is hosted on Cloudflare Pages. `.github/workflows/deploy-pages.yml`
runs on every push, and can be run by hand from Actions > Deploy (Cloudflare
Pages) > Run workflow.

- **`master`** deploys to production, in the `prod` GitHub Environment. Add
  required reviewers there to gate it.
- **Any other branch** deploys a preview at `<branch>.<project>.pages.dev`, in
  the `preview` environment, so a change can be verified on a real host before
  merging. The run summary links the deployment. A newer push to the same
  branch cancels a preview still in progress.
- **`dependabot/**` branches** are skipped: those runs cannot read the
  Cloudflare token, and CI already covers them on the PR.

- **The build happens before the decision to deploy.** Lint and unit tests run
  on the runner, against the artifact being uploaded.
- **A deploy has an identity.** Wrangler returns a deployment and its URL.
- **Rollback is picking an earlier deployment**, not rebuilding an older commit.
- **The artifact carries no environment.** The build runs with no `VUE_APP_*`
  set, so nothing about dev or prod is inlined; `config.json` is written
  afterwards, in a separate step. That is the same bundle for every
  environment.

The project itself is Terraform, in `relay-synth-api` (`terraform/pages.tf`) -
see that repo's README > Frontend hosting, which also covers the DNS cutover.

Production and previews are separate stacks: `prod` uses the prod API and its
Auth0 SPA client, `preview` uses dev's. Both live in one Auth0 tenant, so the
domain is shared and set once at repository level; the client ID, audience
and API URL differ and are set per GitHub **Environment**, where a preview
cannot fall back to prod's values. The workflow refuses to deploy if any is
missing. None of these is sensitive - they are all served in `config.json` -
so the domain and client ID are read from a secret or a variable of that name,
whichever exists. The API repo's Deploy run summary lists them for each
environment.

| Setting | Where | Source (`terraform output` in the API repo) |
| --- | --- | --- |
| `CLOUDFLARE_PAGES_PROJECT` | repo var | `pages_project_name` |
| `CLOUDFLARE_ACCOUNT_ID` | repo var | Account that owns the project |
| `CLOUDFLARE_API_TOKEN` | repo secret | Account > Cloudflare Pages: Edit |
| `VUE_APP_AUTH0_DOMAIN` | repo secret | `auth0_domain` |
| `VUE_APP_AUTH0_CLIENT_ID` | env secret | `auth0_spa_client_id` |
| `VUE_APP_AUTH0_AUDIENCE` | env var | `auth0_audience` |
| `API_BASE_URL` | env var | `api_endpoint` |

A SPA has no client secret; nothing reads one, so do not set it.

Take the `prod` environment's values from the API's prod state and the
`preview` environment's from its dev state. `VUE_APP_AUTH0_AUDIENCE` must
equal that stack's `auth0_api_identifier`, or API Gateway's JWT authorizer
rejects every token.

### Changing configuration without rebuilding

Run the workflow with **config_only** ticked. It skips `npm ci`, the tests and
the build, downloads the `dist` from the last successful deploy on that branch,
writes a fresh `config.json` from the environment's settings, and uploads that.
The bundles are byte-for-byte the ones that were tested; only the configuration
file differs. The run summary reports the commit the bundles were built from,
which on this path is not the commit the workflow checked out.

Every deploy keeps its `dist` as a run artifact for 30 days, which is what the
next config-only run reuses. Past that the artifact expires and the workflow
says so rather than silently rebuilding - run it once without `config_only` to
produce a fresh one.

Previews sign in against the dev stack. Its `preview_pages_hostname` in the
API's `dev.tfvars` allows `https://*.relay-synth.pages.dev` on dev's Auth0 SPA
client and in dev's CORS; prod allows only the real domain.

### Hosting rules

Pages serves `index.html` for any path that does not match a file, because the
build has no top-level `404.html` - that is its single-page-app mode, and it is
what lets `/callback` and other history-mode routes load directly.
`public/_headers` keeps `config.json` from being served stale.

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Unit tests

```bash
npm run test:unit
```

### Running end-to-end tests

```bash
npm run test:e2e
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
