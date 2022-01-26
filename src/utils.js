// eslint-disable no-console

const _ = require('lodash');
function errorHandler(error) {
  console.error('Error in HTTP request');
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`HTTP status: ${error.response.status}
    Response data:
    ${stringify(error.response.data)}
    Response headers:
    ${error.response.headers}`);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(`No response received. Request:\n${error.request}`);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
  }
  console.error(`Config:
  ${error.config}`);
}

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
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
