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
            ("click", cameraTakePicture);


        document.getElementById("Insert").onclick = function () {
             db.transaction(insertDB, errorCB, successCB);
        }

        var div = document.getElementById("map_canvas");

        var GOOGLE = { "lat": 43.19, "lng": 21.54 };
        markerpos = GOOGLE;
        // Initialize the map view
        var map = plugin.google.maps.Map.getMap(div,
            {
                'camera': {
                    'latLng': GOOGLE,
                    'zoom': 5
                }
            }
        );

        // Wait until the map is ready status.
        map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

        function onMapReady() {
            var button = document.getElementById("button");
            button.addEventListener("click", onBtnClicked, false);

            map.addMarker({
                'position': GOOGLE,
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

            map.getMyLocation(function (location) {
                var msg = ["Current your location:\n",
                    "latitude:" + location.latLng.lat,
                    "longitude:" + location.latLng.lng].join("\n");

                map.addMarker({
                    'position': location.latLng,
                    'title': msg,
                    'draggable': true
                }, function (marker) {
                    marker.showInfoWindow();
                });
            });

        }

        function onBtnClicked() {
            map.showDialog();
        }
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
    var Slika = "";
    if (name != null) {
        tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("' + name
            + '","' + markerpos.lat + '","' + markerpos.lng + '","' + Slika + '")');
    }
}

function successCB() {
    alert("Successfully created court");
    document.getElementById("courtName").value = "";
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}


function cameraTakePicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

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