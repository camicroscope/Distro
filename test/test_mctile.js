// Black-box smoke tests for the /img/MCT/* routes (config/routes.json), which
// proxy to the ca-mctile service. The actual response contract (JSON shape for
// meta, image format for composited, etc.) is defined in the external
// camicroscope-mctile repo, not here -- so these tests only assert that the
// routing/proxy wiring is intact (the request reaches ca-mctile and doesn't
// blow up), not the business-logic contents of the response.

const assert = require('assert');
const fetch = require("node-fetch")

const posturl = "http://localhost:4010/data/Slide/post"
const findurl = "http://localhost:4010/data/Slide/find?name=TEST_MCT"

let slideId;

describe('MCT Slide Setup', function () {
  it('Posts a multi-channel OME-TIFF slide for MCT testing', function (done) {
    this.timeout(5000);
    var slideData = {"name": "TEST_MCT", "specimen": '', "study": '', "location": "/images/exemplar_panel0_real.ome.tif", "mpp": 0.499};
    fetch(posturl, {
      method: "POST",
      mode: "cors",
      headers: {"Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify(slideData)
    }).then(x => x.json()).then(x => {
      assert.equal(x.result.ok, 1, "Post Reported Successful")
      done()
    }).catch(e => done(e))
  })

  it('Finds the added slide and captures its id', function (done) {
    this.timeout(5000);
    fetch(findurl).then(x => x.json()).then(x => {
      assert.equal(x.length, 1, "Slide Shows up in API List")
      slideId = x[0]._id;
      assert.ok(slideId, "Slide has an id")
      done()
    }).catch(e => done(e))
  });
})

describe('MCT Meta Route', function () {
  it('reaches ca-mctile via /img/MCT/meta/ without a routing failure', function (done) {
    this.timeout(10000);
    fetch(`http://localhost:4010/img/MCT/meta/${slideId}`).then(res => {
      // Asserting reachability, not the response shape -- the mctile API
      // contract lives in the camicroscope-mctile repo, not this one.
      assert.ok(res.status < 500, `expected a non-5xx response, got ${res.status}`)
      done()
    }).catch(e => done(e))
  });
})

describe('MCT Raw Route', function () {
  it('reaches ca-mctile via /img/MCT/raw/ without a routing failure', function (done) {
    this.timeout(10000);
    fetch(`http://localhost:4010/img/MCT/raw/${slideId}`).then(res => {
      assert.ok(res.status < 500, `expected a non-5xx response, got ${res.status}`)
      done()
    }).catch(e => done(e))
  });
})

describe('MCT Composited Route', function () {
  it('does not crash the backend on a request with no compositing params', function (done) {
    this.timeout(10000);
    fetch(`http://localhost:4010/img/MCT/composited/${slideId}`).then(res => {
      assert.ok(res.status < 500, `expected a non-5xx response (crash guard), got ${res.status}`)
      done()
    }).catch(e => done(e))
  });
})
