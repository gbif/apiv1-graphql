const { gql } = require('apollo-server');

const typeDef = gql`
  type Contact {
    key: ID!
    address: [String]!
    city: String
    country: Country
    created: DateTime
    createdBy: String
    email: [EmailAddress]
    firstName: String
    homepage: [URL]
    lastName: String
    modified: DateTime
    modifiedBy: String
    organization: String
    phone: [String]
    position: [String]
    postalCode: String
    primary: Boolean
    province: String
    type: String
    userId: [String]
    roles: [String]
    _highlighted: Boolean
  }
`;

module.exports = typeDef;