const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class NodeAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchNodes({ query }) {
    const str = `/node?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getNodeByKey({ key }) {
    return this.get(`/node/${key}`);
  }

  async getEndorsedOrganizations({ key, query }) {
    return this.get(`/node/${key}/organization`, query);
  }

  async getOrganizationsPendingEndorsement({ key, query }) {
    return this.get(`/node/${key}/pendingEndorsement`, query);
  }

  async getDatasets({ key, query }) {
    return this.get(`/node/${key}/dataset`, query);
  }

  async getInstallations({ key, query }) {
    return this.get(`/node/${key}/installation`, query);
  }
}

module.exports = NodeAPI;