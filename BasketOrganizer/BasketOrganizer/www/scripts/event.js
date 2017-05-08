// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

var data = [];
var Court = "";
var loaded = 0;
var set_location = 1;

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

        
        db.transaction(searchDB, errorCB, selectSuccess);

        function selectSuccess(tx, results) {

            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                var mark = new markItem(results.rows.item(i).Ime, results.rows.item(i).Lat, results.rows.item(i).Lon);
                data.push(mark);
            }

        }

        function searchDB(tx) {
            tx.executeSql("SELECT * FROM TEREN", [], selectSuccess, errorCB);
        }



        document.getElementById("Insert").onclick = function () {
            var Datum = document.getElementById("date").value;
            var Vreme = document.getElementById("time").value;

            if (Datum !== 'udefined' && Vreme !== 'undefined') {
                db.transaction(insertDB, errorCB, successCB);
                //vibration
                var time = 3000;
                navigator.vibrate(time);
                //notification
                var date = new Date(Datum);
                var niz = Vreme.split(":");
                
                date.setMinutes(parseInt(niz[1]));
                date.setSeconds(0);
                var sati = parseInt(niz[0]);
                date.setHours(sati);
                var a = date.toISOString();

                var not_time = date.getTime();

                var sad = new Date();

                var diff = (niz[0] - sad.getHours() - 1) * 60 * 60 * 1000 + (niz[1] - sad.getMinutes()) * 60 * 1000; 
                var now = new Date().getTime(),
                    time = new Date(now + diff);

                cordova.plugins.notification.local.schedule({
                    text: "Game reminder " + Vreme,
                    at: time,
                    led: "FF0000"
                });

            }
        }

        var div = document.getElementById("map_canvas");

        //db.transaction(searchQueryDB, errorCB, querySuccess);

        //var GOOGLE = { "lat": 43.19, "lng": 21.54 };
        // Initialize the map view


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

            var map2 = plugin.google.maps.Map.getMap(div,
                {
                    'camera': {
                        'latLng': pos,
                        'zoom': 13
                    }
                }
            );
            // Wait until the map is ready status.
            map2.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

            function onMapReady() {
                map2.clear();

                var button = document.getElementById("button");
                button.addEventListener("click", onBtnClicked, false);

                
                    map2.addMarker({
                        'position': pos,
                        'title': "Your location",
                        'draggable': false
                    }, function (marker) {
                        marker.showInfoWindow();
                        });
                
                
                addMarkers(data, function (markers) {
                    markers[markers.length - 1].showInfoWindow();
                });

                function addMarkers(data, callback) {
                    var markers = [];

                    function onMarkerAdded(marker) {
                        markers.push(marker);
                        marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function () {
                            Court = marker.getTitle();
                        });
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
                                'icon': 'blue',
                                'animation': plugin.google.maps.Animation.BOUNCE
                            };
                        map2.addMarker(markerOptions, onMarkerAdded);
                    });

                }

            }
        }

        function onMapError() {
            markerpos = { "lat": 43.19, "lng": 21.54 };
        }

        function onBtnClicked() {
            map2.showDialog();
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
    var Datum = document.getElementById("date").value;
    var Vreme = document.getElementById("time").value;
    var Igraca = document.getElementById("noplayers").value;

    if (Datum !== 'undefined' && Vreme !== 'undefined' && Igraca !== 'undefined' && Court !== 'undefined') {
        tx.executeSql('INSERT INTO EVENT (Datum, Vreme, Teren, Mesta) VALUES ("' + Datum
            + '","' + Vreme + '","' + Court + '","' + Igraca + '")');
    }
}

function successCB() {
    alert("Successfully created event");
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("noplayers") = "Number of players";
    document.getElementById("court") = "";
}

function searchQueryDB(tx) {
    tx.executeSql("SELECT * FROM TEREN where Ime like ('%" + document.getElementById("court").value + "%')",
        [], querySuccess, errorCB);
}


// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

/*function querySuccess(tx, results) {
    $('#lista').empty();

    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var opcija = document.createElement("li");
        opcija.id = "opcija" + i;
        opcija.value = results.rows.item(i).Ime;
        opcija.innerHTML = results.rows.item(i).Ime;
        var roditelj = document.getElementById("lista");
        roditelj.appendChild(opcija);

        var el = document.getElementById("opcija" + i);
        el.onclick = function () {
            document.getElementById("court").value = this.innerHTML;
            $('#lista').empty();
        }

    }

    
}*/

function querySuccess(tx, results) {
    $('#tabela').empty();
    var roditelj = document.getElementById("tabela");
    //document.getElementById("list-container").style.display = "block";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var opcija = document.createElement("tr");
        opcija.id = "opcija" + i;
        //opcija.value = results.rows.item(i).Ime;
        var td = document.createElement("td");

        td.innerHTML = results.rows.item(i).Ime;
        opcija.appendChild(td);

        roditelj.appendChild(opcija);

        var el = document.getElementById("opcija" + i);
        el.onclick = function () {
            document.getElementById("court").value = this.innerHTML;
            $('#tabela').empty();
            //document.getElementById("list-container").style.display = "none";
        }

    }

    var txt = roditelj.innerHTML;
    document.getElementById("tabela").innerHTML = txt;


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