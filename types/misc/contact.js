import { gql } from 'apollo-server'

export const typeDef = gql`
  type Contact {
    key: Int!
    type: String!
    firstName: String
    lastName: String
    position: [String]
    email: [EmailAddress]
    phone: [String]
    homepage: [URL]
    address: [String]
    organization: String
    country: String
  }
`;