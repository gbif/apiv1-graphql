"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

const typeDef = _apolloServer.gql`
  type Contact {
    key: ID!
    address: JSON
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
  }
`;
exports.typeDef = typeDef;