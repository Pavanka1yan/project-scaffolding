# GraphQL with .NET Backend and React Frontend

This guide explains how to scaffold a project that uses GraphQL for the API layer while keeping React on the frontend and .NET on the backend.

## .NET Backend

We recommend using [Hot Chocolate](https://chillicream.com/docs/hotchocolate/v13) for GraphQL support in .NET. After generating the project with `apiType` set to `graphql`, add the Hot Chocolate NuGet packages and configure the schema in `Program.cs`:

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>();

app.MapGraphQL();
```

Define your GraphQL types such as `Query` in the `api` folder. The scaffold will still generate controller stubs which can be removed when using GraphQL exclusively.

## React Frontend

For React applications we suggest [Apollo Client](https://www.apollographql.com/docs/react/) to consume the GraphQL API. Install the packages and create an `ApolloProvider` near the root of your app:

```tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
```

With this setup you can write queries using `useQuery` and mutations with `useMutation`.

## Config Example

Use the following `scaffold.config.json` to generate a project pre-configured for GraphQL:

```json
{
  "projectName": "graphql-app",
  "backend": "dotnet",
  "frontend": "react",
  "database": "sqlserver",
  "apiType": "graphql",
  "enableAuth": true,
  "enableEf": true
}
```

Run the CLI with `--config` to scaffold the project:

```bash
npx internal-scaffold init --config configs/dotnet-react-graphql-sqlserver.json
```
