'use strict';

// TODO - need to overhaul mocking of axios in this module

const proxyquire = require('proxyquire').noPreserveCache();
const moment = require('moment');

const URL = 'https://dublindigitalradio.airtime.pro/api/';

let mockMoment = sinon.stub();
mockMoment.returns(moment.unix(1482363557071));

const mockObject = { data: 'bar' };
let get = sinon.stub();
get.resolves(mockObject);
let axios = { get };
const airtime = proxyquire('../src/index', { axios, moment: mockMoment });

describe('airtime client library', () => {
  describe('liveInfoV2', () => {
    it('calls axios.get', () => {
      airtime.liveInfoV2();
      sinon.assert.calledWith(get, `${URL}live-info-v2`);
    });
  });
  describe('weekInfo', () => {
    it('calls axios.get', () => {
      airtime.weekInfo();
      sinon.assert.calledWith(get, `${URL}week-info`);
    });
  });
  describe('stationMetadata', () => {
    it('calls axios.get', () => {
      airtime.stationMetadata();
      sinon.assert.calledWith(get, `${URL}station-metadata`);
    });
  });
  describe('stationLogo', () => {
    it('calls axios.get', () => {
      airtime.stationLogo();
      sinon.assert.calledWith(get, `${URL}station-logo`);
    });
  });
  describe('shows', () => {
    it('calls axios.get', () => {
      airtime.shows();
      sinon.assert.calledWith(get, `${URL}shows`);
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
    it('calls axios.get', () => {
      airtime.show(1);
      sinon.assert.calledWith(get, `${URL}shows`);
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
    it('calls axios.get', () => {
      airtime.showLogo(1);
      sinon.assert.calledWith(get, `${URL}show-logo`);
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
    it('calls axios.get', () => {
      airtime.showTracks(1);
      sinon.assert.calledWith(get, `${URL}show-tracks`);
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
    it('calls axios.get', () => {
      airtime.showSchedules(1);
      sinon.assert.calledWith(get, `${URL}show-schedules`);
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
    it('calls axios.get with appropriate paramaters', () => {
      airtime.itemHistoryFeed({ start: 'a', end: 'b' });
      sinon.assert.calledWith(get, `${URL}item-history-feed`, { params: { start: 'a', end: 'b' } });
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
    it('calls axios.get with appropriate paramaters', () => {
      airtime.liveInfoV2Params({ days: 10, shows: 2 });
      sinon.assert.calledWith(get, `${URL}live-info-v2`, { params: { days: 10, shows: 2 } });
    });
  });
  describe('showsDict', () => {
    it('calls axios.get', () => {
      airtime.showsDict();
      sinon.assert.calledWith(get, `${URL}shows`);
    });
  });
  describe('showSchedulesByNameFromWeek', () => {
    it('calls axios.get', () => {
      airtime.showSchedulesFromWeek();
      sinon.assert.calledWith(get, `${URL}week-info`);
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
      airtime.makeShowDict(firstIn).should.eql(thenOut);
    });
  });
  describe('scheduleByDay ', () => {
    it('converts the airtime api result to schedule for the next 7 days', () => {
      const mockAirtimeResult = {
        monday: ['show1', 'show2'],
        tuesday: ['show11', 'show22'],
        wednesday: ['show21', 'show22'],
        thursday: ['show31', 'show32'],
        friday: ['show41', 'show42'],
        saturday: ['show51', 'show52'],
        sunday: ['show61', 'show62'],
        nextmonday: ['show71', 'show72'],
        nexttuesday: ['show81', 'show82'],
        nextwednesday: ['show91', 'show92'],
        nextthursday: ['show101', 'show102'],
        nextfriday: ['show111', 'show122'],
        nextsaturday: ['show131', 'show142'],
        nextsunday: ['show151', 'show16'],
      };
      // Converted schedule for the next 7 days
      const expectedResult = [
        ['show21', 'show22'],
        ['show31', 'show32'],
        ['show41', 'show42'],
        ['show51', 'show52'],
        ['show61', 'show62'],
        ['show71', 'show72'],
        ['show81', 'show82'],
      ];
      //Date.now = jest.fn(() => 1482363367071); // eslint-disable-line no-undef

      airtime.scheduleByDay(mockAirtimeResult).should.eql(expectedResult);
    });
  });
});
