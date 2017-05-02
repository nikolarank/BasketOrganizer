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

        document.getElementById("court").onkeyup = function () {
            db.transaction(searchQueryDB, errorCB, querySuccess);
        }

        document.getElementById("Insert").onclick = function () {
            var Datum = document.getElementById("date").value;
            if (Datum != null)
                db.transaction(insertDB, errorCB, successCB);
            else {

            }
        }

        var div = document.getElementById("map_canvas");

        db.transaction(searchQueryDB, errorCB, querySuccess);

        var GOOGLE = { "lat": 43.19, "lng" : 21.54}; 
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
                data.forEach(function (markerOptions) {
                    map.addMarker(markerOptions, onMarkerAdded);
                });
            }

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
    var Datum = document.getElementById("date").value;
    var Vreme = document.getElementById("time").value;
    var Igraca = document.getElementById("noplayers").value;
    var Teren = document.getElementById("court").value;

    if (Datum != null && Vreme != null && Igraca != null && Teren != null) {
        tx.executeSql('INSERT INTO EVENT (Datum, Vreme, Teren, Mesta) VALUES ("' + Datum
            + '","' + Vreme + '","' + Teren + '","' + Igraca + '")');
    }
}

function successCB() {
    alert("Successfully created event");
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    document.getElementById("noplayers") = "";
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
    document.getElementById("list-container").style.display = "block";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var opcija = document.createElement("tr");
        opcija.id = "opcija" + i;
        opcija.value = results.rows.item(i).Ime;
        opcija.innerHTML = "<td>"+results.rows.item(i).Ime+"</td>";
        var roditelj = document.getElementById("tabela");
        roditelj.appendChild(opcija);

        var el = document.getElementById("opcija" + i);
        el.onclick = function () {
            document.getElementById("court").value = this.innerHTML;
            $('#tabela').empty();
            document.getElementById("list-container").style.display = "none";
        }

    }


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