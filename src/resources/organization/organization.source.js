const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class OrganizationAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchOrganizations({ query }) {
    const str = `/organization?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getOrganizationByKey({ key }) {
    return this.get(`/organization/${key}`);
  }

  getOrganizationsByKeys({ organizationKeys }) {
    return Promise.all(
      organizationKeys.map(key => this.getOrganizationByKey({ key })),
    );
  }

  async getHostedDatasets({ key, query }) {
    return this.get(`/organization/${key}/hostedDataset`, query);
  }

  async getPublishedDatasets({ key, query }) {
    return this.get(`/organization/${key}/publishedDataset`, query);
  }

  async getInstallations({ key, query }) {
    return this.get(`/organization/${key}/installation`, query);
  }
}

module.exports = OrganizationAPI;