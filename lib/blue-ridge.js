var BlueRidge = BlueRidge || {};

BlueRidge.Browser = {
  require: function(url, options){
    options = options || {};

    var system   = options["system"] || false;
    var callback = options["onload"] || null;

    url = (system) ? this.treatUrlAsRelativeToCurrentFile(url) : this.treatUrlAsRelativeToSpecFile(url);
    this.createScriptTag(url, callback);
  },

  //TODO: holy crap this needs refactoring
  treatUrlAsRelativeToSpecFile: function(url){
    var depth = this.calculateDepth();

    //remove any extra "../" from the start of the URL
    var prefix = "^";
    for(var i=0; i < (depth-1); i++) { prefix += "\.\.\/" }
    url = url.replace(new RegExp(prefix), ""); 
    
    return this.urlCorrection(depth) + url;
  },
  
  treatUrlAsRelativeToCurrentFile: function(url){
    return this.urlCorrection(this.calculateDepth()) + url;
  },
  
  createScriptTag: function(url, onload){
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");

    script.src = url;
    if(onload) { script.onload = script.onreadystatechange = onload; }

    head.appendChild(script);
  },
  
  urlCorrection: function(depth){
    var correction = "";
    for(var i=0; i < depth; i++) { correction += "../" }
    return correction;
  },
  
  debug: function(message){
    document.writeln(message + " <br/>");
  },

  currentFile: function(){
    return window.location.toString();
  },
  
  deriveSpecNameFromCurrentFile: function(){
    return this.currentFile().match(/^.*fixtures\/(.*?)\.html/)[1] + "_spec.js";
  },
  
  calculateDepth: function(){
    var subDirs = this.currentFile().match(/^.*fixtures\/((.*?\/)*)(.*?)\.html/)[1];
    return subDirs.split("/").length;
  }
};

if(BlueRidge.loaded != true) {
  var require = function(url, options){ return BlueRidge.Browser.require(url, options) };
  var debug   = function(message)     { return BlueRidge.Browser.debug(message) };

  var BLUE_RIDGE_PREFIX = BLUE_RIDGE_PREFIX || "../../vendor/plugins/blue-ridge/";
  var BLUE_RIDGE_VENDOR_PREFIX = BLUE_RIDGE_PREFIX + "/vendor/";

  require(BLUE_RIDGE_VENDOR_PREFIX + "jquery-1.4.2.js",    {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "jasmine-0.10.3.js",  {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "TrivialReporter.js", {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "consolex.js",        {system: true});

  BlueRidge.loaded = true;

  require(BlueRidge.Browser.deriveSpecNameFromCurrentFile(), {onload: function () {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.reporter = new jasmine.TrivialReporter();
    jasmineEnv.execute();
  }});
}
