const jsdom = require('jsdom');
const assert = require('assert');
const { JSDOM } = jsdom;

// jsdom instance
const testurl = "http://localhost:4010/viewer.html"


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

describe('Minimal Distribution Test', function () {

  // Can we see the table?
  it('Routes With Correct Title', function (done) {
    JSDOM.fromURL(testurl).then((dom)=>{
      let a = new Promise((resolve, reject)=>{
        setInterval(()=>{
          if (dom.window.document.body.innerHTML!==""){
            resolve()
          }
        }, 100)
      })
      a.then(x=>{
        const title = dom.window.document.title
        assert.equal(title,"caMicroscope",'Minimal Test; Title ok')
        done()
      }).catch(x=>{
        console.log("err")
        console.log(x)
        done(x)
      })
    })

  });
});
