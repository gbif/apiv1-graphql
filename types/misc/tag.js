import { gql } from 'apollo-server'

export const typeDef = gql`
  type Tag {
    key: Int!
    value: String!
    createdBy: String!
    created: String!
  }
`;
