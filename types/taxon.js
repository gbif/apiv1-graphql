import { gql } from 'apollo-server'
import request from '../request'
import { occurrenceSearch } from './occurrence'
import { gbifApi } from '../config'

export const typeDef = gql`
  extend type Query {
    taxon(key: String!): Taxon
  }

  type Taxon {
    scientificName: String
    kingdom: String
    key: String
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
    taxon: (parent, {key}, {loaders}) => loaders.taxonByKey.load(key)
  },
  TaxonBreakdown: {
    taxon: ({name}, params, {loaders}) => loaders.taxonByKey.load(name),
    occurrences: (parent, params, context={}) => {
      return occurrenceSearch({...parent._query, kingdomKey: parent.name, ...params})
    }
  }
};

export const taxonByKey = key => request.get(`${gbifApi}/species/${key}`).then((res) => res.body);
//export const taxonByKey = key => request.get(`${gbifApi}/species/${key[0]}`).then((res) => [res.body]);

/*
type TaxonBreakdown {
  taxon: Taxon!
  count: Int
  name: String
}
*/