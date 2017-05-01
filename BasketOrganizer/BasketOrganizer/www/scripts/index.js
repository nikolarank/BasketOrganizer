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
        db.transaction(populateDB, errorCB, successCB);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("27, jun", "23:50", "Skolsko", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("28, jun", "23:50", "Skolsko", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("29, jun", "23:50", "Skolsko", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("30, jun", "23:50", "Skolsko", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("01, avgust", "23:50", "Skolsko", "10")');
        }, errorCB, successCB);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

document.getElementById("signin").onclick = function () {
    location.href = "UpComingEventsPage.html";
}

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id INTEGER PRIMARY KEY AUTOINCREMENT, Datum TEXT, Vreme TEXT, Teren TEXT, Mesta TEXT)');
    //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    alert("Successful processing SQL: ");
}