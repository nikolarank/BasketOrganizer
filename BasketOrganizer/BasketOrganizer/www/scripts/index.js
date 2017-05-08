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
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("27-05-2017", "14:50", "Skolsko", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("28-05-2017", "12:00", "Autobuska", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("29-05-2017", "15:30", "Bulevar", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("30-05-2017", "19:50", "Suvi Do", "10")');
            tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("01-08-2017", "18:20", "Treci", "10")');
        }, errorCB, successCB);

        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Skolsko", "43.310844", "21.881078", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Cair", "44.315189", "21.907347", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Bulevar", "43.320120", "21.918335", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Suvi Do", "43.296110", "21.966704", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Autobuska", "43.326574", "21.891228", "")');

            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Prvi", "43.16", "21.85", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Drugi", "44.16", "22.85", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Treci", "43.10", "21.40", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Cetvrti", "45.26", "22.18", "")');
            tx.executeSql('INSERT INTO TEREN (Ime, Lat, Lon, Slika) VALUES ("Peti", "41.16", "25.85", "")');
            
        }, errorCB, successCB);

        document.getElementById("signinface").onclick = function () {
            CordovaFacebook.login({
                permissions: ['email', 'user_likes'],
                onSuccess: function (result) {
                    if (result.declined.length > 0) {
                        alert("The User declined something!");
                    }
                    
                    CordovaFacebook.graphRequest({
                        path: '/me',
                        params: { fields: 'email,id,first_name,last_name,gender,link,name,birthday,picture.type(large),cover,hometown' },
                        onSuccess: function (userData) {
                            localStorage.setItem("email", userData.email);
                            localStorage.setItem("id", userData.id);
                            localStorage.setItem("first_name", userData.first_name);
                            localStorage.setItem("last_name", userData.last_name);
                            localStorage.setItem("gender", userData.gender);
                            localStorage.setItem("name", userData.name);
                            localStorage.setItem("birthday", userData.birthday);
                            localStorage.setItem("picture", userData.picture.data.url);
                            localStorage.setItem("cover", userData.cover.source);
                            localStorage.setItem("hometown", userData.hometown);
                            location.href = "UpComingEventsPage.html";
                        },
                        onFailure: function (result) {
                            if (result.error) {
                                Error.log('error', 'There was an error in graph request:' + result.errorLocalized);
                            }
                        }
                    });

                  
                },
                onFailure: function (result) {
                    if (result.cancelled) {
                        alert("The user doesn't like my app");
                    } else if (result.error) {
                        alert("There was an error:" + result.errorLocalized);
                    }
                }
            });

        }

        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.font = "30px Arial";
        ctx.fillText("Basket", 55, 65);
        ctx.fillText("Organizer", 34.5, 90);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

//document.getElementById("signin").onclick = function () {
//    location.href = "UpComingEventsPage.html";
//}

function populateDB(tx) {


    tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id INTEGER PRIMARY KEY AUTOINCREMENT, Datum TEXT, Vreme TEXT, Teren TEXT, Mesta TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS TEREN (id INTEGER PRIMARY KEY AUTOINCREMENT, Ime TEXT, Lat TEXT, Lon TEXT, Slika TEXT)');


}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    //alert("Successful processing SQL: ");
}