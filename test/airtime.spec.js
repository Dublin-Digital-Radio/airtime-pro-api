'use strict';

const axios = require('axios');
const _ = require('lodash');

const URL = 'https://dublindigitalradio.airtime.pro/api/';

// mock.onGet(/.*/).reply(200, { data: 'bar' })

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
  sinon.stub(axios, 'get').returns(Promise.resolve({ data: 'bar' }));
  describe('liveInfoV2', () => {
    it('calls axios.get', async () => {
      await airtime.liveInfoV2();
      sinon.assert.calledWith(axios.get, `${URL}live-info-v2`);
    });
  });
  describe('weekInfo', () => {
    it('calls axios.get', async () => {
      await airtime.weekInfo();
      sinon.assert.calledWith(axios.get, `${URL}week-info`);
    });
  });
  describe('stationMetadata', () => {
    it('calls axios.get', async () => {
      await airtime.stationMetadata();
      sinon.assert.calledWith(axios.get, `${URL}station-metadata`);
    });
  });
  describe('stationLogo', () => {
    it('calls axios.get', async () => {
      await airtime.stationLogo();
      sinon.assert.calledWith(axios.get, `${URL}station-logo`);
    });
  });
  describe('shows', () => {
    it('calls axios.get', async () => {
      await airtime.shows();
      sinon.assert.calledWith(axios.get, `${URL}shows`);
    });
  });
  describe('show', () => {
    it('raises an error if not called with showID', () => {
      let show = sinon.spy(airtime.show);
      try {
        show();
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(show);
    });
    it('calls axios.get', async () => {
      await airtime.show(1);
      sinon.assert.calledWith(axios.get, `${URL}shows`);
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
      await airtime.showLogo(1);
      sinon.assert.calledWith(axios.get, `${URL}show-logo`);
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
      await airtime.showTracks(1);
      sinon.assert.calledWith(axios.get, `${URL}show-tracks`);
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
      await airtime.showSchedules(1);
      sinon.assert.calledWith(axios.get, `${URL}show-schedules`);
    });
  });
  describe('itemHistoryFeed', () => {
    it('raises an error if not called with unexpected parameters', () => {
      let itemHistoryFeed = sinon.spy(airtime.itemHistoryFeed);
      try {
        itemHistoryFeed({ a: 'bar', b: 'foo' });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(itemHistoryFeed);
    });
    it('calls axios.get with appropriate paramaters', async () => {
      await airtime.itemHistoryFeed({ start: 'a', end: 'b' });
      sinon.assert.calledWith(axios.get, `${URL}item-history-feed`, {
        params: { start: 'a', end: 'b' },
      });
    });
  });
  describe('liveInfoV2Params', () => {
    it('raises an error if not called with unexpected parameters', () => {
      let liveInfoV2Params = sinon.spy(airtime.liveInfoV2Params);
      try {
        liveInfoV2Params({ a: 'bar', b: 'foo' });
      } catch (e) {} // eslint-disable-line no-empty
      sinon.assert.threw(liveInfoV2Params);
    });
    it('calls axios.get with appropriate paramaters', async () => {
      await airtime.liveInfoV2Params({ days: 10, shows: 2 });
      sinon.assert.calledWith(axios.get, `${URL}live-info-v2`, { params: { days: 10, shows: 2 } });
    });
  });
  describe('showsDict', () => {
    it('calls axios.get', async () => {
      await airtime.showsDict();
      sinon.assert.calledWith(axios.get, `${URL}shows`);
    });
  });
  describe('showSchedulesByNameFromWeek', () => {
    it('calls axios.get', async () => {
      await airtime.showSchedulesFromWeek();
      sinon.assert.calledWith(axios.get, `${URL}week-info`);
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
      airtime.makeShowDict(firstIn, trimShowName).should.eql(thenOut);
    });
  });
});
