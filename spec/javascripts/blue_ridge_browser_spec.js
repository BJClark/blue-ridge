require("spec_helper.js");
require("../../lib/blue-ridge.js");

describe("BlueRidge.Browser", function(){
  describe("deriveSpecNameFromCurrentFile", function(){
    it("returns the current file's patch from the fixtures directory minus the '.html' suffix and with '_spec.js' appended", function(){
      spyOn(BlueRidge.Browser, 'currentFile').andReturn("/some/prefix/path/fixtures/path/to/current_file.html");
      expect(BlueRidge.Browser.deriveSpecNameFromCurrentFile()).toEqual("path/to/current_file_spec.js");
    });
  });

  describe("urlCorrection", function(){
    it("returns an empty string if the given depth is zero", function(){
      expect(BlueRidge.Browser.urlCorrection(0)).toEqual("");
    });

    it("returns one directory up if the given depth is 1", function(){
      expect(BlueRidge.Browser.urlCorrection(1)).toEqual("../");
    });

    it("returns seven directories up if the given depth is 7", function(){
      expect(BlueRidge.Browser.urlCorrection(7)).toEqual("../../../../../../../");
    });
  });

  describe("calculateDepth", function(){
    it("returns 1 if the current file is a direct child of the 'fixtures' directory", function(){
      spyOn(BlueRidge.Browser, 'currentFile').andReturn("/some/prefix/fixtures/current_file.html");
      expect(BlueRidge.Browser.calculateDepth()).toEqual(1);
    });

    it("returns 2 if the current file is in a subdirectory ONE level beneath the 'fixtures' directory", function(){
      spyOn(BlueRidge.Browser, 'currentFile').andReturn("/some/prefix/fixtures/subdirectory/current_file.html");
      expect(BlueRidge.Browser.calculateDepth()).toEqual(2);
    });

    it("returns 8 if the current file is in a subdirectory SEVEN levels beneath the 'fixtures' directory", function(){
      spyOn(BlueRidge.Browser, 'currentFile').andReturn("/some/prefix/fixtures/1/2/3/4/5/6/7/current_file.html");
      expect(BlueRidge.Browser.calculateDepth()).toEqual(8);
    });
  });

  //TODO split most of these tests out into tests for the treatUrlAsRelativeTo* functions
  describe("require", function(){
    describe("correctly alters the incoming URL based on the current file's relation to the 'fixtures' directory", function(){
      describe("when requiring a BlueRidge dependency", function(){
        it("prepends a single '../' if the current file is directly in the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("some_file.js", {system: true});
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../some_file.js", null);
        });

        it("prepends two '../' if the current file is in a subdirectory directly beneath the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/foo/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("some_file.js", {system: true});
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../../some_file.js", null);
        });

        it("prepends eight '../' if the current file is in a subdirectory nested seven-directories beneath the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/1/2/3/4/5/6/7/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("some_file.js", {system: true});
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../../../../../../../../some_file.js", null);
        });
      });

      describe("when requiring a spec dependency", function(){
        it("prepends a single '../' if the current file is directly in the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("some_file.js");
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../some_file.js", null);
        });

        it("pops off one '../' and then prepends two '../' if the current file is in a subdirectory directly beneath the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/foo/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("../some_file.js");
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../../some_file.js", null);
        });

        it("pops off seven '../' and then prepends eight '../' if the current file is in a subdirectory nested seven-directories beneath the 'fixtures' directory", function(){
          spyOn(BlueRidge.Browser, 'currentFile').andReturn("/ignored/fixtures/1/2/3/4/5/6/7/current_file.html");
          spyOn(BlueRidge.Browser, 'createScriptTag');
          BlueRidge.Browser.require("../../../../../../../some_file.js");
          expect(BlueRidge.Browser.createScriptTag).wasCalledWith("../../../../../../../../some_file.js", null);
        });
      });
    });

    it("creates a script tag with an onload callback if passed an 'onload' option", function(){
      var callback = function(){ alert("some callback!") };
      spyOn(BlueRidge.Browser, "calculateDepth").andReturn(0);
      spyOn(BlueRidge.Browser, 'createScriptTag');
      BlueRidge.Browser.require("some_url", {onload: callback});
      expect(BlueRidge.Browser.createScriptTag).wasCalledWith("some_url", callback);
    });

    it("creates a script tag with NO onload callback if passed NOT an 'onload' option", function(){
      var callback = function(){ alert("some callback!") };
      spyOn(BlueRidge.Browser, "calculateDepth").andReturn(0);
      spyOn(BlueRidge.Browser, 'createScriptTag');
      BlueRidge.Browser.require("some_url");
      expect(BlueRidge.Browser.createScriptTag).wasCalledWith("some_url", null);
    });
  });
});
