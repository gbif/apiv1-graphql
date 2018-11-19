import { gql } from 'apollo-server'
import request from '../request'
import { gbifApi } from '../config'

export const typeDef = gql`
  extend type Query {
    dataset(key: String!): Dataset
  }

  type Dataset {
    title: String
  }

  type DatasetBreakdown {
    count: Int
    name: String
    dataset: Dataset
  }
`;

export const datasetByKey = key => request.get(`${gbifApi}/dataset/${key}`).then((res) => res.body);

export const resolvers = {
  Query: {
    dataset: (parent, {key}) => datasetByKey(key)
  },
  DatasetBreakdown: {
    dataset: ({name}) => datasetByKey(name)
  }
};