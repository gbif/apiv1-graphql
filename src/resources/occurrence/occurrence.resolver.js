/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query a map the result
 * @param {String} facetKey 
 */
const getFacet = (facetKey) =>
  (parent, { limit = 10, offset = 0 }, { dataSources }) => {
    // generate the species search query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      ...parent._query,
      limit: 0,
      facet: facetKey,
      facetLimit: limit,
      facetOffset: offset
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI.searchOccurrences({ query })
      .then(data => ([
        ...data.facets[0].counts
          .map(
            facet => ({
              ...facet,
              // attach the query, but add the facet as a filter
              _query: {
                ...parent._query,
                [facetKey]: facet.name
              }
            })
          )
      ]));
  }

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    occurrenceSearch: (parent, args, { dataSources }) =>
      dataSources.occurrenceAPI.searchOccurrences({query: args}),
    occurrence: (parent, { key }, { dataSources }) =>
      dataSources.occurrenceAPI.getOccurrenceByKey({ key })
  },
  OccurrenceSearchResults: {
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => ({ _query: { ...parent._query, limit: undefined, offset: undefined } }),
  },
  Occurrence: {
    gbifDataset: ({ datasetKey: key }, args, { dataSources }) => {
      return dataSources.datasetAPI.getDatasetByKey({ key });
    },
    gbifPublisher: ({ publishingOrgKey: key }, args, { dataSources }) => {
      return dataSources.organizationAPI.getOrganizationByKey({ key });
    },
    gbifTaxon: ({ taxonKey: key }, args, { dataSources }) => {
      return dataSources.taxonAPI.getTaxonByKey({ key });
    },
    formattedName: ({ taxonKey }, args, { dataSources }) =>
      dataSources.taxonAPI.getParsedName({ key: taxonKey }),
  },
  AssociatedID: {
    person: (parent, { expand }, { dataSources }) => {
      return dataSources.personAPI.getPersonByIdentifier({type: parent.type, value: parent.value, dataSources, expand})
    }
  },
  OccurrenceFacet: {
    basisOfRecord: getFacet('basisOfRecord'),
    lifeStage: getFacet('lifeStage'),
    issue: getFacet('issue'),
  },
};