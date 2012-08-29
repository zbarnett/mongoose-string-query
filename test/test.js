var expect = require("expect.js")
  , Browser = require("zombie")
  , browser = new Browser();

var hasMonster = function (name) {
  expect(browser.response[2]).to.contain('"' + name + '"');
}

var hasMonsterCount = function (num) {
  var json = JSON.parse(browser.response[2]);
  expect(json.length).to.equal(num);
}

describe('mongoose-api-query', function(){

  it('without any query params, loads all monsters', function(done){
    browser.visit("http://localhost:3000/test1", function () {
      hasMonster("Big Purple People Eater")
      hasMonster("Bessie the Lochness Monster")
      hasMonster("Clay Johnson")
      hasMonster("Frankenstein")
      hasMonster("Biggie Smalls")
      hasMonster("Biggie Smalls the 2nd")
      done();
    });
  });

  describe('SchemaString', function(){
    it('filters without case-sensitivity', function(done){
      browser.visit("http://localhost:3000/test1?name=big%20purple", function (){
        hasMonster("Big Purple People Eater");
        hasMonsterCount(1);
        done();
      });
    });

    it('does partial matching by default', function(done){
      browser.visit("http://localhost:3000/test1?name=biggie%20smalls", function (){
        hasMonster("Biggie Smalls");
        hasMonster("Biggie Smalls the 2nd");
        hasMonsterCount(2);
        done();
      });
    });
  });

  describe('SchemaNumber', function(){
    it('returns correct result for a basic search', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no=301", function (){
        hasMonster("Frankenstein");
        hasMonsterCount(1);
        done();
      });
    });

    it('does not do partial matching by default', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no=30", function (){
        hasMonsterCount(0);
        done();
      });
    });

    it('returns correct results for {gt}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no={gt}100439", function (){
        hasMonster("Biggie Smalls the 2nd");
        hasMonsterCount(1);
        done();
      });
    });

    it('returns correct results for {gte}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no={gte}100439", function (){
        hasMonster("Biggie Smalls");
        hasMonster("Biggie Smalls the 2nd");
        hasMonsterCount(2);
        done();
      });
    });

    it('returns correct results for {lt}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no={lt}200", function (){
        hasMonster("Big Purple People Eater");
        hasMonsterCount(1);
        done();
      });
    });

    it('returns correct results for {lte}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no={lte}200", function (){
        hasMonster("Big Purple People Eater");
        hasMonster("Bessie the Lochness Monster");
        hasMonster("Clay Johnson");
        hasMonsterCount(3);
        done();
      });
    });

    it('returns correct results for {in}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no=1,301", function (){
        hasMonster("Big Purple People Eater");
        hasMonster("Frankenstein");
        hasMonsterCount(2);
        done();
      });
    });

    it('returns correct results for {all}', function(done){
      browser.visit("http://localhost:3000/test1?monster_identification_no={all}1,301", function (){
        hasMonsterCount(0);
        done();
      });
    });
  });



});
