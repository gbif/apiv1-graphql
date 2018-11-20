import { gql } from 'apollo-server'

export const typeDef = gql`
  type MachineTag {
    key: ID!
    namespace: String!
    name: String!
    value: String!
    createdBy: String!
    created: String!
  }
`;
