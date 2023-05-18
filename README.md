## Semantic Search

#### Setup

```
yarn
supabase start

create .env based on .env.example

supabase functions serve --env-file .env
```

#### Test

```
yarn node app/hello.js "Test"
```

#### Generate and store test embeddings

```
yarn node app/generate.js
```

#### Search

```
yarn node app/search.js "Where is Sally?"
```

#### Studio URL

```
http://localhost:54423
```
