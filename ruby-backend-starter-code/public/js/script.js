var searchResults;

document.addEventListener("DOMContentLoaded", function() {

  var searchButton = document.getElementById("search-button");
  var searchBox = document.getElementById("search-box");

  searchButton.addEventListener("click", getSearchQuery );

  function getSearchQuery() {
    query = searchBox.value;
    omdbRequest(query);
  }
});


function omdbRequest(searchString) {

  var request = new XMLHttpRequest();
  request.open('GET', 'http://www.omdbapi.com/?s=' + searchString, true);

  request.onload = function() {
    if (request.status < 400 && request.status >= 200) {
      searchResults = JSON.parse(request.responseText);
      // console.log(searchResults);
      displayResults(searchResults);
    } else {
      alert("Unable to connect. STATUS: " + request.status);
    }
  };

  request.send();
}


function displayResults(resultsToDisplay) {
  resultsToDisplay.Search.forEach( function(result){
    console.log(result);
  });
}
