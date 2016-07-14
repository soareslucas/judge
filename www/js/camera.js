//
//var pictureSource = navigator.camera.PictureSourceType;
//var destinationType = navigator.camera.DestinationType;


// Wait for PhoneGap to connect with the device
//
//document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready to be used!
//


function camera() {
//    pictureSource = navigator.camera.PictureSourceType;
//    destinationType = navigator.camera.DestinationType;



    $('#div').prepend('<img id="theImg" src="" />');

    var img = document.getElementById('theImg');

    var s = window.localStorage.getItem('src');
    
    img.src = s;


}

//    var pictureSource;   // picture source
//    var destinationType; // sets the format of returned value 
//
//    // Wait for Cordova to connect with the device
//    //
//    document.addEventListener("deviceready",onDeviceReady,false);
//
//    // Cordova is ready to be used!
//    //
//    function onDeviceReady() {
//        pictureSource=navigator.camera.PictureSourceType;
//        destinationType=navigator.camera.DestinationType;
//    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: navigator.camera.DestinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: navigator.camera.DestinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto() {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }
