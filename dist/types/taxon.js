"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.checklistRoots = exports.getTaxonFacet = exports.taxonSearch = exports.formatedScientificNameByKey = exports.taxonByKey = exports.typeDef = void 0;

var _apolloServer = require("apollo-server");

var _queryString = _interopRequireDefault(require("query-string"));

var _config = require("../config");

var _request = _interopRequireDefault(require("../request"));

var _occurrence = require("./occurrence");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const typeDef = _apolloServer.gql`
  extend type Query {
    taxonList(  limit: Int, 
                offset: Int,
                q: String, 
                datasetKey: [ID], 
                rank: [Rank], 
                highertaxonKey: [Int], 
                status: [TaxonomicStatus], 
                isExtinct: Boolean, 
                habitat: [Habitat], 
                nameType: [NameType], 
                nomenclaturalStatus: [NomenclaturalStatus], 
                issue: [NameUsageIssue], 
                hl: String
              ): TaxonSearchResult
    taxon(key: Int!): Taxon
    checklistRoots(key: ID!): TaxonListResult
  }

  type TaxonSearchResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
    count: Int!
    facet: TaxonFacet
  }

  type TaxonListResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type Taxon {
    key: Int!
    nubKey: Int

    kingdom: String
    phylum: String
    class: String
    order: String
    family: String
    genus: String
    species: String
    kingdomKey: Int
    phylumKey: Int
    classKey: Int
    orderKey: Int
    familyKey: Int
    genusKey: Int
    speciesKey: Int

    accepted: String
    acceptedKey: Int
    authorship: String
    canonicalName: String
    constituentKey: ID
    constituent: Dataset
    constituentTitle: String
    datasetKey: ID
    dataset: Dataset
    datasetTitle: String!
    issues: [String]

    lastCrawled: String
    lastInterpreted: String
    nameKey: Int
    nameType: NameType
    nomenclaturalStatus: [NomenclaturalStatus]
    numDescendants: Int
    origin: Origin
    parent: String
    parentKey: Int
    rank: Rank
    remarks: String
    scientificName: String
    sourceTaxonKey: Int
    synonym: Boolean
    taxonID: String
    taxonomicStatus: String
    vernacularName: String
    """
    The scientific name  as HTML
    """
    formatedName: String!
  }

  type TaxonBreakdown {
    count: Int
    name: String
    taxon: Taxon
    occurrences(limit: Int, facetLimit: Int): OccurrenceResult
  }

  type TaxonFacet {
    rank(limit: Int, offset: Int): [facetCount]
  }
`;
exports.typeDef = typeDef;

const taxonByKey = key => _request.default.get(`${_config.gbifApi}/species/${key}`).then(res => res.body);

exports.taxonByKey = taxonByKey;

const formatedScientificNameByKey = key => _request.default.get(`http://www.gbif.org/api/species/${key}/name`).then(res => res.body.n);

exports.formatedScientificNameByKey = formatedScientificNameByKey;

const taxonSearch = params => {
  const url = `${_config.gbifApi}/species/search?${_queryString.default.stringify(params)}`;
  return _request.default.get(url).then(res => ({ ...res.body,
    _query: params
  }));
};

exports.taxonSearch = taxonSearch;

const getTaxonFacet = facetKey => (parent, {
  limit = 10,
  offset = 0
}, context) => {
  return taxonSearch({ ...parent._query,
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

exports.getTaxonFacet = getTaxonFacet;

const checklistRoots = (key, params) => {
  const url = `${_config.gbifApi}/species/root/${key}?${_queryString.default.stringify(params)}`;
  return _request.default.get(url).then(res => res.body);
};

exports.checklistRoots = checklistRoots;
const resolvers = {
  Query: {
    taxon: (parent, {
      key
    }, {
      loaders
    }) => loaders.taxonByKey.load(key),
    taxonList: (parent, params, context = {}) => taxonSearch(params),
    checklistRoots: (parent, {
      key,
      ...params
    }, context = {}) => checklistRoots(key, params)
  },
  Taxon: {
    formatedName: ({
      key
    }, params, {
      loaders
    }) => loaders.formatedScientificNameByKey.load(key),
    dataset: ({
      datasetKey
    }, params, {
      loaders
    }) => loaders.datasetByKey.load(datasetKey),
    datasetTitle: ({
      datasetKey
    }, params, {
      loaders
    }) => loaders.datasetByKey.load(datasetKey).then(data => data.title),
    constituent: ({
      constituentKey
    }, params, {
      loaders
    }) => {
      if (typeof constituentKey === 'undefined') return null;
      return loaders.datasetByKey.load(constituentKey);
    },
    constituentTitle: ({
      constituentKey
    }, params, {
      loaders
    }) => {
      if (typeof constituentKey === 'undefined') return null;
      return loaders.datasetByKey.load(constituentKey).then(data => data.title);
    }
  },
  TaxonSearchResult: {
    facet: parent => ({
      _query: parent._query
    })
  },
  TaxonFacet: {
    rank: getTaxonFacet('rank')
  },
  TaxonBreakdown: {
    taxon: ({
      name
    }, params, {
      loaders
    }) => loaders.taxonByKey.load(name),
    occurrences: (parent, params, context = {}) => {
      return (0, _occurrence.occurrenceSearch)({ ...parent._query,
        kingdomKey: parent.name,
        ...params
      });
    }
  }
};
exports.resolvers = resolvers;