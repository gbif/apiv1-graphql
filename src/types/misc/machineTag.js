import { gql } from 'apollo-server'

export const typeDef = gql`
  type MachineTag {
    key: ID!
    namespace: TagNamespace!
    name: String!
    value: String!
    createdBy: String!
    created: String!
  }
`;
