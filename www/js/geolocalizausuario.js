function obterLocalUsuario() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

// onSuccess Geolocation
//
function onSuccess(position) {
    //      var element = document.getElementById('geolocation');
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    


    window.localStorage.setItem('latitudeUsuario', latitude);
    window.localStorage.setItem('longitudeUsuario', longitude);

}


// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
}
