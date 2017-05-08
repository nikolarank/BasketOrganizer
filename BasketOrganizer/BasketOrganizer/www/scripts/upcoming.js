

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var db = window.sqlitePlugin.openDatabase({ name: 'nova.db', location: 'default' });
        db.transaction(queryDB, errorCB, querySuccess);

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

// Transaction error callback
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM EVENT', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var len = results.rows.length;
    var txt = '';
    for (var i = 0; i < len; i++) {
        var txt1 = '<div class="container event-container"> <div class="container event-date-container" > <div class="container event-date-red-container"> <p>' + results.rows.item(i).Datum
            + '</p>'
            + '</div> <div class="container event-date-white-container">  <p>' + results.rows.item(i).Vreme + '</p>'
            + '        </div>  </div> <div class="container event-text-container"> <h4 style="color:white;">' + results.rows.item(i).Teren + '</h4> <p style="color:white;">'
            + 'Mesta: ' + results.rows.item(i).Mesta + '</p > </div> </div>';
        txt += txt1;
    }
    document.getElementById("upcoming").innerHTML = txt;
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