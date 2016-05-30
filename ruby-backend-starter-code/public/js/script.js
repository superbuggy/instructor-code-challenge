var searchResult, resultsDiv, favorites, faveDiv;

document.addEventListener("DOMContentLoaded", function() {

  //makes a synchronous call to sinatra back-end for the favorites
  var requestFaves = new XMLHttpRequest();
  requestFaves.open("GET", "/favorites", false);
  requestFaves.onload = function() {
    if (requestFaves.status < 400 && requestFaves.status >= 200) {
      favorites = JSON.parse(requestFaves.responseText);
    } else {
      alert("Couldn't load favorites. Error #" + requestFaves.status);
    }
  };
  requestFaves.send();

  faveDiv = document.getElementById('favorites');
  console.log(faveDiv);
  favorites.forEach(function(fave){
    var faveLink = document.createElement("a");
    faveLink.setAttribute("href","http://www.imdb.com/title/" + fave.oid);
    var faveLinkTextNode = document.createTextNode(fave.name);
    faveLink.appendChild(faveLinkTextNode);
    var faveLinkContainer = document.createElement("p");
    faveLinkContainer.appendChild(faveLink);
    faveDiv.appendChild(faveLinkContainer);
  });


  //points to the div in index.html with id "results", used for rendering DOM elements
  resultsDiv = document.getElementById("results");

  var searchButton = document.getElementById("search-button");
  var searchBox = document.getElementById("search-box");

  searchButton.addEventListener("click", getSearchQuery );

  function getSearchQuery() {
    query = searchBox.value;
    omdbRequest(query, "s");
  }
});

//makes a request to the OMDB api using an ajax request, the 2nd parameter
//is either "t" or "s"; t returns a specific title, and s returns multiple matches
function omdbRequest(searchString, searchMode) {
  //creates a new request object used to get data from an API, then provides
  //a verb (GET) and a path (the url), which together form a request
  var request = new XMLHttpRequest();
  request.open("GET", "http://www.omdbapi.com/?" + searchMode + "=" + searchString, true);
  //since the third parameter on the line above is true, we send an ansynchronous
  //request, requiring the onload method below, which defers the execution of the
  //anonymous function until the request has been met with a response
  request.onload = function() {
    //ensures that the request was successful or alerts the user of a bad error
    if (request.status < 400 && request.status >= 200) {
      //searchResult stores the data obtained from the OMBD API as json
      searchResult = JSON.parse(request.responseText);
      if (searchMode == "s"){
        displayResults(searchResult);
      } else {
        showDetails(searchResult);
      }
    } else {
      alert("Request unsuccessful. Error #" + request.status);
    }
  };

  request.send();
}

//this method renders search results one by one
function displayResults(resultsToDisplay) {
  //clears any previous search results
  resultsDiv.innerHTML = '';
  //uses a callback function within forEach to render each result
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

  //defines a container div for each result, adds class for css styling
  var resultContainer = document.createElement("div");
  resultContainer.setAttribute("class", "result");
  resultContainer.setAttribute("id",id);

  //combines the title and year of each result and appends to a header
  var resultHeader = document.createElement("header");
  var aboutText = title + " (" + year + ")";
  var resultTextNode = document.createTextNode(aboutText);
  resultHeader.appendChild(resultTextNode);

  //adds the image for each result
  var resultImg = document.createElement("img");
  resultImg.setAttribute("src", imgUrl);

  //adds a link (wrapped in a p tag) for 'favoriting' a movie. favUrl is built
  //used to make a GET request that tells the ruby back-end to store
  //data based on the parameters, or the values following the slashes
  var linkContainer = document.createElement("p");
  var favLink = document.createElement("a");
  var favUrl = "/favorites/" + title + "/" + id;
  var favTextNode = document.createTextNode("Add to Favorites");
  favLink.appendChild(favTextNode);
  favLink.setAttribute("href", favUrl);
  linkContainer.appendChild(favLink);

  var detailsLinkContainer = document.createElement("p");
  var detailsLink = document.createElement("a");
  var detailsText = document.createTextNode("Show Details");
  detailsLink.appendChild(detailsText);
  detailsLinkContainer.appendChild(detailsLink);

  detailsLink.addEventListener("click", function() {
    result = omdbRequest(title, "t");
  });

  //attaches all the elements to the container
  resultContainer.appendChild(resultHeader);
  resultContainer.appendChild(resultImg);
  resultContainer.appendChild(linkContainer);
  resultContainer.appendChild(detailsLinkContainer);

  //appends the completed result-container to the results div in index.html
  resultsDiv.appendChild(resultContainer);
}

function showDetails(result) {
  var title = result.Title;
  var year = result.Year;
  var imgUrl = result.Poster;
  var id = result.imdbID;
  var plot = result.Plot;
  var runtime = result.Runtime;
  var actors = result.Actors;
  var writer = result.Writer;
  var director = result.Director;
  var imdbRating = result.imdbRating;
  var metaScore = result.Metascore;

  //details div
  var detailsDiv = document.createElement("div");

  var scoreNode = document.createTextNode(
    "IMDB score: " + imdbRating + ", Metacritic score " + metaScore);
    var scorePara = document.createElement("p");
    scorePara.appendChild(scoreNode);

    var plotNode = document.createTextNode(plot);
    var plotPara = document.createElement("p");
    plotPara.appendChild(plotNode);

    var runtimeNode = document.createTextNode(runtime + " minutes");
    var runtimePara = document.createElement("p");
    runtimePara.appendChild(runtimeNode);

    var personnelNode = document.createTextNode(
      "Written by " + writer + ", directed by " + director + ", starring: " + actors);
      var personnelPara = document.createElement("p");
      personnelPara.appendChild(personnelNode);

      //adds all paragraph tags to the details div
      detailsDiv.appendChild(runtimePara);
      detailsDiv.appendChild(personnelPara);
      detailsDiv.appendChild(plotPara);
      detailsDiv.appendChild(scorePara);

      var resultContainer = document.getElementById(id);
      resultContainer.appendChild(detailsDiv);

    }
