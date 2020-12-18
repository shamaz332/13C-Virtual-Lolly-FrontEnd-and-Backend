module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        // This type will contain remote schema Query type
        typeName: "Lolly",
        // This is the field under which it's accessible
        fieldName: "lolly",
        // URL to query from
        url: "https://bsthvhlkd5ey5jqjnwwxoqrb44.appsync-api.us-east-1.amazonaws.com/graphql",
        headers: {
          // Learn about environment variables: https://gatsby.dev/env-vars
          Authorization: "da2-57kpsil6ureetk5tvrohs22ge4",
        },
      },
    },
  ],
}