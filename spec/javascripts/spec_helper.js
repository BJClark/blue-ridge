require("jquery-1.4.2.js");

function fixture(element) {
  $('<div id="fixtures"/>').append(element).appendTo("body");
}

function teardownFixtures() {
  $("#fixtures").remove();
}

function createDescribeDiv(name){
  return $('<li class="describe"/>').append('<h1>' + name + '</h1>');
}
