'use strict';

const axios = require('axios');
const he = require('he');
const _ = require('lodash');

const { errorHandler } = require('./axios-error-handler');

// These 3 data structures define the airtime API - we use them to generate functions
// that call each endpoint and handle params appropriately.
//
// First are the endpoints that take no parameters:
const calls = ['live-info-v2', 'week-info', 'station-metadata', 'station-logo', 'shows'];

// Then we have the endpoints that take a show_id - for some reason three different name
// are used for the show id. We hide this - we generate functions that only take
// a show_id parameter.
const showCalls = [
  ['shows', 'show', 'show_id'],
  ['show-logo', null, 'id'],
  ['show-tracks', null, 'instance_id'],
  ['show-schedules', null, 'show_id'],
];
// then we have the endpoints that take a variety of params
const otherCalls = [
  ['item-history-feed', null, ['start', 'end', 'timezone', 'instance_id']],
  ['live-info-v2', 'liveInfoV2Params', ['days', 'shows', 'timezone']],
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

  // the next 3 loops just generate functions for each of the endpoints
  // defined in the 3 data structures above
  for (let endpoint of calls) {
    this[_.camelCase(endpoint)] = () => axiosGet(`${airtimeURI}${endpoint}`);
  }

  for (let [endpoint, methodName, varName] of showCalls) {
    methodName = _.isNil(methodName) ? _.camelCase(endpoint) : methodName;
    this[methodName] = showID => {
      if (!showID) throw new Error('showID must be defined');
      return axiosGet(`${airtimeURI}${endpoint}`, {
        params: { [varName]: showID },
      });
    };
  }

  for (let [endpoint, methodName, otherParams] of otherCalls) {
    methodName = _.isNil(methodName) ? _.camelCase(endpoint) : methodName;
    this[methodName] = params => {
      // check there are no extraneous parameters
      const wrong = _.difference(_.keys(params), otherParams);
      if (wrong.length) throw new Error(`unknown parameters : ${wrong}`);
      return axiosGet(`${airtimeURI}${endpoint}`, { params });
    };
  }

  // utility functions

  // take a list of show data and return an object with show name as key
  this.makeShowDict = (showList) => {
    const showDict = {};
    for (let show of showList) {
      const showName = config.showNameModifier(show.name);
      if (!_.has(showDict, showName)) showDict[showName] = [];
      showDict[showName] = showDict[showName].concat(show);
    }
    return showDict;
  }

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
