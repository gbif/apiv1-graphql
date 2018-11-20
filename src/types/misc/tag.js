import { gql } from 'apollo-server'

export const typeDef = gql`
  type Tag {
    key: ID!
    value: String!
    createdBy: String!
    created: String!
  }
`;
