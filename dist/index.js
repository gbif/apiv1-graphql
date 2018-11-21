"use strict";

var _commandLineArgs = _interopRequireDefault(require("command-line-args"));

var _cliOptions = require("./cliOptions");

var _apolloServer = require("apollo-server");

var _lodash = require("lodash");

var _dataloader = _interopRequireDefault(require("dataloader"));

var _graphqlTypeJson = _interopRequireDefault(require("graphql-type-json"));

var _graphqlScalars = require("@okgrow/graphql-scalars");

var _request = require("./request");

var _occurrence = require("./types/occurrence.js");

var _dataset = require("./types/dataset.js");

var _taxon = require("./types/taxon.js");

var _taxonSubTypes = require("./types/taxonSubTypes");

var _organization = require("./types/organization.js");

var _contact = require("./types/misc/contact");

var _identifier = require("./types/misc/identifier");

var _endpoint = require("./types/misc/endpoint");

var _machineTag = require("./types/misc/machineTag");

var _tag = require("./types/misc/tag");

var _comment = require("./types/misc/comment");

var _enums = require("./types/enums");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const options = (0, _commandLineArgs.default)(_cliOptions.cliOptions);

async function setupServer() {
  const enumsSchema = await (0, _enums.enumTypeDefs)();
  const typeDefs = _apolloServer.gql`
    scalar URL
    scalar DateTime
    scalar EmailAddress
    scalar JSON

    ${enumsSchema}

    type Query {
      _empty: String
    }
  `;
  const resolvers = {
    Query: {},
    JSON: _graphqlTypeJson.default,
    // last resort type for unstructured data
    URL: _graphqlScalars.URL,
    DateTime: _graphqlScalars.DateTime,
    EmailAddress: _graphqlScalars.EmailAddress
  };

  const getLoaders = () => ({
    taxonByKey: new _dataloader.default((0, _request.batchFaker)(_taxon.taxonByKey), {
      batch: false
    }),
    // our APIs do not support batch querying by IDs
    datasetByKey: new _dataloader.default((0, _request.batchFaker)(_dataset.datasetByKey), {
      batch: false
    }),
    // our APIs do not support batch querying by IDs
    occurrenceByKey: new _dataloader.default((0, _request.batchFaker)(_occurrence.occurrenceByKey), {
      batch: false
    }),
    // our APIs do not support batch querying by IDs
    organizationByKey: new _dataloader.default((0, _request.batchFaker)(_organization.organizationByKey), {
      batch: false
    }),
    // our APIs do not support batch querying by IDs
    formatedScientificNameByKey: new _dataloader.default((0, _request.batchFaker)(_taxon.formatedScientificNameByKey), {
      batch: false
    }) // our APIs do not support batch querying by IDs

  });

  const server = new _apolloServer.ApolloServer({
    typeDefs: [typeDefs, _occurrence.typeDef, _dataset.typeDef, _taxon.typeDef, _taxonSubTypes.typeDef, _organization.typeDef, _contact.typeDef, _identifier.typeDef, _endpoint.typeDef, _machineTag.typeDef, _tag.typeDef, _comment.typeDef],
    resolvers: (0, _lodash.merge)(resolvers, _occurrence.resolvers, _dataset.resolvers, _taxon.resolvers, _taxonSubTypes.resolvers, _organization.resolvers),
    context: () => ({
      loaders: getLoaders()
    })
  }); // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.

  server.listen({
    port: options.port || 4000
  }).then(({
    url
  }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

setupServer();