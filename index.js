import { ApolloServer, gql } from 'apollo-server'
import { merge } from 'lodash'
import DataLoader from "dataloader";
import { batchFaker } from './request'
import { typeDef as Occurrence, resolvers as occurrenceResolvers, occurrenceByKey } from './types/occurrence.js';
import { typeDef as Dataset, resolvers as datasetResolvers, datasetByKey } from './types/dataset.js';
import { typeDef as Taxon, resolvers as taxonResolvers, taxonByKey } from './types/taxon.js';

const typeDefs = gql`
  type Query {
    _empty: String
  }
`;

const resolvers = {
  Query: {},
};

const getLoaders = () => ({
  taxonByKey: new DataLoader(batchFaker(taxonByKey), {batch: false}), // our APIs do not support batch querying by IDs
  datasetByKey: new DataLoader(batchFaker(datasetByKey), {batch: false}), // our APIs do not support batch querying by IDs
  occurrenceByKey: new DataLoader(batchFaker(occurrenceByKey), {batch: false}), // our APIs do not support batch querying by IDs
})

const server = new ApolloServer({
  typeDefs: [typeDefs, Occurrence, Dataset, Taxon],
  resolvers: merge(resolvers, occurrenceResolvers, datasetResolvers, taxonResolvers),
  context: () => ({
    loaders: getLoaders()
  })
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
