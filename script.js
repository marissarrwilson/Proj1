//Yelp Fusion API Key
const apiKeyYELP = "EZDv5tRzSfa7-uVnENuWVxJseqp-EuPvr14V3TfEXtvyp4o4Vf5AutuD7iaTPpDqUGz_hdCBcsTkKJZaIe0AlyL-FbC8DbKtufn_L6f5NJICtGj1MCqGFXXZo8F0X3Yx";

//HTML5 native geolocation
var devicePos;

//Build query URL for Yelp Fusion API
function buildYelpURL(position){
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?";
    var params = [];
    var terms = [];
    //Checking if there is any input from user
    if($("#location").val() != "") params.push(`location=${$("#location").val()}`);
    if(position != null) {
        params.push(`latitude=${position.coords.latitude}`);
        params.push(`longitude=${position.coords.longitude}`);
    }
    //Pushing categories and keywords onto terms
    if($("#categories").val() != "Select a Category...") terms.push($("#categories").val());
    if($("#keywords").val() != "") terms.push($("#keywords").val());
    params.push(`term=${terms.join(",")}`); //Joining all contents in terms into 1 string and push onto params
    return queryURL + params.join("&"); //return and build the query URL
}

//Send request to Yelp Fusion API
function getYelpResults(){
    //Using buildYelpURL() to build the query URL
    var queryURL = buildYelpURL(devicePos);
    $.ajax({
        url: queryURL,
        method: "GET",
        async: true,
        crossDomain: true,
        headers: {
            "Authorization": `Bearer ${apiKeyYELP}`
        }
    }).then(function(response){
        console.log(response);
        $(".results-container").css("display", "block");
        buildCards(response.businesses);
    //In case unexpected errors happen
    }).fail(function(xhr, textStatus, error){
        console.log(xhr);
        console.log(textStatus);
    });
}

//Build results cards
function buildCards(businesses){
    //Remove all cards under 1st and 2nd row of results
    $("#1stRow, #2ndRow").empty();
    //Building cards for 1st row
    for(let i=0; i < 3; i++){
        //In case there is more than 1 category, all categories are pushed onto an array then joined in append()
        var categories = [];
        for (let j=0; j < businesses[i].categories.length; j++){
            categories.push(businesses[i].categories[j].title);
        }
        //Inserting contents for card
        $("#1stRow").append(`
              <div class="card col-md-4 col-lg-4 col-sm-4 col-xs-12">
                  <img class="card-img-top" src="${businesses[i].image_url}" alt="Rest. img">
                  <div class="card-body">
                      <h5>${businesses[i].name}</h5>
                      <p><small class="text-muted">${categories.join(", ")}</small></p>
                      <p>${businesses[i].location.display_address.join(",")}</p>
                      <p>${businesses[i].phone}</p>
                  </div>
              </div>
        `);
    }
    //Building cards for 2nd row
    for(let i=3; i < 6; i++){
        //In case there is more than 1 category, all categories are pushed onto an array then joined in append()
        var categories = [];
        for (let j=0; j < businesses[i].categories.length; j++){
            categories.push(businesses[i].categories[j].title);
        }
        //Inserting contents
        $("#2ndRow").append(`
              <div class="card col-md-4 col-lg-4 col-sm-4 col-xs-12">
                  <img class="card-img-top" src="${businesses[i].image_url}" alt="Rest. img">
                  <div class="card-body">
                      <h5>${businesses[i].name}</h5>
                      <p><small class="text-muted">${categories.join(", ")}</small></p>
                      <p>${businesses[i].location.display_address.join(",")}</p>
                      <p>${businesses[i].phone}</p>
                  </div>
              </div>
        `);
    }

}

//Using native HTML5 geolocation to get user's location and pass to getRestaurant()
function getLocation(){
    console.log("getLocation() Ran");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

//In order to work with getCUrrentPosition()
function setPosition(position){
  devicePos = position;
}

$(document).ready(function(){
  $(".curLocation").on("click", getLocation);
  $("#searchBtn").on("click", getYelpResults);
});