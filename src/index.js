'use strict';

const axios = require('axios');
const he = require('he');
const _ = require('lodash');

const { errorHandler, makeShowDict } = require('./utils');

// This data structure describes the various REST API calls
// We use this to generate the JS API
const allCalls = [
  [
    'live-info',
    {
      type: { type: 'string', enum: ['endofday', 'interval'] },
      limit: { type: 'number' },
    },
  ],
  [
    'live-info-v2',
    {
      timezone: { type: 'string' },
      days: { type: 'number' },
      shows: { type: 'number' },
    },
  ],
  ['week-info', { timezone: { type: 'string' } }],
  ['station-metadata', {}],
  ['station-logo', {}],
  ['shows', { showID: { type: 'number', apiName: 'show_id' } }],
  ['show-logo', { showID: { type: 'number', required: true, apiName: 'id' } }],
  [
    'item-history-feed',
    {
      start: { type: 'string' },
      end: { type: 'string' },
      timezone: { type: 'string' },
      showID: { type: 'number', apiName: 'instance_id' },
    },
  ],
  ['show-tracks', { showID: { type: 'number', required: true, apiName: 'instance_id' } }],
  ['show-schedules', { showID: { type: 'number', required: true, apiName: 'show_id' } }],
];

const axiosGet = (url, opts) =>
  axios
    .get(url, opts)
    .then(r => r.data)
    .catch(errorHandler);

const defaultOptions = { showNameModifier: x => x };

exports.init = function (conf) {
  // module configuration
  if (!conf || !conf.stationName) {
    throw new Error('stationName is not defined');
  }
  const config = defaultOptions;
  for (let attrName in conf) {
    config[attrName] = conf[attrName];
  }
  const airtimeURI = `https://${config.stationName}.airtime.pro/api/`;

  // generate the JS API - iterate over each endpoint defined in the data structure
  // endpoint has a name, and a set of validators - for each REST API query param our function
  // will accept a corresponding entry in its params object
  // each one of these will have an entry in the list of validations
  for (let [endpointName, validations] of allCalls) {
    // create a JS function to call the endpoint
    // Takes 1 argument - an object containing params
    this[_.camelCase(endpointName)] = (params = {}) => {
      // check if any unexpected params passed
      const unexpected = _.keys(params).filter(x => !_.has(validations, x));
      if (!_.isEmpty(unexpected)) {
        throw new Error(`Unexpected arguments: ${unexpected}`);
      }

      // check if any required params missing
      const missing = Object.entries(validations)
        .filter(([_x, y]) => y.required) // find required params from validators
        .map(([k, _v]) => k) // get their names
        .filter(x => !_.has(params, x)); // find the required entries that are not present in params
      if (!_.isEmpty(missing)) {
        throw new Error(`Missing required entry in params: ${missing}`);
      }

      // now validate - iterate over entries in params
      const validatedArgs = {};
      for (const [param, value] of Object.entries(params)) {
        // find the matching validation
        const validation = validations[param];
        if (!validation) {
          // if it's not found then it's a bug
          throw new Error(`Unknown arg '${param}'`);
        }

        // check the type
        const typeOfVal = typeof value;
        if (typeOfVal !== validation.type) {
          throw new Error(`Param ${param} has type ${typeOfVal}, should be ${validation.type}`);
        }

        // check enum
        if (validation.enum && !validation.enum.includes(value)) {
          throw new Error(
            `Param '${param}' has value '${value}' but must be one of ${validation.enum}`
          );
        }

        // some params have a different name from what is used in the REST API
        const apiName = validation.apiName ? validation.apiName : param;
        validatedArgs[apiName] = value;
      }

      // do the query
      return axiosGet(`${airtimeURI}${endpointName}`, { params: validatedArgs });
    };
  }

  // higher level functions
  // TODO - attach errorHandler to these

  // transform the data returned by the `shows` endpoint into a more useful dictionary format
  // with show name as key
  this.showsDict = () =>
    this.shows()
      .then(x => makeShowDict(x, config.showNameModifier))
      .catch(err => console.log(err));

  // transform the week schedule data into a dictionary format with show name as key
  this.showSchedulesFromWeek = () =>
    this.weekInfo()
      .then(results => {
        if (!results) return [];
        return makeShowDict(
          Object.values(results)
            .flat()
            .filter(x => !!x && !!x.name)
            // TODO - figure out where else we need to do this
            .map(s => {
              s.name = he.decode(s.name);
              return s;
            }),
          config.showNameModifier
        );
      })
      .catch(err => console.log(err));

  this.showSchedulesByNameFromWeek = showName =>
    this.showSchedulesFromWeek()
      .then(x => x[config.showNameModifier(showName)])
      .catch(err => console.log(err));

  return this;
};
