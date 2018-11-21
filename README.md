# A GraphQL version of the GBIF REST APIs

A small test to see how we could benefit from running a GraphQL server at GBIF next to our REST APIs

> Status: Only a subset of the APIs is implemented.

## Attacks
The GBIF APIs in general are open to attacks in the sense that you can bombard it with requests. But that becomes even easier with GraphQL as nested complex queries are easy to do without being malicious. Might be worth looking at https://blog.apollographql.com/securing-your-graphql-api-from-malicious-queries-16130a324a6b

