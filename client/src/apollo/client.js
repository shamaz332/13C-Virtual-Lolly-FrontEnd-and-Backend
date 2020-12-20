import fetch from "cross-fetch"

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
export const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://bsthvhlkd5ey5jqjnwwxoqrb44.appsync-api.us-east-1.amazonaws.com/graphql", // ENTER YOUR GRAPHQL ENDPOINT HERE
      fetch,
      headers: {
        "x-api-key": "da2-57kpsil6ureetk5tvrohs22ge4", // ENTER YOUR APPSYNC API KEY HERE
      },
    }),
    cache: new InMemoryCache(),
  });