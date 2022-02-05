# Overview
This wraps queries to the [Airtime Pro API](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API)

This is currently *beta quality*.

# Example

```js
const airtime = require('airtime-pro-api');
const a = airtime.init({ stationName: 'sourcefabric' });

a.stationMetadata().then(x => console.log(x))

{
  AIRTIME_API_VERSION: '1.1',
  name: 'Sourcefabric 90.8 FM',
  tags: '',
  logo: 'http://sourcefabric.airtime.pro:80/api/station-logo',
  description: 'Proudly powered by Airtime Pro!',
  timezone: 'Europe/London',
  locale: 'en_CA',
  stream_data: {
    s1: {
      url: 'https://sourcefabric.out.airtime.pro/sourcefabric_a',
      codec: 'mp3',
      bitrate: 192,
      mobile: '0'
    },
    s2: {
      url: 'https://sourcefabric.out.airtime.pro/sourcefabric_b',
      codec: 'mp3',
      bitrate: 128,
      mobile: '0'
    }
  }
}
```

# Functions

## liveInfoV2:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Clive_info_v2%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - timezone (string) - optional
  - days (number) - optional
  - shows (number) - optional

## liveInfo:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Clive_info%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - type (string) - optional
  - limit (number) - optional

## weekInfo:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cweek_info%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - timezone (string) - optional

## stationMetadata:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cstation_metadata%E2%80%9D)


## stationLogo:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cstation_logo%E2%80%9D)


## shows:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cshows%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - showID (number) - optional

## showLogo:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cshow_logo%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - showID (number) - required

## itemHistoryFeed:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Citem_history_feed%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - start (string) - optional
  - end (string) - optional
  - timezone (string) - optional
  - showID (number) - optional

## showTracks:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cshow_tracks%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - showID (number) - required

## showSchedules:
[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9Cshow_schedules%E2%80%9D)

This function takes a single parameter - an object containing the following:
  - showID (number) - required
