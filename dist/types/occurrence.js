"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.getOccurrenceFacet = exports.occurrenceSearch = exports.occurrenceByKey = exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

var _queryString = _interopRequireDefault(require("query-string"));

var _config = require("../config");

var _request = _interopRequireDefault(require("../request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDef = _apolloServer.gql`
  extend type Query {
    occurrenceList(limit: Int, q: String, taxonKey: Int, basisOfRecord: [BasisOfRecord]): OccurrenceResult
    occurrence(key: String!): Occurrence
  }

  type Occurrence {
    scientificName: String
    basisOfRecord: String
    datasetKey: String
    kingdomKey: String
    kingdom: String
    taxon: Taxon
  }

  type OccurrenceResult {
    results: [Occurrence]
    limit: Int
    offset: Int
    count: Int
    facet: OccurrenceFacet
  }

  type facetCount {
    name: String
    count: Int
  }

  type OccurrenceFacet {
    kingdom(limit: Int, offset: Int): [TaxonBreakdown]
    species(limit: Int, offset: Int): [TaxonBreakdown]
    dataset(limit: Int, offset: Int): [DatasetBreakdown]
    recordedBy(limit: Int, offset: Int): [facetCount]
    country(limit: Int, offset: Int): [facetCount]
  }
`;
exports.typeDef = typeDef;

const occurrenceByKey = key => _request.default.get(`${_config.gbifApi}/occurrence/${key}`).then(res => res.body);

exports.occurrenceByKey = occurrenceByKey;

const occurrenceSearch = params => {
  const url = `${_config.gbifApi}/occurrence/search?${_queryString.default.stringify(params)}`;
  return _request.default.get(url).then(res => ({ ...res.body,
    _query: params
  }));
};

exports.occurrenceSearch = occurrenceSearch;

const getOccurrenceFacet = facetKey => (parent, {
  limit = 10,
  offset = 0
}, context) => {
  return occurrenceSearch({ ...parent._query,
    limit: 0,
    facet: facetKey,
    facetLimit: limit,
    facetOffset: offset
  }).then(data => [...data.facets[0].counts.map(facet => ({ ...facet,
    _query: { ...parent._query,
      [facetKey]: facet.name
    }
  }))]);
};

exports.getOccurrenceFacet = getOccurrenceFacet;
const resolvers = {
  Query: {
    occurrenceList: (parent, params, context = {}) => {
      return occurrenceSearch(params);
    },
    occurrence: (parent, {
      key
    }) => occurrenceByKey(key)
  },
  Occurrence: {
    taxon: ({
      taxonKey
    }, params, {
      loaders
    }) => {
      return loaders.taxonByKey.load(taxonKey);
    }
  },
  OccurrenceResult: {
    facet: parent => ({
      _query: parent._query
    })
  },
  OccurrenceFacet: {
    kingdom: getOccurrenceFacet('kingdomKey'),
    dataset: getOccurrenceFacet('datasetKey'),
    species: getOccurrenceFacet('speciesKey'),
    recordedBy: getOccurrenceFacet('recordedBy'),
    country: getOccurrenceFacet('country')
  }
};
exports.resolvers = resolvers;