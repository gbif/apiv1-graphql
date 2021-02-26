const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class StaffMemberAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchStaff({ query }) {
    const str = `/grscicoll/person?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getStaffByKey({ key }) {
    return this.get(`/grscicoll/person/${key}`);
  }

  /*
  getPersonsByKeys({ personKeys }) {
    return Promise.all(
      personKeys.map(key => this.getPersonByKey({ key })),
    );
  }
  */
}

module.exports = StaffMemberAPI;