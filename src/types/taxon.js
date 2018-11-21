import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../config'
import request from '../request'

import { occurrenceSearch } from './occurrence'

export const typeDef = gql`
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
`;

export const resolvers = {
  Query: {
    taxon: (parent, {key}, {loaders}) => loaders.taxonByKey.load(key),
    taxonList: (parent, params, context={}) => taxonSearch(params),
    checklistRoots: (parent, {key, ...params}, context={}) => checklistRoots(key, params),
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

export const checklistRoots = (key, params) => {
  const url = `${gbifApi}/species/root/${key}?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}