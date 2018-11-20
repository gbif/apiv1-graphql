import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../config'
import request from '../request'

export const typeDef = gql`
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
    kingdom: [TaxonBreakdown]
    species: [TaxonBreakdown]
    dataset: [DatasetBreakdown]
    recordedBy: [facetCount]
    country: [facetCount]
  }
`;

export const occurrenceByKey = key => request.get(`${gbifApi}/occurrence/${key}`).then((res) => res.body);

export const occurrenceSearch = (params) => {
  const url = `${gbifApi}/occurrence/search?${queryString.stringify(params)}`;
  return request.get(url).then(res => ({...res.body, _query: params}))
}

export const getOccurrenceFacet = (facetKey) => 
  (parent, params, context) => {
    return occurrenceSearch({...parent._query, limit: 0, facet: facetKey})
      .then(data => (
        [
          ...data.facets[0].counts
            .map(
              facet => ({...facet, _query: {...parent._query, [facetKey]: facet.name}})
            )
        ]
      )
    );
  }


export const resolvers = {
  Query: {
    occurrenceList: (parent, params, context={}) => {
      return occurrenceSearch(params)
    },
    occurrence: (parent, {key}) => occurrenceByKey(key),
  },
  Occurrence: {
    taxon: ({taxonKey}, params, {loaders}) => {
      return loaders.taxonByKey.load(taxonKey)
    }
  },
  OccurrenceResult: {
    facet: (parent) => ({_query: parent._query})
  },
  OccurrenceFacet: {
    kingdom: getOccurrenceFacet('kingdomKey'),
    dataset: getOccurrenceFacet('datasetKey'),
    species: getOccurrenceFacet('speciesKey'),
    recordedBy: getOccurrenceFacet('recordedBy'),
    country: getOccurrenceFacet('country'),
  }
};
