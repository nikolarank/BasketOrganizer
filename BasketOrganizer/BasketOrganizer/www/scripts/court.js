// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var markerpos;

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var db = window.sqlitePlugin.openDatabase({ name: 'nova.db', location: 'default' });

        document.getElementById("cameraTakePicture").addEventListener
            ("click", openCamera);

        document.getElementById("cameraGetPicture").addEventListener
            ("click", openFilePicker);



        document.getElementById("Insert").onclick = function () {
             db.transaction(insertDB, errorCB, successCB);
        }

        var div = document.getElementById("map_canvas");


        var Latitude = undefined;
        var Longitude = undefined;

        // Get geo coordinates

        navigator.geolocation.getCurrentPosition
            (onMapSuccess, onMapError, { enableHighAccuracy: true });

        function onMapSuccess (position) {

            Latitude = position.coords.latitude;
            Longitude = position.coords.longitude;
            markerpos = { "lat": Latitude, "lng": Longitude };
            var map = plugin.google.maps.Map.getMap(div,
                {
                    'camera': {
                        'latLng': markerpos,
                        'zoom': 14
                    }
                }
            );

            // Wait until the map is ready status.
            map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

            function onMapReady() {

                map.clear();

                var button = document.getElementById("button");
                button.addEventListener("click", onBtnClicked, false);

                map.addMarker({
                    'position': markerpos,
                    'title': "Prevuci do terena",
                    'draggable': true
                }, function (marker) {

                    marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (marker) {
                        marker.getPosition(function (latLng) {
                            markerpos = latLng;
                            marker.setTitle(latLng.toUrlValue());
                            marker.showInfoWindow();
                        });
                    });
                });

        }

        //var GOOGLE = { "lat": 43.19, "lng": 21.54 };
        //markerpos = GOOGLE;
        // Initialize the map view
        

        }

        function onMapError() {
            markerpos = { "lat": 43.19, "lng": 21.54 };
        }

        function onBtnClicked() {
            map.showDialog();
        }

        console.log(navigator.vibrate);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

function insertDB(tx) {
    var name = document.getElementById("courtName").value;

    var Slika = document.getElementById("myImage").src;

    if (name != null) {
        tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("' + name
            + '","' + markerpos.lat + '","' + markerpos.lng + '","' + Slika + '")');
    }
}

function successCB() {
    //alert("Successfully created court");
    document.getElementById("courtName").value = "";
    document.getElementById("myImage").style.display = "none";
    navigator.vibrate(2000);
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}


//function cameraTakePicture() {
//    navigator.camera.getPicture(onSuccess, onFail, {
//        quality: 50,
//        destinationType: Camera.DestinationType.DATA_URL
//    });

//    function onSuccess(imageData) {
//        var image = document.getElementById('myImage');
//        image.style.display = "inline";
//        image.src = "data:image/jpeg;base64," + imageData;
//    }

//    function onFail(message) {
//        alert('Failed because: ' + message);
//    }
//}

// Transaction error callback
//
document.getElementById("addGame").onclick = function () {
    location.href = "AddEventPage.html";
}

document.getElementById("addCourt").onclick = function () {
    location.href = "AddCourtPage.html";
}

document.getElementById("clickUpcoming").onclick = function () {
    location.href = "UpComingEventsPage.html";
}

document.getElementById("clickSearch").onclick = function () {
    location.href = "SearchPage.html";
}

document.getElementById("clickProfile").onclick = function () {
    location.href = "ProfilePage.html";
}

function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//function cameraGetPicture() {
//    navigator.camera.getPicture(onSuccess, onFail, {
//        quality: 50,
//        destinationType: Camera.DestinationType.DATA_URL,
//        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
//    });

//    function onSuccess(imageURL) {
//        var image = document.getElementById('myImage');
//        image.style.display = "inline";
//        image.src = imageURL;
//    }

//    function onFail(message) {
//        alert('Failed because: ' + message);
//    }

//}

function openFilePicker(selection) {

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    var func = createNewFileEntry;

    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        var image = document.getElementById('myImage');
        image.style.display = "inline";
        image.src = imageUri;

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function createNewFileEntry(imgUri) {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

        // JPEG file
        dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

            // Do something with it, like write to it, upload it, etc.
            writeFile(fileEntry, imgUri);
            console.log("got file: " + fileEntry.fullPath);
            // displayFileData(fileEntry.fullPath, "File copied to");

        }, onErrorCreateFile);

    }, onErrorResolveUrl);
}

function onErrorCreateFile() {
    console.log("Create file fail...");
}

function onErrorResolveUrl() {
    console.log("File system fail...");
}
function getFileEntry(imgUri) {
    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

        // Do something with the FileEntry object, like write to it, upload it, etc.
        // writeFile(fileEntry, imgUri);
        console.log("got file: " + fileEntry.fullPath);
        // displayFileData(fileEntry.nativeURL, "Native URL");

    }, function () {
        // If don't get the FileEntry (which may happen when testing
        // on some emulators), copy to a new FileEntry.
        createNewFileEntry(imgUri);
    });
}

function openCamera(selection) {

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    var func = createNewFileEntry;
    navigator.camera.getPicture(function cameraSuccess(imageUri) {

        var image = document.getElementById('myImage');
        image.style.display = "inline";
        image.src = imageUri;

        func(imageUri);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

function writeFile(fileEntry, dataObj, isAppend) {

    // Create a FileWriter object for our FileEntry (log.txt). 
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            console.log("Successful file write...");
            //if (dataObj.type == "image/png") {
            //    //readBinaryFile(fileEntry);
            //}
            //else {
            //    readFile(fileEntry);
            //}
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

function readFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            console.log("Successful file read: " + this.result);
            alert(fileEntry.fullPath + ": " + this.result);
        };

        reader.readAsText(file);

    }, onErrorReadFile);
}


function onErrorReadFile() {
    console.log("Unable to read");
}