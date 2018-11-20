import { gql } from 'apollo-server'
import request from '../request'
import { gbifApi } from '../config'

export const typeDef = gql`
  extend type Query {
    dataset(key: String!): Dataset
  }

  type Dataset {
    key: ID!
    bibliographicCitations: [BibliographicCitation]
    citation: Citation
    collections: [JSON]
    comments: [JSON]
    contacts: [Contact]
    countryCoverage: [JSON]
    created: DateTime
    createdBy: String
    curatorialUnits: [JSON]
    dataDescriptions: [JSON]
    dataLanguage: String
    decades: [Int]
    description: String
    doi: String
    endpoints: [Endpoint]
    external: Boolean
    geographicCoverages: [GeographicCoverage]
    homepage: URL
    hostingOrganizationKey: ID
    hostingOrganizationTitle: String
    identifiers: [Identifier]
    installationKey: String
    keywordCollections: [KeywordCollection]
    keywords: [String!]
    language: Language
    license: String
    lockedForAutoUpdate: Boolean
    logoUrl: URL
    machineTags: [MachineTag]
    maintenanceDescription: String
    maintenanceUpdateFrequency: String
    modified: DateTime
    modifiedBy: String
    numConstituents: Int
    project: Project
    projectIdentifier: ID
    pubDate: DateTime
    publishingCountry: Country
    publishingOrganizationKey: ID!
    publishingOrganizationTitle: String
    publishingOrganization: Organization
    recordCount: Int
    samplingDescription: SamplingDescription
    tags: [Tag]
    taxonomicCoverages: [TaxonomicCoverage]
    temporalCoverages: [JSON]
    title: String
    type: DatasetType
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

  type BibliographicCitation {
    identifier: String
    text: String
  }

  type Citation {
    text: String!
  }

  type GeographicCoverage {
    description: String
    boundingBox: BoundingBox
  }

  type BoundingBox {
    minLatitude: Float,
    maxLatitude: Float,
    minLongitude: Float,
    maxLongitude: Float,
    globalCoverage: Boolean
  }

  type KeywordCollection {
    thesaurus: String
    keywords: [String]
  }

  type SamplingDescription {
    studyExtent: String
    sampling: String
    qualityControl: String
    methodSteps: [String]
  }

  type Project {
    title: String
    identifier: ID
    contacts: [Contact]
    abstract: String
    funding: String
    studyAreaDescription: String
    designDescription: String
  }
`;

export const datasetByKey = key => request.get(`${gbifApi}/dataset/${key}`).then((res) => res.body);

export const resolvers = {
  Query: {
    dataset: (parent, {key}) => datasetByKey(key)
  },
  Dataset: {
    publishingOrganization: ({publishingOrganizationKey}, params, {loaders}) => loaders.organizationByKey.load(publishingOrganizationKey),
  },
  DatasetBreakdown: {
    dataset: ({name}) => datasetByKey(name)
  }
};