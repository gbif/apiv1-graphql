/**
 * get app configuration
 * cli arguments take priority, then comes .env file, then default values.
 */
const _ = require('lodash');
const commandLineArgs = require('command-line-args');
const YAML = require('yaml')
const fs = require('fs');

// default environment is prod
let env = {
  port: 4000,
  apiv1: 'https://api.gbif.org/v1',
  gbifBackboneUUID: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  wikidata: {
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
  },
  orcid: {
    pubApi: 'https://pub.orcid.org/v2.0' // https://pub.orcid.org/v3.0/#!/Public_API_v2.0/viewRecord
  },
  viaf: {
    api: 'http://viaf.org/viaf/'
  }
};

try {
  const file = fs.readFileSync(__dirname + '/../.env', 'utf8');
  env = YAML.parse(file);
} catch(err) {
  // no env file present, proceed with defaults
  console.log('No .env file present, will use default instead');
}

const cliOptions = [
  { name: 'port', alias: 'p', type: Number },
  { name: 'debug', type: Boolean, defaultOption: false },
];
const options = commandLineArgs(cliOptions);

const config = _.merge(
  { debug: false },
  env,
  options,
);

module.exports = config;