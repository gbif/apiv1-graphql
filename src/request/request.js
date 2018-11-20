const requestAgents = require('./requestAgents');
const url = require('url');

const agentMapping = [
  {startsWith: '/v1/occurrence/', requestAgent: requestAgents.occurrence},
  {startsWith: '/v1/species/', requestAgent: requestAgents.species}
];

function requestWrapper(options) {
  const path = url.parse(options.url).path;
  // console.log(path);
  let match = agentMapping.find(function(e) {
    if (e.startsWith) {
      return path.startsWith(e.startsWith);
    }
  });
  let requestAgent = match ? match.requestAgent : requestAgents.standard;
  return requestAgent(options);
}

requestWrapper.get = url => requestWrapper({url});

module.exports = requestWrapper;
