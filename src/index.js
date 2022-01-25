'use strict';

const axios = require('axios');
const he = require('he');
const _ = require('lodash');

const { errorHandler } = require('./axios-error-handler');

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

exports.init = function (config) {
  if (!config || !config.stationName) {
    throw new Error('stationName is not defined');
  }

  config = { ...defaultOptions, ...config };
  const airtimeURI = `https://${config.stationName}.airtime.pro/api/`;

  for (let [endpoint, validations] of allCalls) {
    this[_.camelCase(endpoint)] = (args = {}) => {
      // check if any unexpected args passed
      const unexpected = _.keys(args).filter(x => !_.has(validations, x));
      if (!_.isEmpty(unexpected)) {
        throw new Error(`Unexpected arguments: ${unexpected}`);
      }

      // check if any required args missing
      const missing = Object.entries(validations)
        .filter(([_x, y]) => y.required) // find required params from validators
        .map(([k, _v]) => k) // get their names
        .filter(x => !_.has(args, x)); // find the ones that are not present in params
      if (!_.isEmpty(missing)) {
        throw new Error(`Missing required params: ${missing}`);
      }

      // now validate - iterate over params
      const validatedArgs = {};
      for (const [arg, value] of Object.entries(args)) {
        // find the matching validation
        const validation = validations[arg];
        if (!validation) {
          // if it's not found then it's a bug
          throw new Error(`Unknown arg '${arg}'`);
        }

        // check the type
        const typeOfVal = typeof value;
        if (typeOfVal !== validation.type) {
          throw new Error(`Arg ${arg} has type ${typeOfVal}, should be ${validation.type}`);
        }

        // check enum
        if (validation.enum && !validation.enum.includes(value)) {
          throw new Error(
            `Arg '${arg}' has value '${value}' but must be one of ${validation.enum}`
          );
        }

        // some params have a different name from what is used in the REST API
        const apiName = validation.apiName ? validation.apiName : arg;
        validatedArgs[apiName] = value;
      }

      // do the query
      return axiosGet(`${airtimeURI}${endpoint}`, { params: validatedArgs });
    };
  }

  // utility functions

  // take a list of show data and return an object with show name as key
  this.makeShowDict = showList => {
    const showDict = {};
    for (let show of showList) {
      const showName = config.showNameModifier(show.name);
      if (!_.has(showDict, showName)) showDict[showName] = [];
      showDict[showName] = showDict[showName].concat(show);
    }
    return showDict;
  };

  // helper functions

  // transform the data returned by the `shows` endpoint into a more useful dictionary format
  // with show name as key
  this.showsDict = () => this.shows().then(this.makeShowDict);

  // transform the week schedule data into a dictionary format with show name as key
  this.showSchedulesFromWeek = () => {
    return this.weekInfo().then(results => {
      return this.makeShowDict(
        Object.values(results)
          .flat()
          .filter(x => !!x && !!x.name)
          // TODO - figure out where else we need to do this
          .map(s => ({ ...s, name: he.decode(s.name) }))
      );
    });
  };

  this.showSchedulesByNameFromWeek = showName => {
    return this.showSchedulesFromWeek().then(x => x[config.showNameModifier(showName)]);
  };

  return this;
};
