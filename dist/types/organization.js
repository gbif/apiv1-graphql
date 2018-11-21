"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.organizationSearch = exports.organizationByKey = exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

var _queryString = _interopRequireDefault(require("query-string"));

var _config = require("../config");

var _request = _interopRequireDefault(require("../request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDef = _apolloServer.gql`
  extend type Query {
    organizationList(limit: Int, q: String, taxonKey: Int): OrganizationResult
    organization(key: String!): Organization
  }

  type Organization {
    abbreviation: String
    address: [String]
    city: String
    comments: [Comment]
    contacts: [Contact]
    country: Country
    created: DateTime
    createdBy: String
    description: String
    email: [JSON]
    endorsementApproved: Boolean
    endorsingNodeKey: ID
    endpoints: [Endpoint]
    homepage: [URL]
    identifiers: [Identifier]
    key: ID!
    language: Language
    latitude: Float
    logoUrl: URL
    longitude: Int
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    numPublishedDatasets: Int
    phone: [String]
    postalCode: String
    province: String
    tags: [Tag]
    title: String
  }

  type OrganizationResult {
    results: [Organization]
    limit: Int
    offset: Int
    count: Int
  }

  type OrganizationBreakdown {
    count: Int
    name: String
    organization: Organization
  }
`;
exports.typeDef = typeDef;

const organizationByKey = key => _request.default.get(`${_config.gbifApi}/organization/${key}`).then(res => res.body);

exports.organizationByKey = organizationByKey;

const organizationSearch = params => {
  const url = `${_config.gbifApi}/organization?${_queryString.default.stringify(params)}`;
  return _request.default.get(url).then(res => ({ ...res.body,
    _query: params
  }));
};

exports.organizationSearch = organizationSearch;
const resolvers = {
  Query: {
    organization: (parent, {
      key
    }) => organizationByKey(key),
    organizationList: (parent, params, context = {}) => {
      return organizationSearch(params);
    }
  },
  OrganizationBreakdown: {
    organization: ({
      name
    }) => organizationByKey(name)
  }
};
exports.resolvers = resolvers;