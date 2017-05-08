// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var data = [];

function markItem(ime, lat, lng) {
    this.ime = ime;
    this.latLng = new plugin.google.maps.LatLng(lat, lng);
}

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var db = window.sqlitePlugin.openDatabase({ name: 'nova.db', location: 'default' });

        var div = document.getElementById("map_canvas");


        var Latitude = undefined;
        var Longitude = undefined;

        // Get geo coordinates

        navigator.geolocation.getCurrentPosition
            (onMapSuccess, onMapError, { enableHighAccuracy: true });

        function onMapSuccess(position) {

            Latitude = position.coords.latitude;
            Longitude = position.coords.longitude;

            //getMap(Latitude, Longitude);
            var pos = { "lat": Latitude, "lng": Longitude };

            var map = plugin.google.maps.Map.getMap(div,
                {
                    'camera': {
                        'latLng': pos,
                        'zoom': 13
                    }
                }
            );
            // Wait until the map is ready status.
            map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

            function onMapReady() {

                map.clear();

                map.addMarker({
                    'position': pos,
                    'title': "Your location",
                    'draggable': false
                }, function (marker) {
                    marker.showInfoWindow();
                    });

                var button = document.getElementById("search");
                button.addEventListener("click", onBtnClicked, false);

                var request;

                function onBtnClicked() {
                    request = {
                        'address': $("#geocoder_input").val()
                    };

                    var kilometers = $("#kilometers").val();

                    

                    plugin.google.maps.Geocoder.geocode(request, function (results) {
                        if (results.length) {
                            var result = results[0];
                            var position = result.position;

                            var address = [
                                result.locality || "",
                                result.country || ""].join(", ");

                            map.addMarker({
                                'position': position,
                                'title': address,
                                'draggable': true,
                                'icon': 'blue'
                            }, function (marker) {

                                map.animateCamera({
                                    'target': position,
                                    'zoom': 14
                                }, function () {
                                    //marker.showInfoWindow();
                                    marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, function (marker) {
                                        
                                            marker.setTitle(address);
                                            marker.showInfoWindow();
                                        
                                    });

                                    db.transaction(searchQueryDB, errorCB, selectSuccess);

                                    function selectSuccess(tx, results) {

                                        var len = results.rows.length;
                                        for (var i = 0; i < len; i++) {
                                            if (getDistanceFromLatLonInKm(results.rows.item(i).Lat, results.rows.item(i).Lon, position.lat, position.lng) <= kilometers) {
                                                var mark = new markItem(results.rows.item(i).Ime, results.rows.item(i).Lat, results.rows.item(i).Lon);
                                                data.push(mark);
                                            }
                                        }

                                    }

                                    function errorCB(err) {
                                        alert("Error processing SQL: " + err.code);
                                    }

                                    function searchQueryDB(tx) {
                                        tx.executeSql("SELECT * FROM TEREN",
                                            [], selectSuccess, errorCB);
                                    }
                                });

                            });
                        } else {
                            alert("Not found");
                        }
                    });

                    addMarkers(data, function (markers) {
                        markers[markers.length - 1].showInfoWindow();
                    });

                    function addMarkers(data, callback) {
                        var markers = [];

                        function onMarkerAdded(marker) {
                            markers.push(marker);
                            if (markers.length === data.length) {
                                callback(markers);
                            }
                        }

                        data.forEach(function (element) {
                            var markerOptions =
                                {
                                    'position': element.latLng,
                                    'title': element.ime,
                                    'draggable': false,
                                    'icon': 'yellow',
                                    'animation': plugin.google.maps.Animation.BOUNCE
                                };
                            map.addMarker(markerOptions, onMarkerAdded);
                        });
                    }

                }
            }

                
        
        }
        function onMapError() {
            markerpos = { "lat": 43.19, "lng": 21.54 };
        }
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}