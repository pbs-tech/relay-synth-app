# relay-synth

Vue 2 frontend for [Relay Synth](https://relay-synth.tech).

> ### Pending: backend migration
>
> `relay-synth-api` has been rebuilt as a serverless API with Auth0 handling
> signup and login. This app has **not** yet been migrated to it. Outstanding
> work, tracked separately:
>
> - Replace the hand-rolled `LoginCard` / `SignupCard` with Auth0 Universal
>   Login (`@auth0/auth0-spa-js`) and add a callback route. `POST /signup` and
>   `POST /login` no longer exist.
> - Send `Authorization: Bearer <access token>` instead of the `auth-token`
>   header, and stop persisting the token in `localStorage`.
> - Replace the `updateScore` + `updateTutorialsCompleted` pair with a single
>   `POST /user/tutorials/:number/complete`; the server now decides the score.
> - Point the leaderboard's `Email` column at `displayName` — the API no longer
>   returns email addresses.
> - Move the hardcoded `https://api.relay-synth.tech` out of the store modules
>   and into an environment variable.
>
> See the `relay-synth-api` README for the full contract.

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
