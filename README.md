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

These are inlined by vue-cli at build time, not read at runtime: a change needs a
rebuild, and each environment needs its own build. On Netlify set them as site
environment variables.

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
that have no commit behind them - a changed site environment variable (they are
inlined at build time, so only a rebuild picks one up), a rebuild after the
API's Terraform outputs move, or retrying a build that failed on Netlify's
side. Run it from Actions > Deploy > Run workflow, on `master`; it refuses any
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
