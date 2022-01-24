function errorHandler(error) {
  console.error('Error in HTTP request'); // eslint-disable-line no-console
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(`HTTP status: ${error.response.status}`); // eslint-disable-line no-console
    console.error('Response data:'); // eslint-disable-line no-console
    console.error(stringify(error.response.data)); // eslint-disable-line no-console
    console.error('Response headers:'); // eslint-disable-line no-console
    console.error(error.response.headers); // eslint-disable-line no-console
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request); // eslint-disable-line no-console
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message); // eslint-disable-line no-console
  }
  console.error('Config:'); // eslint-disable-line no-console
  console.error(error.config); // eslint-disable-line no-console
}

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}

module.exports = { errorHandler, stringify };
