var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  minZoom: 3,
  id: "light-v10",
  accessToken: API_KEY
}).addTo(myMap);


// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl, function(data) {

    function styleInfo(feature) {
        return {
            opacity: .95,
            fillOpacity: .95,
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: chooseRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };  

    function chooseColor(depth) {
      // Earthquakes with greater depth should appear darker in color.
      // The depth of the earth can be found as the third coordinate for each earthquake.
      switch (true) {
        case depth <= 10:
            return '#d0d1e6';
        case depth <= 30:
            return '#a6bddb';
        case depth <= 50:
            return '#67a9cf';
        case depth <= 70:
            return '#3690c0';
        case depth <= 90:
            return '#02818a';
        default:
            return '#016450';
        }
    };

    function chooseRadius(mag) {
        //Earthquakes with higher magnitudes should appear larger
        return mag * 5;
    };
    
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
        },

        style: styleInfo,

        onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3> Location: " + feature.properties.place 
        + "</h3><hr> Magnitude: " + feature.properties.mag 
        + "<hr>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "legend");
      var grades = [-10, 10, 30, 50, 70, 90];
      var labels = [];

      function getColor(d) {
        return d > 90 ? '#016450' :
               d > 70 ? '#02818a' :
               d > 50 ? '#3690c0' :
               d > 30 ? '#67a9cf' :
               d > 10 ? '#a6bddb' :
               '#d0d1e6' ;
                          
        }

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<hr>' : '+');
        }

            return div;

    };

    legend.addTo(myMap)
  
});