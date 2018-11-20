import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../config'
import request from '../request'

import { occurrenceSearch } from './occurrence'

export const typeDef = gql`
  extend type Query {
    taxonList(limit: Int, q: String, datasetKey: String, rank: String): TaxonSearchResult
    taxon(key: Int!): Taxon
  }

  type TaxonSearchResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
    count: Int!
  }

  type TaxonListResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
  }

  type Taxon {
    key: Int!
    accepted: String
    acceptedKey: Int
    authorship: String
    canonicalName: String
    class: String
    classKey: Int
    constituentKey: ID
    constituent: Dataset
    constituentTitle: String
    datasetKey: ID
    dataset: Dataset
    datasetTitle: String!
    genus: String
    genusKey: Int
    issues: [String]
    kingdom: String
    kingdomKey: Int
    lastCrawled: String
    lastInterpreted: String
    nameKey: Int
    nameType: NameType
    nomenclaturalStatus: [NomenclaturalStatus]
    nubKey: Int
    numDescendants: Int
    order: String
    orderKey: Int
    origin: Origin
    parent: String
    parentKey: Int
    phylum: String
    phylumKey: Int
    rank: Rank
    remarks: String
    scientificName: String
    sourceTaxonKey: Int
    species: String
    speciesKey: Int
    synonym: Boolean
    taxonID: String
    taxonomicStatus: String
    vernacularName: String
    """
    The scientific name  as HTML
    """
    formatedName: String!
    children: TaxonListResult
    parents: [Taxon]
    related: TaxonListResult
    synonyms: TaxonListResult
  }

  type TaxonBreakdown {
    count: Int
    name: String
    taxon: Taxon
    occurrences(limit: Int, facetLimit: Int): OccurrenceResult
  }
`;

export const resolvers = {
  Query: {
    taxon: (parent, {key}, {loaders}) => loaders.taxonByKey.load(key),
    taxonList: (parent, params, context={}) => taxonSearch(params)
  },
  Taxon: {
    formatedName: ({key}, params, {loaders}) => loaders.formatedScientificNameByKey.load(key),
    dataset: ({datasetKey}, params, {loaders}) => loaders.datasetByKey.load(datasetKey),
    datasetTitle: ({datasetKey}, params, {loaders}) => loaders.datasetByKey.load(datasetKey).then(data => data.title),
    constituent: ({constituentKey}, params, {loaders}) => {
      if (typeof constituentKey === 'undefined') return null;
      return loaders.datasetByKey.load(constituentKey)
    },
    constituentTitle: ({constituentKey}, params, {loaders}) => {
      if (typeof constituentKey === 'undefined') return null;
      return loaders.datasetByKey.load(constituentKey).then(data => data.title)
    },
    children: (parent, params, context={}) => taxonChildren(parent.key, params),
    parents: (parent, params, context={}) => taxonParents(parent.key, params),
    related: (parent, params, context={}) => taxonRelated(parent.key, params),
    synonyms: (parent, params, context={}) => taxonSynonyms(parent.key, params),
  },
  TaxonBreakdown: {
    taxon: ({name}, params, {loaders}) => loaders.taxonByKey.load(name),
    occurrences: (parent, params, context={}) => {
      return occurrenceSearch({...parent._query, kingdomKey: parent.name, ...params})
    }
  }
};

export const taxonByKey = key => request.get(`${gbifApi}/species/${key}`).then((res) => res.body);
export const formatedScientificNameByKey = key => request.get(`http://www.gbif.org/api/species/${key}/name`).then((res) => res.body.n);

export const taxonSearch = (params) => {
  const url = `${gbifApi}/species/search?${queryString.stringify(params)}`;
  return request.get(url).then(res => ({...res.body, _query: params}))
}

export const taxonChildren = (key, params) => {
  const url = `${gbifApi}/species/${key}/children?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}

export const taxonParents = (key, params) => {
  const url = `${gbifApi}/species/${key}/parents?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}

export const taxonRelated = (key, params) => {
  const url = `${gbifApi}/species/${key}/related?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}

export const taxonSynonyms = (key, params) => {
  const url = `${gbifApi}/species/${key}/synonyms?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}