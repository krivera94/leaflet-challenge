var myMap = L.map("map").setView([37.0902, -95.7129], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

    function markerSize(magnitude) {
        return magnitude * 20000;
    }

    function depthColor(depth) {
        return depth > 90 ? '#800026' :
               depth > 70 ? '#BD0026' :
               depth > 50 ? '#E31A1C' :
               depth > 30 ? '#FC4E2A' :
               depth > 10 ? '#FD8D3C' :
                            '#FEB24C';
    }

    data.features.forEach(function(feature) {
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: depthColor(feature.geometry.coordinates[2]),
            fillColor: depthColor(feature.geometry.coordinates[2]),
            radius: markerSize(feature.properties.mag)
        }).bindPopup("<h2>" + feature.properties.place + "</h2><hr><h3>Magnitude: " + feature.properties.mag + "</h3><h3>Depth: " + feature.geometry.coordinates[2] + " km</h3>").addTo(myMap);
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depthLevels = [-10, 10, 30, 50, 70, 90],
            labels = [];
        
        div.innerHTML += "<h4>Depth (km)</h4>";
        for (var i = 0; i < depthLevels.length; i++) {
            div.innerHTML += 
            '<i style="background:' + depthColor(depthLevels[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7;"></i> ' +
            depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+<br>');
        }
        return div;
    };
    legend.addTo(myMap);
});