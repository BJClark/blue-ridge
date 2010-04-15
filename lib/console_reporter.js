jasmine.ConsoleReporter = function() {
};

jasmine.ConsoleReporter.prototype.colorize = function(text, status) {
  var colors = {'skip': '33', 'pass': '32', 'fail': '31'};
  return "\u001B[" + colors[status] + "m" + text + "\u001B[0m";
};

jasmine.ConsoleReporter.prototype.reportRunnerStarting = function(runner) {
  this.startedAt = new Date();
};

jasmine.ConsoleReporter.prototype.reportRunnerResults = function(runner) {
  var results = runner.results();

  var elapsedTime = (new Date() - this.startedAt) / 1000.0;
  var status_to_colorize = results.passed() ? 'pass' : 'fail';

  print("\n");
  print(this.colorize(results.totalCount + ' test(s), ' + results.failedCount + ' failure(s)', status_to_colorize));
  print(this.colorize(elapsedTime.toString() + " seconds elapsed", status_to_colorize));

  java.lang.System.exit(results.passed() ? 0 : 1)
};

jasmine.ConsoleReporter.prototype.reportSuiteResults = function(suite) {
};

jasmine.ConsoleReporter.prototype.reportSpecResults = function(spec) {
  var results = spec.results();
  if (results.skipped) {
    java.lang.System.out.print(this.colorize('*', 'skip'));
  } else if (results.passed()) {
    java.lang.System.out.print(this.colorize('.', 'pass'));
  } else {
    print(this.colorize("\nFAILED: " + spec.getFullName(), 'fail'));
    var resultItems = results.getItems();
    for (var i = 0; i < resultItems.length; i++) {
      var result = resultItems[i];
      if (result.passed && !result.passed()) {
        print(this.colorize("          " + result.message + "\n", 'fail'));
        if (result.trace.stack) {
          print(this.colorize("          " + result.trace.stack + "\n", 'fail'));
        }
      }
    }
  }
};

jasmine.ConsoleReporter.prototype.log = function() {
  console.log.apply(console, arguments);
};
