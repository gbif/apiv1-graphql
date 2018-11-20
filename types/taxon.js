import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../config'
import request from '../request'

import { occurrenceSearch } from './occurrence'

export const typeDef = gql`
  extend type Query {
    taxonList(limit: Int, q: String, datasetKey: String, rank: String): TaxonResult
    taxon(key: String!): Taxon
  }

  type TaxonResult {
    results: [Taxon]!
    limit: Int!
    offset: Int!
    count: Int!
  }

  type Taxon {
    scientificName: String!
    kingdomKey: Int
    kingdom: String
    phylumKey: Int
    phylum: String
    classKey: Int
    class: String
    orderKey: Int
    order: String
    familyKey: Int
    family: String
    genusKey: Int
    genus: String
    speciesKey: Int
    species: String
    key: Int!
    nubKey: Int!
    rank: String
    """
    The scientific name  as HTML
    """
    formatedName: String!
    datasetKey: String!
    constituentKey: String
    dataset: Dataset
    datasetTitle: String!
    constituent: Dataset
    constituentTitle: String
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
    taxonList: (parent, params, context={}) => {
      return taxonSearch(params)
    }
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
    }
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