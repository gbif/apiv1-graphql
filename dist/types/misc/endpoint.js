"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

const typeDef = _apolloServer.gql`
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
exports.typeDef = typeDef;