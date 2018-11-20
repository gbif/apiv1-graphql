// Load all enumerations from the GBIF API. http://api.gbif.org/v1/enumeration/basic
// e.g. http://api.gbif.org/v1/enumeration/basic/BasisOfRecord

import request from 'requestretry'
import _ from 'lodash'
import { gbifApi } from '../../config'

const skipTypes = ['Extension']; // the API returns 500 for some known endpoints and has done so for many months. To get this working we have to skip those.

async function loadEnums() {
  const types = await getDate(`${gbifApi}/enumeration/basic`)
  const expectedTypes = types.filter(x => skipTypes.indexOf(x) == -1)
  const enums = await Promise.all(
    expectedTypes.map(type => getDate(`${gbifApi}/enumeration/basic/${type}`))
  );
  const enumMap = _.zipObject(expectedTypes, enums);
  return enumMap;
}

async function getDate(url) {
  const res = await request({url, json: true, maxAttempts: 1});
  if (res.statusCode !== 200) {
    throw Error('Unable to get data from: ' + url);
  }
  return res.body;
}

async function enumTypeDefs() {
  //get map of enums from API
  const enums = await loadEnums();
  
  //map enums to schema definitions
  const schemas = Object.keys(enums).map(enumType => {
    const list = enums[enumType].reduce( (accumulator, currentValue) => accumulator += currentValue + '\n', '');
    return `
      enum ${enumType} {
      ` + 
        list + `}
    `
  });
  return schemas.reduce( (acc, curr) => acc + curr, '')
}

export {
  enumTypeDefs
}