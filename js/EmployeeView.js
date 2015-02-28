var EmployeeView = function(employee){

	this.initialize = function(){
		this.el = $('<div/>');
		this.el.on('click', '.add-location-btn', this.addLocation);
		this.el.on('click', '.add-contacts-btn', this.addToContacts);
		this.el.on('click', '.delete-user-btn', this.deleteUser); 
	};

	this.render = function(){
		this.el.html(EmployeeView.template(employee));
		return this; 
	};

	this.addLocation = function(event){
		event.preventDefault();
		console.log('addLocation');
		navigator.geolocation.getCurrentPosition(
			function(position){
				start_decode(position.coords.latitude, position.coords.longitude); 
				//$('.location', this.el).html(position.coords.latitude + ',' + position.coords.longitude);
			},
			function(err){
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}, 

			{
				maximumAge: 50000,
				timeout: 5000,
				enableHighAccuracy: true 
			});
		return false; 
	};

	this.addToContacts = function(event){
		event.preventDefault();
		console.log('addtocontacts');
		if(!navigator.contacts){
			app.showAlert('Contacts API not supported, Error');
			return; 
		}
		var contact = navigator.contacts.create();
		contact.name = {givenName: employee.firstName, familyName: employee.lastName};
		var phoneNumbers = []; 
		phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
		phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true);
		contact.phoneNumbers = phoneNumbers;
		contact.save();
		return false; 
	};

	this.deleteUser = function(event){
		event.preventDefault(); 
		console.log('deleting user');
	}

	this.initialize();

}

/*
	Function list to convert GEO-Coded coords into a human readable address. 
*/

function start_decode(lat, lng){
	var address = new Array();
	var fullAd; 
	Convert_LatLng_To_Address(address, lat,lng); 
	fullAd; 
}

function Convert_LatLng_To_Address(address, lat,lng){
	var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=false";
	jQuery.getJSON(url, function(json){
		Create_Address(address, json);
	});
}

function Create_Address(address, json, callback){
	if (!check_status(json)) // If the json file's status is not ok, then return
        return 0;
        
    address['country'] = google_getCountry(address, json);
    address['province'] = google_getProvince(address, json);
    address['city'] = google_getCity(address, json);
    address['street'] = google_getStreet(address, json);
    address['postal_code'] = google_getPostalCode(address, json);
    address['country_code'] = google_getCountryCode(address, json);
    address['formatted_address'] = google_getAddress(address, json);

    $('.location', this.el).html(address['formatted_address']); 
}

function check_status(json){
	if(json['status'] == "OK") return true; 
	return false; 
}

 function google_getCountry(address, json) {
        return Find_Long_Name_Given_Type("country", json["results"][0]["address_components"], false);
    }
    function google_getProvince(address, json) {
        return Find_Long_Name_Given_Type("administrative_area_level_1", json["results"][0]["address_components"], true);
    }
    function google_getCity(address, json) {
        return Find_Long_Name_Given_Type("locality", json["results"][0]["address_components"], false);
    }
    function google_getStreet(address, json) {
        return Find_Long_Name_Given_Type("street_number", json["results"][0]["address_components"], false) + ' ' + Find_Long_Name_Given_Type("route", json["results"][0]["address_components"], false);
    }
    function google_getPostalCode(address, json) {
        return Find_Long_Name_Given_Type("postal_code", json["results"][0]["address_components"], false);
    }
    function google_getCountryCode(address, json) {
        return Find_Long_Name_Given_Type("country", json["results"][0]["address_components"], true);
    }
    function google_getAddress(address, json) {
        return json["results"][0]["formatted_address"];
    }   


  function Find_Long_Name_Given_Type(t, a, short_name) {
        var key;
        for (key in a ) {
            if ((a[key]["types"]).indexOf(t) != -1) {
                if (short_name) 
                    return a[key]["short_name"];
                return a[key]["long_name"];
            }
        }
    } 

EmployeeView.template = Handlebars.compile($("#employee-tpl").html());