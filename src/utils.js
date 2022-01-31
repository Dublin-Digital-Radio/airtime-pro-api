// eslint-disable no-console

const _ = require('lodash');

function errorHandler(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`Error in HTTP request
HTTP status: ${error.response.status}
Response data:
  ${stringify(error.response.data)}
Response headers:
  ${error.response.headers}`);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(`Error in HTTP request, no response received. 
Request:
  ${stringify(error.request)}`);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error in HTTP request', error.message);
  }
  console.error(`Config:
  ${stringify(error.config)}`);
}

function refReplacer() {
  // catch circular references
  let m = new Map(),
    v = new Map(),
    init = null;

  return function (field, value) {
    let p = m.get(this) + (Array.isArray(this) ? `[${field}]` : '.' + field);
    let isComplex = value === Object(value);

    if (isComplex) m.set(value, p);

    let pp = v.get(value) || '';
    let path = p.replace(/undefined\.\.?/, '');
    let val = pp ? `#REF:${pp[0] == '[' ? '$' : '$.'}${pp}` : value;

    !init ? (init = value) : val === init ? (val = '#REF:$') : 0;
    if (!pp && isComplex) v.set(value, path);

    return val;
  };
}

function stringify(obj) {
  return JSON.stringify(obj, refReplacer, 2);
}

// take a list of show data and return an object with show name as key
function makeShowDict(showList, showNameModifier) {
  const showDict = {};
  for (let show of showList) {
    const showName = showNameModifier(show.name);
    if (!_.has(showDict, showName)) showDict[showName] = [];
    showDict[showName] = showDict[showName].concat(show);
  }
  return showDict;
}

module.exports = { errorHandler, stringify, makeShowDict };
