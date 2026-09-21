# relay-synth

Vue 3 frontend for [Relay Synth](https://relay-synth.peebles.lol).

Authentication is [Auth0](https://auth0.com) Universal Login. The app holds no
passwords and no credential forms; it obtains an access token from Auth0 and
sends it to [`relay-synth-api`](https://github.com/pbs-tech/relay-synth-api) as
`Authorization: Bearer <token>`.

## Configuration

Every API route except the health check requires a token, so the app needs to be
configured before it can do anything beyond Home, About and Play.

```
cp .env.example .env.local
```

| Variable | Required | Meaning |
| --- | --- | --- |
| `VUE_APP_AUTH0_DOMAIN` | yes | Tenant domain, e.g. `relay-synth.eu.auth0.com` |
| `VUE_APP_AUTH0_CLIENT_ID` | yes | Client ID of the SPA application |
| `VUE_APP_AUTH0_AUDIENCE` | no | Token audience. Defaults to `VUE_APP_API_BASE_URL` |
| `VUE_APP_API_BASE_URL` | no | API base URL. Defaults to `https://api.relay-synth.peebles.lol` |
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
artifact can be promoted between them. On Netlify the file is still generated
during the build from the site's environment variables, so changing one there
is still a rebuild - the Deploy workflow below is how you trigger it. On a host
where a single object can be replaced (Cloudflare Pages, S3), changing
configuration stops needing a build at all.

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

Netlify builds `master` on push through its own git integration; that is the
normal path and nothing in this repo drives it.

The **Deploy** workflow (`.github/workflows/deploy.yml`) covers the redeploys
that have no commit behind them - a changed site environment variable (Netlify
bakes these into `config.json` during the build, so only a rebuild picks one
up), a rebuild after the API's Terraform outputs move, or retrying a build that
failed on Netlify's side. Run it from Actions > Deploy > Run workflow, on `master`; it refuses any
other branch, because a build hook builds the branch it is configured for and
would otherwise deploy `master` under a feature branch's name.

It triggers a Netlify build rather than building here, so the result is the
same deploy a push would have produced - same image, same `NODE_VERSION` pin
from `netlify.toml`, same site environment variables.

| Secret | Required | Meaning |
| --- | --- | --- |
| `NETLIFY_BUILD_HOOK` | yes | Build hook URL. Netlify > Site configuration > Build & deploy > Build hooks |
| `NETLIFY_AUTH_TOKEN` | no | Personal access token. Without it the workflow triggers the build but cannot report whether it succeeded |
| `NETLIFY_SITE_ID` | no | Site API ID, as above. Both are needed to track the deploy |

With the two optional secrets set the job polls the deploy and fails when the
build fails. Without them a green run means only that Netlify accepted the
request, and the job says so.

### Cloudflare Pages (spike)

`.github/workflows/deploy-pages.yml` is a second, parallel deploy path. It
changes nothing about the live site: it publishes to a Cloudflare Pages project
that answers on its own `*.pages.dev` hostname, while Netlify keeps serving
`relay-synth.peebles.lol` until the apex DNS record is moved.

What it buys over the build hook:

- **The build happens before the decision to deploy.** Lint and unit tests run
  on the runner, against the artifact being uploaded. Netlify builds after the
  hook has already been fired, so a failing build is something you find out
  about afterwards.
- **A deploy has an identity.** Wrangler returns a deployment and its URL,
  rather than a 200 meaning "request accepted".
- **Rollback is picking an earlier deployment**, not rebuilding an older commit.
- **Previews per branch** come from dispatching the workflow on that branch.
- **The artifact carries no environment.** The build runs with no `VUE_APP_*`
  set, so nothing about dev or prod is inlined; `config.json` is written
  afterwards, in a separate step. That is the same bundle for every
  environment.
- **Changing configuration does not rebuild.** See below.

The project itself is Terraform, in `relay-synth-api` (`terraform/pages.tf`) -
see that repo's README > Frontend hosting, which also covers the cutover.

Configuration lives in repository **variables**, not secrets: an Auth0 SPA
client id and an API URL are public, and variables can be read and audited.

| Setting | Kind | Meaning |
| --- | --- | --- |
| `CLOUDFLARE_PAGES_PROJECT` | variable | Pages project name, from `terraform output pages_project_name` |
| `CLOUDFLARE_ACCOUNT_ID` | variable | Account that owns the project |
| `CLOUDFLARE_API_TOKEN` | secret | Needs Account > Cloudflare Pages: Edit |
| `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE`, `API_BASE_URL` | variables | Written into `config.json` after the build |

To try it: create the project in `relay-synth-api`, set the variables above,
then run **Deploy (Cloudflare Pages)** from Actions on `master` and open the
`*.pages.dev` URL in the run summary.

#### Changing configuration without rebuilding

Run the same workflow with **config_only** ticked. It skips `npm ci`, the
tests and the build, downloads the `dist` from the last successful deploy on
that branch, writes a fresh `config.json` from the repository variables, and
uploads that. The bundles are byte-for-byte the ones that were tested; only
the configuration file differs.

This is the payoff from the runtime config work: a value like `API_BASE_URL`
can change without producing a bundle that nothing has run against. The run
summary reports the commit the bundles were built from, which on this path is
not the commit the workflow checked out.

Every deploy keeps its `dist` as a run artifact for 30 days, which is what the
next config-only run reuses. Past that the artifact expires and the workflow
says so rather than silently rebuilding - run it once without `config_only` to
produce a fresh one.

**Known gaps, deliberately left for after the spike:**

- Auth0 login will not work on a `*.pages.dev` preview until those origins are
  added to the SPA client's allowed callback and logout URLs (`frontend_urls`
  in the API's tfvars). Production on the real domain is unaffected.
- The workflow is `workflow_dispatch` only. Deploying on push to `master`
  belongs with the cutover, not before it, or two hosts would be publishing the
  same commit.

`public/_redirects` and `public/_headers` hold the SPA rewrite and the
`config.json` cache header. Both Netlify and Pages read those files from the
published directory, so the rules are not restated per host - which is what
makes the cutover a DNS change rather than a config rewrite.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Unit tests
```
npm run test:unit
```

### End-to-end tests
```
npm run test:e2e
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
