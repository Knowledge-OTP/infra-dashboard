(function(){
    jasmine.getFixtures().fixturesPath = "base/test/jsonFixtures/";

    window.content = JSON.parse(readFixtures("content.json"));
})();
