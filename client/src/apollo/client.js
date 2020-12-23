import fetch from "cross-fetch"

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
export const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://iv4zwyjstvaetkucidopd6wtna.appsync-api.us-east-1.amazonaws.com/graphql", // ENTER YOUR GRAPHQL ENDPOINT HERE
      fetch,
      headers: {
        "x-api-key": "da2-dnucxpxmvvgw3frq27gde575lm", // ENTER YOUR APPSYNC API KEY HERE
      },
    }),
    cache: new InMemoryCache(),
  });