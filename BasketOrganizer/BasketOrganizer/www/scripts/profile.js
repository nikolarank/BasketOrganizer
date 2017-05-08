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

        document.getElementById("first_name").innerHTML = localStorage.first_name;
        document.getElementById("last_name").innerHTML = localStorage.last_name;
        document.getElementById("email").innerHTML = localStorage.email;
        document.getElementById("gender").innerHTML = localStorage.gender;
        
        if (localStorage.hometown !== "undefined") {
            document.getElementById("hometown").innerHTML = localStorage.hometown;
        }
        else {
            document.getElementById("hometown").innerHTML = "";
        }
        if (localStorage.birthday !== "undefined") {
            document.getElementById("birthday").innerHTML = localStorage.birthday;
        }
        else {
            document.getElementById("birthday").innerHTML = "";
        }
        document.getElementById("picture").src = localStorage.picture;
        document.getElementById("cover").style.background = localStorage.cover;

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