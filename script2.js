//API Key for EDAMAM
var apiKeyEDA = "4e372854400f9357926f02ba73812e90";
var appID = "1b6b4b3b";
var queryResults;

//Buidling query URL
function buildEDAURL(){
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.edamam.com/search?q=";
    var cred = `&app_id=${appID}&app_key=${apiKeyEDA}&from=0&to=6&`;
    var params = [];
    var params2 = [];
    if($("#keywords").val() != "") params.push($("#keywords").val());
    if($("#categories").val() != "Select a Category...") params.push($("#categories").val())
    if($("#diet").val() != "Select a Diet...") params2.push(`Diet=${$("#diet").val()}`);
    if($("#health").val() != "Select Excluded Ingredient...") params2.push(`Health=${$("#health").val()}`);
    return queryURL = queryURL + params.join(",") + cred + params2.join("&");

}

//Sending request to Edamam's Recipe Search API
function getEDAResults(){
    var queryURL = buildEDAURL();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response){
      console.log(response);
      $(".results-container").css("display", "block");
      buildCards(response.hits);
      queryResults = response.hits; //storeDetails(response);
    }).fail(function(xhr, textStatus, error){
        console.log(xhr);
        console.log(textStatus);
    })
}

//Storing results in a global variable
function storeDetails(response){
    queryResults = response.hits;
}

//Building cards for results
function buildCards(hits){
    $("#1stRow, #2ndRow").empty();
    for(let i=0; i < 3; i++){
        //In case there is more than 1 category, all categories are pushed onto an array then joined in append()
        var categories = [];
        for (let j=0; j < hits[i].recipe.dietLabels.length; j++){
            categories.push(hits[i].recipe.dietLabels[j]);
        }
        for (let j=0; j < hits[i].recipe.healthLabels.length; j++){
            categories.push(hits[i].recipe.healthLabels[j]);
        }
        for (let j=0; j < hits[i].recipe.cautions.length; j++){
            categories.push(hits[i].recipe.cautions[j]);
        }
        $("#1stRow").append(`
            <div class="col-md-4 col-lg-4 col-sm-4 col-xs-12">
                <div class="card card-fluid">
                  <img class="card-img-top" src="${hits[i].recipe.image}" alt="Card image cap">
                  <div class="card-body">
                      <h5 class="card-title">${hits[i].recipe.label}</h5>
                      <p class="categories"><small class="text-muted">${categories.join(", ")}</small></p>
                      <!-- Button trigger modal -->
                      <button type="button" class="detailsBtn btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModalLong" value="${i}">
                          View Full Recipe
                      </button>
                  </div>
               </div>
            </div>
        `);
    }
    for(let i=3; i < 6; i++){
        //In case there is more than 1 category, all categories are pushed onto an array then joined in append()
        var categories = [];
        for (let j=0; j < hits[i].recipe.dietLabels.length; j++){
            categories.push(hits[i].recipe.dietLabels[j]);
        }
        for (let j=0; j < hits[i].recipe.healthLabels.length; j++){
            categories.push(hits[i].recipe.healthLabels[j]);
        }
        for (let j=0; j < hits[i].recipe.cautions.length; j++){
            categories.push(hits[i].recipe.cautions[j]);
        }
        $("#2ndRow").append(`
              <div class="col-md-4 col-lg-4 col-sm-4 col-xs-12">
                <div class="card card-fluid">
                  <img class="card-img-top" src="${hits[i].recipe.image}" alt="Card image cap">
                  <div class="card-body">
                    <h5 class="card-title">${hits[i].recipe.label}</h5>
                    <p class="categories"><small class="text-muted">${categories.join(", ")}</small></p>
                    <!-- Button trigger modal -->
                    <button type="button" class="detailsBtn btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModalLong" value="${i}">
                      View Full Recipe
                    </button>
                  </div>
                </div>
              </div>
        `);
    }
}

//Building modal when "View Full Recipe" is clicked
function buildModal(event){
    $("#modalBody").empty(); //Empty everything in the modal's body
    var i = event.target.value;
    var ingredients = [];
    for (let j=0; j < queryResults[i].recipe.ingredientLines.length; j++){
      ingredients.push(queryResults[i].recipe.ingredientLines[j]);
    }
    $("#modal-title").text(queryResults[i].recipe.label); //Changing modal's title
    $("#modalBody").append("<h5>Ingredients:</h5>");
    //Adding list of ingredients
    for (let j=0; j < ingredients.length; j++){
      $("#modalBody").append(`
        <p>${ingredients[j]}</p>
      `);
    }
    //Adding link to original recipe
    $("#modalBody").append(`
      <a href="${queryResults[i].recipe.url}" target="blank">Link to original site</a>
    `);
}

$(document).ready(function(){
    $("#searchBtn").on("click", getEDAResults);
    $(document).on("click", ".detailsBtn", buildModal);
});