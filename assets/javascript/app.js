// Eric Goldstein, Karen Gertenbach, Maria Kuznetsova, Jeffrey Phelps - 
// DU Web Dev Bootcamp 2017/2018 - Week-8 Homework - Project 1


// ******************************************************************* //


var venueLatitude;
var venueLongitude;
var artistName; //holds artist's name from response.name
var contentVisible; //holds true or false value for function to show or hide content


// Google/Youtube video finder AJAX - API

var videoArtist;

$("#search-btn").on("click", function() {
    videoArtist =$("#query").val();
});


var gapikey = 'AIzaSyCKMpw2nmPnon_gkh4EIXnbiAmrZNw-v4M';

$(function() {

    $('#search-form').submit( function(e) {
        e.preventDefault();
    });

});

function search(artist) {

    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();

    $.ajax({
        method: 'GET',
        url: `https://www.googleapis.com/youtube/v3/search?&part=snippet,id&q=${artist}&type=video&key=${gapikey}`,
        headers: 'Access-Control-Allow-Origin'
    }).done((data)=>{
        console.log(data);
        var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
    });
 };

// Next page function
function nextPage() {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');
    
    
    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();  // this probably shouldn't be created as a global
    
    // run get request on API
    $.get(
        `https://www.googleapis.com/youtube/v3/search?&part=snippet,id&q=${videoArtist}&type=video&key=${gapikey}`, {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
};

// Previous page function
function prevPage() {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');
    
    
    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();
    
    // run get request on API
    $.get(
        `https://www.googleapis.com/youtube/v3/search?&part=snippet,id&q=${videoArtist}&type=video&key=${gapikey}`, {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
};

// Build output
function getOutput(item) {

    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;
    
    // Build output string
    var output = 	'<li>' +
                        '<div class="list-left">' +
                            '<img src="' + thumb + '">' +
                        '</div>' +
                        '<div class="list-right">' +
                            '<h3><a data-fancybox-type="iframe" class="fancyboxIframe" href="https://youtube.com/embed/' + videoID + '?rel=0" target="new">' + title + '</a></h3>' +
                            '<small>By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>' +
                            '<p>' + description + '</p>' +
                        '</div>' +
                    '</li>' +
                    '<div class="clearfix"></div>' +
                    '';
    return output;
};

function getButtons(prevPageToken, nextPageToken) {
    if(!prevPageToken) {
        var btnoutput = 	'<div class="button-container">' +
                                '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
                                    'onclick = "nextPage();">Next Page</button>' +
                            '</div>';
    } else {
        var btnoutput = 	'<div class="button-container">' +
                                '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
                                    'onclick = "prevPage();">Prev Page</button>' +            
                                '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
                                    'onclick = "nextPage();">Next Page</button>' +
                            '</div>';        
    }
    
    return btnoutput;
};


// ******************************************************************* //


// ******************************************************************* //

// Bands In Town AJAX - API

function searchBandsInTown(artist) {

// Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
var queryURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        contentVisible = true;
        showOrHide();
        // Printing the entire object to console
        console.log(response);


        artistName = $("<h1>").text(response.name);
        var artistURL = $("<a>").attr("href", response.url).append(artistName).attr("target", "_blank");
        var artistImage = $("<img>").attr("src", response.thumb_url);
        var trackerCount = $("<h3>").text(response.tracker_count + " fans tracking this artist");
        var upcomingEvents = $("<h3>").text(response.upcoming_event_count + " upcoming events");
        var goToArtist = $("<a>").attr("href", response.url).attr("target", "_blank");
         // goToArtist.append(`<i class="far fa-calendar-alt"></i>`);
        var facebookPage = $("<a>").attr("href", response.facebook_page_url).attr("target", "_blank");
        facebookPage.append(`<i class="fa fa-facebook-official" style="font-size:100px"></i>`);
        var facebookText = $("<h4>").text(" Facebook Page ");
        var goToArtist = $("<a>").attr("href", response.url);
 
        // Empty the contents of the artist-div, append the new artist content
        $("#dataDrop1").empty();
        $("#dataDrop2").empty();
        $("#dataDrop1").append(artistURL, artistImage);
        $("#dataDrop2").append(facebookPage); 
        if(response.facebook_page_url != "")
        {
         $("#dataDrop2").append(facebookPage);
        }
        $("#dataDrop2").append(goToArtist);
      });
  };
  
     $("#search-btn").on("click", function(event) {
        var inputArtist =$("#query").val().trim();
        console.log(inputArtist);
        searchBandsInTown(inputArtist);
        
         //clearing events div and appending title
        $("#locations").empty();
        $("#locations").append(`<h4 id="locationsTitle">Event locations:</h4>`);

        search(inputArtist);
        searchEvent(inputArtist);
  });


 function searchEvent(artist) {

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

$.ajax({
    url: queryURL,
    method: "GET"

}).done(function(response) {
    contentVisible = true;
    showOrHide();
    console.log(response);

    var eventInfo;
//     var venueName;
    var eventDate;
//     var venueCity;
//     var venueCountry;
    var mapLink;
    var eventDateFormat;
    

        for (var index = 0; index < response.length; index++) {
        
        venueName = response[index].venue.name;
        eventDate = response[index].datetime;
        venueCity = response[index].venue.city;
        venueCountry = response[index].venue.country;
        venueLatitude = parseFloat(response[index].venue.latitude);
        venueLongitude = parseFloat(response[index].venue.longitude);
        eventDateFormat = moment(eventDate).format("MMMM DD YYYY HH:mm");


        eventInfo = (`<h4>${venueCountry} ${venueCity} ${venueName} ${eventDateFormat}</h4>`);


       
        //appending events   
        $("#locations").append(eventInfo);

        // creating map buttons  
        var mapBtn = $("<button>").text("See it on map");
        mapBtn.addClass("map-btn");
        mapBtn.attr('data-lat', venueLatitude);
        mapBtn.attr('data-long', venueLongitude);
        $("#locations").append(mapBtn);


        
        }; // loop closing
            
            //function to show a specific map for each button 
            $(".map-btn").on("click", function(){
            const lat = $(this).attr('data-lat')
            const long = $(this).attr('data-long');

            initMap(+lat, +long);

            }); 
    
            // what happens if the artist has no upcoming events
            if (response.length === 0) {
            $("#locations").empty();
            $("#locations").html(`<h3 id="locationsTitle">This band has no upcoming events but you can check out their amazing videos below</h3>`);
        };

    })
     
     // function to deal with empty input or if artist does not exist in the Bands in Town database
     .fail(function(){
    contentVisible = false;
    showOrHide();
    
    $("#dataDrop1").empty();
    $("#dataDrop2").empty();
    $("#dataDrop1").html(`<h3 id="failArtist">Artist not found</h3>`);
    $("#locations").empty();
    });



};


//Map function
      function initMap(latitude = 39.7392, longitude = -104.9903){
          
        // Map Options
        var mapOptions = {
          zoom: 15,
          center: {lat: latitude, lng: longitude}
        }

        //New map
        var map = new google.maps.Map(document.getElementById('maps'), mapOptions);
          
        //New Marker
         var marker = new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map
        });

      }    
  
// function to hide all content if there is no input or no artist found 
 function showOrHide() {

     if (contentVisible == false) {

        $("#events").hide();
        $("#dataDrop3").hide();
    }

    if (contentVisible == true) {
        $("#events").show();
        $("#dataDrop3").show();
    }

}; 


// Calling an initial Artist on page load

var initialArtists = ["Metallica", "A7X", "U2", "Offspring", "Bruno Mars", "Boz Scaggs", "Katy Perry", 
                        "Wyclef Jean", "Kid Rock", "Collective Soul", "Bryan Adams", "Kenny Chesney", 
                        "Rod Stewart", "Maroon 5", "Foreigner", "Shania Twain", "Beats Antique", "pink", 
                        "Brit Floyd", "Janet Jackson", "Justin Timberlake", "Eminem", "Foo Fighters"];
var initialArtist = initialArtists[Math.floor(Math.random() * initialArtists.length)];

$(document).ready(function() {

    searchBandsInTown(initialArtist);
    $("#locations").append(`<h4 id="locationsTitle">Event locations:</h4>`);
    searchEvent(initialArtist);
    search(initialArtist);
    videoArtist = initialArtist;

  });
  


// ******************************************************************* //
 


