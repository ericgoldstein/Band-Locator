// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA-msJPurSl5Th8tFGBvRH5b5T4SRuiZK0",
    authDomain: "bandlocator-a80b4.firebaseapp.com",
    databaseURL: "https://bandlocator-a80b4.firebaseio.com",
    projectId: "bandlocator-a80b4",
    storageBucket: "bandlocator-a80b4.appspot.com",
    messagingSenderId: "511275654319"
  };
  firebase.initializeApp(config);
    
  var database = firebase.database();
  let venueCity;
  let venueCountry;
  let venueName;

  $('#search-btn').on('click', function(){

    // Retrieve user inputs from form
    var query = $('#query').val().trim();
 
    // Create an object for new train to be added
    var newArtist = {
      createdAt:  new Date().toString(),
      userSearched: query,
      nextEventCity:venueCity,
      nextEventCountry:venueCountry,
      nextEventInfo:venueName,
    }
  
    console.log(newArtist.createdAt);
    console.log('here is my new artist',newArtist)
    database.ref().push(newArtist);
  
    $('#query').val('');

    return false;
  
  });
  
  
  database.ref().on('child_added', function(childSnapshot, prevChildKey) {
  
    var query = childSnapshot.val().query;
  
  

  });
  
  
