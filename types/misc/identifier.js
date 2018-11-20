import { gql } from 'apollo-server'

export const typeDef = gql`
  type Identifier {
    key: Int!
    type: String!
    identifier: String!
    createdBy: String!
    created: String!
  }
`;