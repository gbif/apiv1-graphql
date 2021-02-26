const { gql } = require('apollo-server');

const typeDef = gql`
  extend type Query {
    occurrenceSearch(
      limit: Int, 
      offset: Int, 
      q: String,
      basisOfRecord: BasisOfRecord,
      catalogNumber: String,
      classKey: ID,
      collectionCode: String,
      continent: Continent,
      coordinateUncertaintyInMeters: String,
      country: Country,
      crawlId: ID,
      datasetKey: ID,
      decimalLatitude: String,
      decimalLongitude: String,
      depth: String,
      elevation: String,
      establishmentMeans: String,
      eventDate: String,
      eventId: String,
      familyKey: ID,
      gadmGid: String,
      gadmLevel0Gid: String,
      gadmLevel1Gid: String,
      gadmLevel2Gid: String,
      gadmLevel3Gid: String,
      genusKey: ID,
      geometry: String,
      hasCoordinate: Boolean,
      hasGeospatialIssue: Boolean,
      identifiedBy: String,
      identifiedByID: String,
      institutionCode: String,
      issue: OccurrenceIssue,
      kingdomKey: String,
      lastInterpreted: String,
      license: License,
      locality: String,
      mediaType: MediaType,
      month: Int,
      networkKey: ID,
      occurrenceId: String,
      occurrenceStatus: OccurrenceStatus,
      orderKey: ID,
      organismId: String,
      organismQuantity: Float,
      organismQuantityType: String,
      phylumKey: ID,
      programme: String,
      projectId: String,
      protocol: String,
      publishingCountry: Country,
      publishingOrg: ID,
      recordNumber: String,
      recordedBy: String,
      recordedByID: String,
      relativeOrganismQuantity: String,
      repatriated: Boolean,
      sampleSizeUnit: String,
      sampleSizeValue: String,
      samplingProtocol: String,
      scientificName: String,
      speciesKey: ID,
      stateProvince: String,
      subgenusKey: ID,
      taxonKey: ID,
      typeStatus: TypeStatus,
      verbatimScientificName: String,
      verbatimTaxonId: String,
      waterBody: String,
      year: String
      ): OccurrenceSearchResults
    occurrence(key: ID!): Occurrence
  }

  type OccurrenceSearchResults {
    results: [Occurrence]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
    facet: OccurrenceFacet
    _query: JSON
  }

  type Occurrence {
    key: ID
    
    abstract: String
    acceptedNameUsage: String
    acceptedNameUsageID: String
    acceptedScientificName: String
    acceptedTaxonKey: ID
    accessRights: String
    accrualMethod: String
    accrualPeriodicity: String
    accrualPolicy: String
    alternative: String
    associatedMedia: String
    associatedOccurrences: String
    associatedOrganisms: String
    associatedReferences: String
    associatedSequences: String
    associatedTaxa: String
    audience: String
    available: String
    basisOfRecord: String
    bed: String
    behavior: String
    bibliographicCitation: String
    catalogNumber: String
    class: String
    classKey: ID
    collectionCode: String
    collectionID: String
    conformsTo: String
    continent: String
    contributor: String
    coordinatePrecision: Float
    coordinateUncertaintyInMeters: Float
    country: String
    countryCode: Country
    county: String
    coverage: String
    crawlId: ID
    created: DateTime
    creator: String
    dataGeneralizations: String
    datasetID: String
    datasetKey: ID
    datasetName: String
    date: DateTime
    dateAccepted: String
    dateCopyrighted: String
    dateIdentified: DateTime
    dateSubmitted: String
    day: Int
    decimalLatitude: Float
    decimalLongitude: Float
    depth: Float
    depthAccuracy: Float
    description: String
    disposition: String
    # Unclear how these terms are to be indexed or displayed
    # distanceAboveSurface: Float
    # distanceAboveSurfaceAccuracy: String
    dynamicProperties: String
    earliestAgeOrLowestStage: String
    earliestEonOrLowestEonothem: String
    earliestEpochOrLowestSeries: String
    earliestEraOrLowestErathem: String
    earliestPeriodOrLowestSystem: String
    educationLevel: String
    elevation: Float
    elevationAccuracy: Float
    endDayOfYear: Int
    establishmentMeans: String
    eventDate: DateTime
    eventID: String
    eventRemarks: String
    eventTime: String
    extensions: JSON
    extent: String
    # Unclear what this field contains
    # facts: [JSON]
    family: String
    familyKey: ID
    fieldNotes: String
    fieldNumber: String
    footprintSRS: String
    footprintSpatialFit: String
    footprintWKT: String
    format: String
    formation: String
    gadm: JSON
    genericName: String
    genus: String
    genusKey: ID
    geodeticDatum: String
    geologicalContextID: String
    georeferenceProtocol: String
    georeferenceRemarks: String
    georeferenceSources: String
    georeferenceVerificationStatus: String
    georeferencedBy: String
    georeferencedDate: String
    group: String
    habitat: String
    hasFormat: String
    hasPart: String
    hasVersion: String
    higherClassification: String
    higherGeography: String
    higherGeographyID: String
    highestBiostratigraphicZone: String
    identificationID: String
    identificationQualifier: String
    identificationReferences: String
    identificationRemarks: String
    identificationVerificationStatus: String
    identifiedBy: String
    identifiedByIDs: [AssociatedID]
    identifier: String
    # Unclear what this field contains
    # identifiers: [String]
    individualCount: Int
    informationWithheld: String
    infraspecificEpithet: String
    installationKey: ID
    institutionCode: String
    institutionID: String
    instructionalMethod: String
    isFormatOf: String
    isPartOf: String
    isReferencedBy: String
    isReplacedBy: String
    isRequiredBy: String
    isVersionOf: String
    island: String
    islandGroup: String
    issued: String
    issues: [OccurrenceIssue]
    kingdom: String
    kingdomKey: ID
    language: String
    lastCrawled: DateTime
    lastParsed: DateTime
    latestAgeOrHighestStage: String
    latestEonOrHighestEonothem: String
    latestEpochOrHighestSeries: String
    latestEraOrHighestErathem: String
    latestPeriodOrHighestSystem: String
    license: License
    lifeStage: String
    lithostratigraphicTerms: String
    locality: String
    locationAccordingTo: String
    locationID: String
    locationRemarks: String
    lowestBiostratigraphicZone: String
    materialSampleID: String
    media: [MultimediaItem]
    mediator: String
    medium: String
    member: String
    modified: DateTime
    month: Int
    municipality: String
    nameAccordingTo: String
    nameAccordingToID: String
    namePublishedIn: String
    namePublishedInID: String
    namePublishedInYear: String
    networkKey: [ID]
    nomenclaturalCode: String
    nomenclaturalStatus: String
    occurrenceID: String
    occurrenceRemarks: String
    occurrenceStatus: OccurrenceStatus
    order: String
    orderKey: ID
    organismID: String
    organismName: String
    organismQuantity: String
    organismQuantityType: String
    organismRemarks: String
    organismScope: String
    originalNameUsage: String
    originalNameUsageID: String
    otherCatalogNumbers: String
    ownerInstitutionCode: String
    parentEventID: String
    parentNameUsage: String
    parentNameUsageID: String
    phylum: String
    phylumKey: ID
    pointRadiusSpatialFit: String
    preparations: String
    previousIdentifications: String
    protocol: String
    provenance: String
    """as provided on record - this can differ from the GBIF publishing organisation"""
    publisher: String
    # publishingCountry: String
    """The ID of the publisher who published this record to GBIF"""
    publishingOrgKey: ID
    recordNumber: String
    recordedBy: String
    recordedByIDs: [AssociatedID]
    references: String
    relation: String
    # Unclear what this field contains if anything
    # relations: [JSON]
    # relativeOrganismQuantity: Float # internal value that probably shouldn't be in the response ?
    replaces: String
    reproductiveCondition: String
    requires: String
    rights: String
    rightsHolder: String
    sampleSizeUnit: String
    sampleSizeValue: Float
    samplingEffort: String
    samplingProtocol: String
    scientificName: String
    scientificNameAuthorship: String
    scientificNameID: String
    sex: String
    source: String
    spatial: String
    species: String
    speciesKey: ID
    specificEpithet: String
    startDayOfYear: Int
    stateProvince: String
    subgenus: String
    subgenusKey: ID
    subject: String
    tableOfContents: String
    taxonConceptID: String
    taxonID: String
    taxonKey: ID
    taxonRank: String
    taxonRemarks: String
    taxonomicStatus: String
    temporal: String
    title: String
    type: String
    typeStatus: TypeStatus
    typifiedName: String
    valid: String
    verbatimCoordinateSystem: String
    verbatimCoordinates: String
    verbatimDepth: String
    verbatimElevation: String
    verbatimEventDate: String
    verbatimLatitude: String
    verbatimLocality: String
    verbatimLongitude: String
    verbatimSRS: String
    verbatimScientificName: String
    verbatimTaxonRank: String
    vernacularName: String
    waterBody: String
    year: Int

    # Additional fields that are useful
    """
    Format the name as html with italics
    """
    formattedName: String

    gbifDataset: Dataset
    gbifPublisher: Organization
    gbifTaxon: Taxon
  }

  type MultimediaItem {
    type: String
    format: String
    identifier: String
    created: String
    creator: String
    license: String
    publisher: String
    references: String
    rightsHolder: String
  }

  type AssociatedID {
    type: String
    value: String
    person(
      """
      Should e.g. a VIAF identifier containing a wikidata ID be expanded to include information from Wikidata
      """
      expand: Boolean
      ): Person
  }

  type OccurrenceFacet {
    basisOfRecord(limit: Int, offset: Int): [FacetResult_string]
    lifeStage(limit: Int, offset: Int): [FacetResult_string]
    issue(limit: Int, offset: Int): [FacetResult_occurrenceIssue]
    #catalogNumber(size: Int): [OccurrenceFacetResult_string]
    #collectionCode(size: Int): [OccurrenceFacetResult_string]
    #continent(size: Int): [OccurrenceFacetResult_string]
    #countryCode(size: Int): [OccurrenceFacetResult_string]
    #datasetPublishingCountry(size: Int): [OccurrenceFacetResult_string]
    #establishmentMeans(size: Int): [OccurrenceFacetResult_string]
    #eventId(size: Int): [OccurrenceFacetResult_string]
    #id(size: Int): [OccurrenceFacetResult_string]
    #institutionCode(size: Int): [OccurrenceFacetResult_string]
    #issues(size: Int): [OccurrenceFacetResult_string]
    #license(size: Int): [OccurrenceFacetResult_string]
    #lifeStage(size: Int): [OccurrenceFacetResult_string]
    #locality(size: Int): [OccurrenceFacetResult_string]
    #mediaLicenses(size: Int): [OccurrenceFacetResult_string]
    #mediaTypes(size: Int): [OccurrenceFacetResult_string]
    ## notIssues(size: Int): [OccurrenceFacetResult_string]
    #occurrenceId(size: Int): [OccurrenceFacetResult_string]
    #organismId(size: Int): [OccurrenceFacetResult_string]
    #organismQuantityType(size: Int): [OccurrenceFacetResult_string]
    #parentEventId(size: Int): [OccurrenceFacetResult_string]
    #programmeAcronym(size: Int): [OccurrenceFacetResult_string]
    #projectId(size: Int): [OccurrenceFacetResult_string]
    #protocol(size: Int): [OccurrenceFacetResult_string]
    #publishingCountry(size: Int): [OccurrenceFacetResult_string]
    #recordNumber(size: Int): [OccurrenceFacetResult_string]
    #recordedBy(size: Int): [OccurrenceFacetResult_string]
    #sampleSizeUnit(size: Int): [OccurrenceFacetResult_string]
    #samplingProtocol(size: Int): [OccurrenceFacetResult_string]
    #sex(size: Int): [OccurrenceFacetResult_string]
    #stateProvince(size: Int): [OccurrenceFacetResult_string]
    #typeStatus(size: Int): [OccurrenceFacetResult_string]
    #typifiedName(size: Int): [OccurrenceFacetResult_string]
    #waterBody(size: Int): [OccurrenceFacetResult_string]
    #agentIds_type(size: Int): [OccurrenceFacetResult_string]
    #agentIds_value(size: Int): [OccurrenceFacetResult_string]
#
    #coordinatePrecision(size: Int): [OccurrenceFacetResult_float]
    #coordinateUncertaintyInMeters(size: Int): [OccurrenceFacetResult_float]
    #crawlId(size: Int): [OccurrenceFacetResult_float]
    #day(size: Int): [OccurrenceFacetResult_float]
    #decimalLatitude(size: Int): [OccurrenceFacetResult_float]
    #decimalLongitude(size: Int): [OccurrenceFacetResult_float]
    #depth(size: Int): [OccurrenceFacetResult_float]
    #depthAccuracy(size: Int): [OccurrenceFacetResult_float]
    #elevation(size: Int): [OccurrenceFacetResult_float]
    #elevationAccuracy(size: Int): [OccurrenceFacetResult_float]
    #endDayOfYear(size: Int): [OccurrenceFacetResult_float]
    #individualCount(size: Int): [OccurrenceFacetResult_float]
    #maximumDepthInMeters(size: Int): [OccurrenceFacetResult_float]
    #maximumDistanceAboveSurfaceInMeters(size: Int): [OccurrenceFacetResult_float]
    #maximumElevationInMeters(size: Int): [OccurrenceFacetResult_float]
    #minimumDepthInMeters(size: Int): [OccurrenceFacetResult_float]
    #minimumDistanceAboveSurfaceInMeters(size: Int): [OccurrenceFacetResult_float]
    #minimumElevationInMeters(size: Int): [OccurrenceFacetResult_float]
    #month(size: Int): [OccurrenceFacetResult_float]
    #organismQuantity(size: Int): [OccurrenceFacetResult_float]
    #relativeOrganismQuantity(size: Int): [OccurrenceFacetResult_float]
    #sampleSizeValue(size: Int): [OccurrenceFacetResult_float]
    #startDayOfYear(size: Int): [OccurrenceFacetResult_float]
    #year(size: Int): [OccurrenceFacetResult_float]
#
    #hasCoordinate(size: Int): [OccurrenceFacetResult_boolean]
    #hasGeospatialIssue(size: Int): [OccurrenceFacetResult_boolean]
    #repatriated(size: Int): [OccurrenceFacetResult_boolean]
    #
    #datasetKey(size: Int): [OccurrenceFacetResult_dataset]
    #endorsingNodeKey(size: Int): [OccurrenceFacetResult_node]
    #installationKey(size: Int): [OccurrenceFacetResult_installation]
    #networkKey(size: Int): [OccurrenceFacetResult_network]
    #publishingOrganizationKey(size: Int): [OccurrenceFacetResult_organization]
#
    #gbifClassification_taxonID(size: Int): [OccurrenceFacetResult_string]
    #collectionKey(size: Int): [OccurrenceFacetResult_collection]
    #institutionKey(size: Int): [OccurrenceFacetResult_institution]
  }

  type FacetResult_occurrenceIssue {
    name: OccurrenceIssue
    count: Int!
    _query: JSON
  }

  type FacetResult_string {
    name: String
    count: Int!
    _query: JSON
  }
`;

module.exports = typeDef;