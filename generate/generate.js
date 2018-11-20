import { species } from './species'
import _ from 'lodash'

let merged = _.merge({}, ...species.results);
// let contacts = _.merge(...mergedDataset.contacts);

Object.keys(merged).sort().forEach(key => {
    console.log(`${key}`)
});

function guessType(val, key) {
    if (('' + key).indexOf('key') >= 0) return 'ID'
    if (('' + key).indexOf('Key') >= 0) return 'ID'
    if (typeof val === 'undefined') return 'String'
    
    if (_.isArray(val)) {
        return `[${guessType(val[0])}]`
    }

    if (typeof val === 'string') return 'String'
    if (typeof val === 'number') return 'Int'
    if (typeof val === 'boolean') return 'Boolean'
    if (typeof val === 'object') return 'JSON'
    return 'String'
}
