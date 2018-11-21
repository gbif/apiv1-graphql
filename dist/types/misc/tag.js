"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

const typeDef = _apolloServer.gql`
  type Tag {
    key: ID!
    value: String!
    createdBy: String!
    created: String!
  }
`;
exports.typeDef = typeDef;