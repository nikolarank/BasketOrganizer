document.addEventListener("deviceready", onDeviceReady, false);

var currentRow;
// Populate the database
//
function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id INTEGER PRIMARY KEY AUTOINCREMENT, Datum TEXT, Vreme TEXT, Teren TEXT, Mesta TEXT)');
    //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT, name,number)');
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM EVENT', [], querySuccess, errorCB);
}

function searchQueryDB(tx) {
    tx.executeSql("SELECT * FROM DEMO where name like ('%" + document.getElementById("txtName").value + "%')",
        [], querySuccess, errorCB);
}
// Query the success callback
//
function querySuccess(tx, results) {
    var tblText = '<table id="t01"><tr><th>ID</th> <th>Name</th> <th>Number</th></tr>';
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var tmpArgs = results.rows.item(i).id + ",'" + String(results.rows.item(i).Datum)
            + "','" + String(results.rows.item(i).Vreme) + "'";
        tblText += '<tr onclick="goPopup(' + tmpArgs + ');"><td>' + results.rows.item(i).id + '</td><td>'
            + results.rows.item(i).Datum + '</td><td>' + results.rows.item(i).Vreme + '</td></tr>';
    }
    tblText += "</table>";
    document.getElementById("tblDiv").innerHTML = tblText;
}

//Delete query
function deleteRow(tx) {
    tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(queryDB, errorCB);
}

// Cordova is ready
//
function onDeviceReady() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(populateDB, errorCB, successCB);
}

//Insert query
//
function insertDB(tx) {
    tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' + document.getElementById("txtName").value
        + '","' + document.getElementById("txtNumber").value + '")');
    tx.executeSql('INSERT INTO EVENT (Datum,Vreme, Teren, Mesta) VALUES ("27, jun", "23:50", "Skolsko", "10")');
}

function goInsert() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(insertDB, errorCB, successCB);
}

function goSearch() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(searchQueryDB, errorCB);
}

function goDelete() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(deleteRow, errorCB);
    document.getElementById('qrpopup').style.display = 'none';
}

//Show the popup after tapping a row in table
//
function goPopup(row, rowname, rownum) {
    currentRow = row;
    document.getElementById("qrpopup").style.display = "block";
    document.getElementById("editNameBox").value = rowname;
    document.getElementById("editNumberBox").value = rownum;
}

function editRow(tx) {
    tx.executeSql('UPDATE DEMO SET name ="' + document.getElementById("editNameBox").value +
        '", number= "' + document.getElementById("editNumberBox").value + '" WHERE id = '
        + currentRow, [], queryDB, errorCB);
}
function goEdit() {
    var db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
    db.transaction(editRow, errorCB);
    document.getElementById('qrpopup').style.display = 'none';
}