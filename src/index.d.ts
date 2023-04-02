interface AirtimeApi {
  init;
  itemHistoryFeed: Function;
  liveInfo: Function;
  liveInfoV2: Function;
  showLogo: Function;
  showSchedules: Function;
  showSchedulesByNameFromWeek: Function;
  showSchedulesFromWeek: Function;
  showTracks: Function;
  shows: Function;
  showsDict: Function;
  stationLogo: Function;
  stationMetadata: Function;
  weekInfo: Function;
}

type Config = {
  stationName: string; showNameModifier?: Function;
};

export function init(config: Config): AirtimeApi;

