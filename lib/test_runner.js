var BlueRidge = BlueRidge || {};

BlueRidge.CommandLine = {
  require: function(file, options){ 
    load(this.prepareFilenameForRequireBasedOnSpecDirectory(file));
  
    options = options || {};
    if(options['onload']) {
      options['onload'].call();
    }
  },

  debug: function(message){
    console.debug(message);
  },
  
  prepareFilenameForRequireBasedOnSpecDirectory: function(filename){
    if(filename == null || filename[0] == "/") { return filename; }
    return (this.specDirname == null) ? filename : (this.specDirname + "/" + filename);
  },
  
  get fixtureFile(){
    return "fixtures/" + this.specFile.replace(/^(.*?)_spec\.js$/, "$1.html");
  },
  
  get specDirname(){
    if(this.specFile == null) { return null; }
    var pathComponents = this.specFile.split("/");
    var filename = pathComponents.pop();
    return (pathComponents.length > 0) ? pathComponents.join("/") : null;
  }
};

if(BlueRidge.loaded != true) {
  if(system.args.length == 0) {
    console.log("Usage: test_runner.js spec/javascripts/file_spec.js");
    quit(1);
  }
  
  BlueRidge.CommandLine.specFile = system.args[0];

  var require = function(url, options){ return BlueRidge.CommandLine.require(url, options) };
  var debug   = function(message)     { return BlueRidge.CommandLine.debug(message) };

  // Mock up the Firebug API for convenience.
  var console = console || {debug: debug, log: debug, info: debug, warn: debug, error: debug};

  // var BLUE_RIDGE_PREFIX = (environment["blue.ridge.prefix"] || "../../vendor/plugins/blue-ridge");
	var BLUE_RIDGE_PREFIX = (environment["blue.ridge.prefix"] || "..");
  var BLUE_RIDGE_LIB_PREFIX    = BLUE_RIDGE_PREFIX + "/lib/";
  var BLUE_RIDGE_VENDOR_PREFIX = BLUE_RIDGE_PREFIX + "/vendor/";

  require(BLUE_RIDGE_VENDOR_PREFIX + "env.rhino.js");

  Envjs(BlueRidge.CommandLine.fixtureFile, {
    loadInlineScript: function(){},
    log: function(){}
  });

  Envjs.wait();

  require(BLUE_RIDGE_VENDOR_PREFIX + "jquery-1.4.2.min.js");
  require(BLUE_RIDGE_VENDOR_PREFIX + "jasmine-0.10.3.js");
  require(BLUE_RIDGE_LIB_PREFIX + "console_reporter.js");

  print("Running " + BlueRidge.CommandLine.specFile + " with fixture '" + BlueRidge.CommandLine.fixtureFile + "'...");
  BlueRidge.loaded = true;

  load(BlueRidge.CommandLine.specFile);
  jQuery(window).trigger("load");

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.reporter = new jasmine.ConsoleReporter();
  jasmineEnv.execute();

  Envjs.wait();
}