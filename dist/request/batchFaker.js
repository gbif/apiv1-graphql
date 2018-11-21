"use strict";

module.exports = function batchFaker(fn) {
  return keys => {
    const promiseList = keys.map(key => fn(key));
    return Promise.all(promiseList);
  };
}; // module.exports = function batchFaker(fn){
//   return (keys) => {
//     const promiseList = keys.map(key => fn(key).then(res => {
//       if (res.statusCode === 200) {
//         return res.body;
//       }
//       throw new Error(`No such key found : ${key}`)
//     }));
//     return Promise.all(promiseList);
//   }
// }