import { gql } from 'apollo-server'
import queryString from 'query-string'
import { gbifApi } from '../../config'
import request from '../../request'

export const typeDef = gql`
  type TaxonName {
    bracketAuthorship: String
    bracketYear: String
    canonicalName: String
    canonicalNameComplete: String
    canonicalNameWithMarker: String
    genusOrAbove: String
    key: String!
    parsed: Boolean
    parsedPartially: Boolean
    rankMarker: String
    scientificName: String
    specificEpithet: String
    type: NameType
  }

  type MediaListResult {
    results: [TaxonMedia]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonMedia {
    audience: String
    created: DateTime
    creator: String
    description: String
    format: String
    identifier: URL
    publisher: String
    references: URL
    source: String
    taxonKey: Int
    title: String
    type: MediaType
  }

  type TaxonDescriptionResult {
    results: [TaxonDescription]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonDescription {
    description: String
    key: Int!
    language: String # unfortunately this is free text
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
    type: String
  }

  type TaxonDistributionResult {
    results: [TaxonDistribution]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonDistribution {
    country: Country
    establishmentMeans: EstablishmentMeans
    locality: String
    locationId: String
    source: String
    sourceTaxonKey: Int!
    status: OccurrenceStatus
    taxonKey: Int!
    threatStatus: String
  }

  type TaxonReferenceResult {
    results: [TaxonReference]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonReference {
    citation: String
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
    type: String
  }

  type TaxonProfileResult {
    results: [TaxonReference]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonProfile {
    extinct: Boolean
    habitat: String
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
  }

  type TaxonVernacularNameResult {
    results: [TaxonVernacularName]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonVernacularName {
    country: Country
    language: String # can be empty
    source: String
    sourceTaxonKey: Int!
    taxonKey: Int!
    vernacularName: String!
  }

  type TaxonTypeSpecimenResult {
    results: [TaxonTypeSpecimen]!
    limit: Int!
    offset: Int!
    endOfRecords: Boolean!
  }

  type TaxonTypeSpecimen {
    scientificName: String
    source: String
    sourceTaxonKey: Int
    taxonKey: Int!
    typeDesignatedBy: String
  }

  extend type Taxon {
    """
    Lists all direct child usages for a name usage
    """
    children(limit: Int, offset: Int): TaxonListResult
    """
    Lists all parent usages for a name usage
    """
    parents: [Taxon]
    """
    Lists all related name usages in other checklists
    """
    related(limit: Int, offset: Int): TaxonListResult
    """
    Lists all synonyms for a name usage
    """
    synonyms(limit: Int, offset: Int): TaxonListResult
    """
    Gets the verbatim name usage
    """
    verbatim: JSON
    """
    Gets the parsed name for a name usage
    """
    name: TaxonName
    """
    Lists all media items for a name usage
    """
    media: MediaListResult
    """
    Lists all descriptions for a name usage
    """
    descriptions(limit: Int, offset: Int): TaxonDescriptionResult
    """
    Lists all distributions for a name usage
    """
    distributions(limit: Int, offset: Int): TaxonDistributionResult
    
    """
    Lists all references for a name usage
    """
    references(limit: Int, offset: Int): TaxonReferenceResult

    """
    Lists all species profiles for a name usage
    """
    profiles(limit: Int, offset: Int): TaxonProfileResult

    """
    Lists all vernacular names for a name usage
    """
    vernacularNames(limit: Int, offset: Int): TaxonVernacularNameResult

    """
    Lists all type specimens for a name usage, see also lmitations: https://github.com/gbif/portal-feedback/issues/1146#issuecomment-366260607
    """
    typeSpecimens(limit: Int, offset: Int): TaxonTypeSpecimenResult
  }
`;

export const resolvers = {
  Taxon: {
    children: (parent, params, context={}) => taxonSubListPaged('children')(parent.key, params),
    parents: (parent, params, context={}) => taxonSubListPaged('parents')(parent.key, params),
    related: (parent, params, context={}) => taxonSubListPaged('related')(parent.key, params),
    synonyms: (parent, params, context={}) => taxonSubListPaged('synonyms')(parent.key, params),
    verbatim: (parent, params, context={}) => taxonSubList('verbatim')(parent.key, params),
    media: (parent, params, context={}) => taxonSubListPaged('media')(parent.key, params),
    name: (parent, params, context={}) => taxonSubList('name')(parent.key, params),
    descriptions: (parent, params, context={}) => taxonSubListPaged('descriptions')(parent.key, params),
    distributions: (parent, params, context={}) => taxonSubListPaged('distributions')(parent.key, params),
    references: (parent, params, context={}) => taxonSubListPaged('references')(parent.key, params),
    profiles: (parent, params, context={}) => taxonSubListPaged('speciesProfiles')(parent.key, params),
    vernacularNames: (parent, params, context={}) => taxonSubListPaged('vernacularNames')(parent.key, params),
    typeSpecimens: (parent, params, context={}) => taxonSubListPaged('typeSpecimens')(parent.key, params),
  }
};

const taxonSubListPaged = resource => (key, params) => {
  const url = `${gbifApi}/species/${key}/${resource}?${queryString.stringify(params)}`;
  return request.get(url).then(res => res.body)
}

const taxonSubList = resource => (key, params) => {
  const url = `${gbifApi}/species/${key}/${resource}`;
  return request.get(url).then(res => res.body)
}