require("spec_helper.js");
require("../../lib/test_runner.js");

//TODO: get Smoke to where I can just stub all the assigmnents to BlueRidge.CommandLine.specFile below.
describe("BlueRidge.CommandLine", function(){
  afterEach(function(){ teardownFixtures() });

  describe("fixtureFile", function(){
    it("returns the filename converted from a '_spec.js' suffix to '.html'", function(){
      BlueRidge.CommandLine.specFile = 'some/path/to/a_spec.js'
      expect(BlueRidge.CommandLine.fixtureFile).toMatch(/a\.html$/);
    });

    it("returns the filename prepended with 'fixtures/'", function(){
      BlueRidge.CommandLine.specFile = 'some/path/to/a_spec.js'
      expect(BlueRidge.CommandLine.fixtureFile).toMatch(/^fixtures\/some\/path\/to\/a/);
    });
  });

  describe("specDirname", function(){
    it("returns null if given a null spec filename", function(){
      BlueRidge.CommandLine.specFile = null
      expect(BlueRidge.CommandLine.specDirname).toBeNull();
    });

    it("returns null if given a spec filename without a path prefix", function(){
      BlueRidge.CommandLine.specFile = 'some_spec.js'
      expect(BlueRidge.CommandLine.specDirname).toBeNull();
    });

    it("returns the path prefix if given a spec filename with a path prefix", function(){
      BlueRidge.CommandLine.specFile = 'some/path/to/some_spec.js'
      expect(BlueRidge.CommandLine.specDirname).toEqual("some/path/to");
    });
  });

  describe("prepareFilenameForRequireBasedOnSpecDirectory", function(){
    it("returns null if given a null filename", function(){
      expect(BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory(null)).toBeNull();
    });

    it("returns the given filename if is it an absolute filepath", function(){
      var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("/some/absolute/filename.txt");
      expect(filename).toEqual("/some/absolute/filename.txt");
    });

    describe("when given a relative filepath", function(){
      it("returns the given filename unchanged if there was NO path prefix on the spec filename", function(){
        BlueRidge.CommandLine.specFile = 'some_spec.js'
        var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("../../filename.txt");
        expect(filename).toEqual("../../filename.txt");
      });

      it("returns the given filename with the spec file dirname prepended if there was a path prefix on the spec filename", function(){
        BlueRidge.CommandLine.specFile = 'some/path/to/some_spec.js'
        var filename = BlueRidge.CommandLine.prepareFilenameForRequireBasedOnSpecDirectory("../../filename.txt");
        expect(filename).toEqual("some/path/to/../../filename.txt");
      });
    });
  });
});
