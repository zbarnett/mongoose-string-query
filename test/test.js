var expect = require("expect.js")
  , Browser = require("zombie")
  , browser = new Browser();


describe('mongoose-api-query', function(){

  it('passes test #1', function(done){
    browser.visit("http://localhost:3000/test1", function () {
      expect(browser.response[2]).to.contain('[]');
      done();
    });
  });

});
