const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class NetworkAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchNetworks({ query }) {
    const str = `/network?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getNetworkByKey({ key }) {
    return this.get(`/network/${key}`);
  }

  async getConstituents({ key, query }) {
    return this.get(`/network/${key}/constituents`, query);
  }
}

module.exports = NetworkAPI;