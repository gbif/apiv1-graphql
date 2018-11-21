"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.datasetByKey = exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

var _request = _interopRequireDefault(require("../request"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDef = _apolloServer.gql`
  extend type Query {
    literature(key: String!): Dataset
  }

  type Dataset {
    title: String
    type: DatasetType
    publishingOrganizationKey: String!
    organization: Organization
    taxonomicCoverages: [TaxonomicCoverage]
    contacts: [Contact]
    identifiers: [Identifier]
    endpoints: [Endpoint]
    machineTags: [MachineTag]
    tags: [Tag]
  }

  type DatasetBreakdown {
    count: Int
    name: String
    dataset: Dataset
  }

  type TaxonomicCoverage {
    description: String
    coverages: [TaxonCoverage]
  }

  type TaxonCoverage {
    scientificName: String
    rank: TaxonCoverageRank
  }

  type TaxonCoverageRank {
    verbatim: String
    interpreted: String
  }
`;
exports.typeDef = typeDef;

const datasetByKey = key => _request.default.get(`${_config.gbifApi}/dataset/${key}`).then(res => res.body);

exports.datasetByKey = datasetByKey;
const resolvers = {
  Query: {
    dataset: (parent, {
      key
    }) => datasetByKey(key)
  },
  Dataset: {
    organization: ({
      publishingOrganizationKey
    }, params, {
      loaders
    }) => loaders.organizationByKey.load(publishingOrganizationKey)
  },
  DatasetBreakdown: {
    dataset: ({
      name
    }) => datasetByKey(name)
  }
};
exports.resolvers = resolvers;