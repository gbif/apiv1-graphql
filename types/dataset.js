import { gql } from 'apollo-server'
import request from '../request'
import { gbifApi } from '../config'

export const typeDef = gql`
  extend type Query {
    dataset(key: String!): Dataset
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

export const datasetByKey = key => request.get(`${gbifApi}/dataset/${key}`).then((res) => res.body);

export const resolvers = {
  Query: {
    dataset: (parent, {key}) => datasetByKey(key)
  },
  Dataset: {
    organization: ({publishingOrganizationKey}, params, {loaders}) => loaders.organizationByKey.load(publishingOrganizationKey),
  },
  DatasetBreakdown: {
    dataset: ({name}) => datasetByKey(name)
  }
};