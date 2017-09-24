'use strict';

(function(window, document, undefined) {

// Google Map API
	  function initMap() {
	    var center = {lat:  49.839683, lng: 24.029717};

	    var map = new google.maps.Map(document.getElementById('map'), {
	      zoom: 18,
	      center: center
	    });

	    var marker = new google.maps.Marker({
	      position: center,
	      map: map,
	    });
  }
  google.maps.event.addDomListener(window, 'load', initMap);
    


})(window, document);