function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
	
//	alert("Platform: " + device.platform);
	
	window.addEventListener('load', function () {
	    document.addEventListener('deviceready', onDeviceReady(), false);
	}, false);
//    document.addEventListener("deviceready", onDeviceReady, true);
	
    loadData(); // For web browsers. Devices will not be ready, and will do nothing.
    
	/* Load from the store, and create buttons */
	//$('#button_list').append('<li><a href="#">Test</a></li>');
	//$('#button_list').listview('refresh');  // Must be called after editing the list
	
	//var db = window.openDatabase("test", "1.0", "Test DB", 1000000);  // Name, version, display name, size
	//db.transaction(populateDB, errorBC, successCB);
}

//
// PhoneGap is ready
//

function onDeviceReady() {
}

function loadData() {
	// These two lines for resetting the DB
//	var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
//    db.transaction(populateDB, errorCB, loadButtonData);
	// This line restores buttons from saved
	loadButtonData();
}

// Populate the database 
//
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('DROP TABLE IF EXISTS BUTTONS');
    tx.executeSql('CREATE TABLE IF NOT EXISTS BUTTONS (id unique, label, code, xpos, ypos)');
    tx.executeSql('INSERT INTO BUTTONS (id, label, code, xpos, ypos) VALUES (1, "Sample Button", 0, 0, 0)');
}

//Populate the database 
//
function loadCodes(tx) {
    tx.executeSql('SELECT * FROM BUTTONS', [], loadCodesSuccess, errorCB);
}

// Query the success callback
//
function loadCodesSuccess(tx, results) {
    // this will be empty since no rows were inserted.
    //console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
    
    var buttons = [];  // [cols][rows]
    
    for(var rows = 0; rows < 10; rows++){
    	buttons[rows] = [];
    }
    
    // Scrap whatever is in the UI, and reload from database
    for(var i = 0; i < results.rows.length; i++){
    	butt = results.rows.item(i);
    	buttons[butt.xpos][butt.ypos] = butt.label;
    }
    
    for(var row = 0; row < 10; row++){
    	for(var col = 0; col < 2; col++){
    		if(buttons[col][row]){
    			$('#button_grid').append('<div class="ui-block-a"><button type="submit" data-theme="c">' + buttons[col][row] + '</button></div>');
    		} else {
    			$('#button_grid').append('<div class="ui-block-a"></div>');
    		}
    	}
    }
    
    // refresh all buttons
    buts = $('button').button();
}


// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + tx.message);
}

// Transaction success callback
//
function loadButtonData() {
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(loadCodes, errorCB);
}

/*  Old stuff, for reference

var deviceInfo = function() {
    document.getElementById("platform").innerHTML = device.platform;
    document.getElementById("version").innerHTML = device.version;
    document.getElementById("uuid").innerHTML = device.uuid;
    document.getElementById("name").innerHTML = device.name;
    document.getElementById("width").innerHTML = screen.width;
    document.getElementById("height").innerHTML = screen.height;
    document.getElementById("colorDepth").innerHTML = screen.colorDepth;
};

var getLocation = function() {
    var suc = function(p) {
        alert(p.coords.latitude + " " + p.coords.longitude);
    };
    var locFail = function() {
    };
    navigator.geolocation.getCurrentPosition(suc, locFail);
};

var beep = function() {
    navigator.notification.beep(2);
};

var vibrate = function() {
    navigator.notification.vibrate(0);
};

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

var accelerationWatch = null;

function updateAcceleration(a) {
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
}

var toggleAccel = function() {
    if (accelerationWatch !== null) {
        navigator.accelerometer.clearWatch(accelerationWatch);
        updateAcceleration({
            x : "",
            y : "",
            z : ""
        });
        accelerationWatch = null;
    } else {
        var options = {};
        options.frequency = 1000;
        accelerationWatch = navigator.accelerometer.watchAcceleration(
                updateAcceleration, function(ex) {
                    alert("accel fail (" + ex.name + ": " + ex.message + ")");
                }, options);
    }
};

var preventBehavior = function(e) {
    e.preventDefault();
};

function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    console.log(data);
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.top = "10px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = "data:image/jpeg;base64," + data;
}

function fail(msg) {
    alert(msg);
}

function show_pic() {
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 50
    });
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

function contacts_success(contacts) {
    alert(contacts.length
            + ' contacts returned.'
            + (contacts[2] && contacts[2].name ? (' Third contact is ' + contacts[2].name.formatted)
                    : ''));
}

function get_contacts() {
    var obj = new ContactFindOptions();
    obj.filter = "";
    obj.multiple = true;
    navigator.contacts.find(
            [ "displayName", "name" ], contacts_success,
            fail, obj);
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}
*/

