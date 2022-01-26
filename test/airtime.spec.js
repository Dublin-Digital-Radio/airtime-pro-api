'use strict';

const axios = require('axios');
const _ = require('lodash');

const URL = 'https://dublindigitalradio.airtime.pro/api/';
const { makeShowDict } = require('../src/utils');

// remove (R) from end of show name and make lower case
function trimShowName(showName) {
  return _.replace(_.replace(showName, /\(R\)/i, ''), /\(repeat\)/i, '')
    .trim()
    .toLowerCase();
}

const airtime = require('../src/index').init({
  stationName: 'dublindigitalradio',
  showNameModifier: trimShowName,
});

describe('airtime client library', () => {
  describe('liveInfoV2', () => {
    it('raises an error if called with unexpected parameters', () => {
      let liveInfoV2 = sinon.spy(airtime.liveInfoV2);
      try {
        liveInfoV2({ a: 'bar', b: 'foo' });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(liveInfoV2);
    });
    it('raises an error if called with wrong param types', () => {
      let liveInfoV2 = sinon.spy(airtime.liveInfoV2);
      try {
        liveInfoV2({ days: 'x', shows: 2 });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(liveInfoV2);
    });
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.liveInfoV2();
      sinon.assert.calledWith(axios.get, `${URL}live-info-v2`, { params: {} });
    });
    it('calls axios.get with appropriate params', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.liveInfoV2({ days: 10, shows: 2 });
      sinon.assert.calledWith(axios.get, `${URL}live-info-v2`, { params: { days: 10, shows: 2 } });
    });
  });
  describe('liveInfo', () => {
    it('raises an error if called with a type not in the enum', () => {
      let liveInfo = sinon.spy(airtime.liveInfo);
      try {
        liveInfo({ type: 'x' });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(liveInfo);
    });
    it('calls axios.get with appropriate params', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.liveInfo({ type: 'interval', limit: 10 });
      sinon.assert.calledWith(axios.get, `${URL}live-info`, {
        params: { type: 'interval', limit: 10 },
      });
    });
  });
  describe('weekInfo', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.weekInfo();
      sinon.assert.calledWith(axios.get, `${URL}week-info`, { params: {} });
    });
  });
  describe('stationMetadata', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.stationMetadata();
      sinon.assert.calledWith(axios.get, `${URL}station-metadata`, { params: {} });
    });
  });
  describe('stationLogo', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.stationLogo();
      sinon.assert.calledWith(axios.get, `${URL}station-logo`, { params: {} });
    });
  });
  describe('shows', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.shows();
      sinon.assert.calledWith(axios.get, `${URL}shows`, { params: {} });
    });
    it('calls axios.get with correct params', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.shows({ showID: 10 });
      sinon.assert.calledWith(axios.get, `${URL}shows`, { params: { show_id: 10 } });
    });
  });
  describe('showLogo', () => {
    it('raises an error if not called with showID', () => {
      let showLogo = sinon.spy(airtime.showLogo);
      try {
        showLogo();
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(showLogo);
    });
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.showLogo({ showID: 1 });
      sinon.assert.calledWith(axios.get, `${URL}show-logo`, { params: { id: 1 } });
    });
  });
  describe('showTracks', () => {
    it('raises an error if not called with showID', () => {
      let showTracks = sinon.spy(airtime.showTracks);
      try {
        showTracks();
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(showTracks);
    });
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.showTracks({ showID: 1 });
      sinon.assert.calledWith(axios.get, `${URL}show-tracks`, { params: { instance_id: 1 } });
    });
  });
  describe('showSchedules', () => {
    it('raises an error if not called with showID', () => {
      let showSchedules = sinon.spy(airtime.showSchedules);
      try {
        showSchedules();
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(showSchedules);
    });
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.showSchedules({ showID: 1 });
      sinon.assert.calledWith(axios.get, `${URL}show-schedules`, { params: { show_id: 1 } });
    });
  });
  describe('itemHistoryFeed', () => {
    it('raises an error if called with unexpected parameters', () => {
      let itemHistoryFeed = sinon.spy(airtime.itemHistoryFeed);
      try {
        itemHistoryFeed({ a: 'bar', b: 'foo' });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(itemHistoryFeed);
    });
    it('calls axios.get with appropriate paramaters', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.itemHistoryFeed({ start: 'a', end: 'b', showID: 20 });
      sinon.assert.calledWith(axios.get, `${URL}item-history-feed`, {
        params: { start: 'a', end: 'b', instance_id: 20 },
      });
    });
  });
  describe('showsDict', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.showsDict();
      sinon.assert.calledWith(axios.get, `${URL}shows`, { params: {} });
    });
  });
  describe('showSchedulesByNameFromWeek', () => {
    it('calls axios.get', async () => {
      sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
      await airtime.showSchedulesFromWeek();
      sinon.assert.calledWith(axios.get, `${URL}week-info`, { params: {} });
    });
    // TODO
    // it("correctly handles encoded characters", () => {
    //   get.resolves({
    //     data: {
    //       one: [{ name: "Ain&#039;t You" }, { name: "Jane &amp; Rosi", num: 1}],
    //       two: [{ name: "Toké O&#039;Drift" }, { name: "Arad &amp; Friends" }, { name: "Jane &amp; Rosi", num: 2}]
    //     }
    //   });
    //   return expect(airtime.showSchedulesFromWeek()).to.eventually.eql({
    //     "ain't you": [{ name: "Ain't You" }],
    //     "jane & rosi": [{ name: "Jane & Rosi", num: 1 }, { name: "Jane & Rosi", num: 2 }],
    //     "toké o'drift": [{ name: "Toké O'Drift" }],
    //     "arad & friends": [{ name: "Arad & Friends" }]
    //   });
    // });
  });
  describe('makeShowDict', () => {
    it('takes a list of objects and returns a dict with object name as key', () => {
      const firstIn = [
        { name: 'a', val: 1 },
        { name: 'b', val: 2 },
        { name: 'c', val: 3 },
        { name: 'a', val: 4 },
        { name: 'c (repeat)', val: 5 },
        { name: 'a (R)', val: 6 },
      ];
      const thenOut = {
        a: [
          { name: 'a', val: 1 },
          { name: 'a', val: 4 },
          { name: 'a (R)', val: 6 },
        ],
        b: [{ name: 'b', val: 2 }],
        c: [
          { name: 'c', val: 3 },
          { name: 'c (repeat)', val: 5 },
        ],
      };
      makeShowDict(firstIn, trimShowName).should.eql(thenOut);
    });
  });
});

afterEach(function () {
  sinon.restore();
});
