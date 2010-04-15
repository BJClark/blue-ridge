require("spec_helper.js");
require("../../public/javascripts/application.js");

describe("Your application javascript", function(){
  it("does something", function(){
    expect("hello").toEqual("hello");
  });

  it("accesses the DOM from fixtures/application.html", function(){
    expect($('.select_me').length).toEqual(2);
  });
});
