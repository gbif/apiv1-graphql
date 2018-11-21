import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../config'
import request from '../request'

export const typeDef = gql`
  extend type Query {
    organizationList(limit: Int, q: String, taxonKey: Int): OrganizationResult
    organization(key: String!): Organization
  }

  type Organization {
    abbreviation: String
    address: [String]
    city: String
    comments: [Comment]
    contacts: [Contact]
    country: Country
    created: DateTime
    createdBy: String
    description: String
    email: [JSON]
    endorsementApproved: Boolean
    endorsingNodeKey: ID
    endpoints: [Endpoint]
    homepage: [URL]
    identifiers: [Identifier]
    key: ID!
    language: Language
    latitude: Float
    logoUrl: URL
    longitude: Int
    machineTags: [MachineTag]
    modified: DateTime
    modifiedBy: String
    numPublishedDatasets: Int
    phone: [String]
    postalCode: String
    province: String
    tags: [Tag]
    title: String
  }

  type OrganizationResult {
    results: [Organization]
    limit: Int
    offset: Int
    count: Int
  }

  type OrganizationBreakdown {
    count: Int
    name: String
    organization: Organization
  }
`;

export const organizationByKey = key => request.get(`${gbifApi}/organization/${key}`).then((res) => res.body);

export const organizationSearch = (params) => {
  const url = `${gbifApi}/organization?${queryString.stringify(params)}`;
  return request.get(url).then(res => ({...res.body, _query: params}))
}

export const resolvers = {
  Query: {
    organization: (parent, {key}) => organizationByKey(key),
    organizationList: (parent, params, context={}) => {
      return organizationSearch(params)
    }
  },
  OrganizationBreakdown: {
    organization: ({name}) => organizationByKey(name)
  }
};