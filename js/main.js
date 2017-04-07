/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


  /* ===================== */

var dataset = "https://raw.githubusercontent.com/CPLN692-MUSA611/datasets/master/geojson/philadelphia-garbage-collection-boundaries.geojson";

var featureGroup; // to be used later to add features on the map

var myStyle = function(feature) {
  switch (feature.properties.COLLDAY) {
    case "MON": return {color: "#b35806"};
    case "TUE": return {color: "#f1a340"};
    case "WED": return {color: "#fee0b6"};
    case "THU": return {color: "#d8daeb"};
    case "FRI": return {color: "#998ec3"};
  }
  return {};
};


var showResults = function() {
  /* =====================
  $(element).hide() will add the CSS "display: none" to the element, effectively removing it
  from the page. $(element).show() removes "display: none" from an element, returning it to the page.
  ===================== */
  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};


var returnDOWNameFnx = function(dayOfWeek) {
  switch (dayOfWeek) {
    case "MON": return "Monday";
    case "TUE": return "Tuesday";
    case "WED": return "Wednesday";
    case "THU": return "Thursday";
    case "FRI": return "Friday";
  }
  return {};
};

var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    var collectionDay = layer.feature.properties.COLLDAY;
    $('.day-of-week').text(returnDOWNameFnx(collectionDay));
    /* =====================
    The following code will run every time a layer on the map is clicked.
    ===================== */
    showResults();
  });
};



var myFilter = function(feature) {
  if (feature.properties.COLLDAY === " "){
    return false;
  }
  else {
    return true;
  }
};

var tempdata;

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    tempdata = parsedData;
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    // quite similar to _.each
    // leaflet function, good for when your layer is part of a larger group;
    // listening for an event = similar to click in jQuery
    // any instance of a feature group is also of a layer group (i.e. the same way that dog is part of the feature of animals)
    // remove by internal leaflet ID; you can also get the layer ID by feeding it the layer, etc.,)
    // you can remove an object from the featurelayer and it will automatically be removed from the map!
    // (because you are adding the entire feature layer, with or without anything that is included)
    featureGroup.eachLayer(eachFeatureFunction);
  });
});
