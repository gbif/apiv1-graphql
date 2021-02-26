const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class CollectionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchCollections({ query }) {
    const str = `/grscicoll/collection?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
  }

  async getCollectionsByInstitutionKey({ key }) {
    return this.get('/grscicoll/collection', {institution: key}).then(res => res.results);
  }

  /*
  getCollectionsByKeys({ collectionKeys }) {
    return Promise.all(
      collectionKeys.map(key => this.getCollectionByKey({ key })),
    );
  }
  */
}

module.exports = CollectionAPI;