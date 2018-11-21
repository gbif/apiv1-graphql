"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

const typeDef = _apolloServer.gql`
  type Comment {
    key: ID!
    content: String
    createdBy: String!
    created: DateTime!
    modified: DateTime
    modifiedBy: String
  }
`;
exports.typeDef = typeDef;