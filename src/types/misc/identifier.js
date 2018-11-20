import { gql } from 'apollo-server'

export const typeDef = gql`
  type Identifier {
    key: ID!
    type: String!
    identifier: String!
    createdBy: String!
    created: String!
  }
`;