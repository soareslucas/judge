function obterLocalEstab() {
    navigator.geolocation.getCurrentPosition(succ, onError);

}

// onSuccess Geolocation
//
function succ(position) {
    //      var element = document.getElementById('geolocation');
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    
  
    

    
//                            'Altitude: '           + position.coords.altitude              + '<br />' +
//                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
//                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
//                            'Heading: '            + position.coords.heading               + '<br />' +
//                            'Speed: '              + position.coords.speed                 + '<br />' +
//                            'Timestamp: '          +                                   position.timestamp          + '<br />';


    document.getElementById('latitude').innerHTML = '<p class="text-center">'+ latitude + '</p>';
    document.getElementById('longitude').innerHTML = '<p class="text-center">' + longitude + '</p>';

    window.localStorage.setItem('latitudeEstab', latitude);
    window.localStorage.setItem('longitudeEstab', longitude);

}


// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}
