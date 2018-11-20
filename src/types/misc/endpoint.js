import { gql } from 'apollo-server'

export const typeDef = gql`
  type Endpoint {
    key: ID!
    type: String!
    identifier: String
    url: URL
    createdBy: String!
    created: DateTime!
    modified: String
    machineTags: [MachineTag]
  }
`;