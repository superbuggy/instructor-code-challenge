var searchResults, resultsDiv;

document.addEventListener("DOMContentLoaded", function() {

  resultsDiv = document.getElementById("results");

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

//renders search results one by one
function displayResults(resultsToDisplay) {
  //The OMDB api's JSON struture stores the search results in the property named "Search"
  resultsToDisplay.Search.forEach(
    function(result){
      renderResult(result);
    }
  );
}

//renders an individual search result
function renderResult(result){
  var title = result.Title;
  var year = result.Year;
  var imgUrl = result.Poster;
  var id = result.imdbID;

  var resultContainer = document.createElement("div");
  resultContainer.setAttribute("class", "result");

  var aboutText = title + " (" + year + ")";
  var resultTextNode = document.createTextNode(aboutText);
  var resultHeader = document.createElement("header");

  resultHeader.appendChild(resultTextNode);

  var resultImg = document.createElement("img");
  resultImg.setAttribute("src", imgUrl);

  resultContainer.appendChild(resultHeader);
  resultContainer.appendChild(resultImg);
  resultsDiv.appendChild(resultContainer);
}
