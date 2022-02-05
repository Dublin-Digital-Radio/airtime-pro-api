const _ = require('lodash');

const airtime = require('./src');
const a = airtime.init({ stationName: 'x' });

for (const [endpoint, spec] of a.allCalls) {
  console.log(`\n## ${_.camelCase(endpoint)}:`);
  console.log(`[Airtime documentation](https://help.sourcefabric.org/hc/en-us/articles/115000382243-Airtime-Pro-API#%E2%80%9C${endpoint.replace(/-/g, '_')}%E2%80%9D)\n`)
  if (!_.isEmpty(spec)) {
    console.log(`This function takes a single parameter - an object containing the following:`)
  }
  for (const param in spec) {
    const deets = spec[param];
    console.log(`  - ${param} (${deets.type}) - ${deets.required ? 'required' : 'optional'}`);
  }
}
