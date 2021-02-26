const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.apiv1;

class OccurrenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchOccurrences({ query }) {
    const response = await this.get('/occurrence/search', query);
    response._query = query;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/${key}`);
  }

  async getRelated({ key }) {
    return this.get(`/occurrence/${key}/experimental/related`);
  }

  async getFragment({ key }) {
    return this.get(`/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`/occurrence/${key}/verbatim`);
  }
}

module.exports = OccurrenceAPI;