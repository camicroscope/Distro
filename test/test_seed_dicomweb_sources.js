// Runs config/seed_dicomweb_sources.js (a mongosh script, not require()-able)
// against the stack's mongo the same way its own header comment documents,
// then verifies the upsert via the caracal API, including idempotency.

const assert = require('assert');
const fetch = require("node-fetch")
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const findurl = "http://localhost:4010/data/Configuration/find?config_name=dicomweb_sources"
const scriptPath = path.join(__dirname, '..', 'config', 'seed_dicomweb_sources.js');
const expectedIds = ['google', 'bmd', 'proscia', 'ntunhs', 'infinitt'];

// mongo:6.0+ only bundles mongosh; mongo:5.0 and earlier only bundle the
// legacy `mongo` shell -- detect which is actually present rather than
// hardcoding one, since ca-mongo's version varies by compose file.
function mongoShellBinary() {
  try {
    execFileSync('docker', ['exec', 'ca-mongo', 'which', 'mongosh']);
    return 'mongosh';
  } catch (e) {
    return 'mongo';
  }
}

function runSeedScript() {
  const script = fs.readFileSync(scriptPath);
  execFileSync('docker', ['exec', '-i', 'ca-mongo', mongoShellBinary(), 'camic', '--quiet'], { input: script });
}

describe('Seed DICOMweb Sources', function () {
  it('upserts the dicomweb_sources configuration document', function (done) {
    this.timeout(15000);
    try {
      runSeedScript();
    } catch (e) {
      return done(e);
    }
    fetch(findurl).then(x => x.json()).then(x => {
      assert.equal(x.length, 1, "Exactly one dicomweb_sources configuration document exists")
      const ids = x[0].configuration.map(s => s.id);
      expectedIds.forEach(id => assert.ok(ids.includes(id), `expected source "${id}" to be seeded`))
      done()
    }).catch(e => done(e))
  });

  it('is idempotent when run again', function (done) {
    this.timeout(15000);
    try {
      runSeedScript();
    } catch (e) {
      return done(e);
    }
    fetch(findurl).then(x => x.json()).then(x => {
      assert.equal(x.length, 1, "Re-running the seed script does not create a duplicate document")
      done()
    }).catch(e => done(e))
  });
})
