document.addEventListener("DOMContentLoaded", function(event) {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYXNodHJvbiIsImEiOiJjaWx0NHljZTEwMDdxdmdrc3luYjZ6YWh2In0.g0MdhB8nPflfyG9BUyc3Fw';

  var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([39.8106, -98.5561], 4);

  var geocoderControl = L.mapbox.geocoderControl('mapbox.places');
  geocoderControl.addTo(map);

  var layers = []

  var createLayer = function(data, name) {
    layers.push(L.mapbox.featureLayer().addTo(map));
    var currentLayer = layers.slice(-1)[0];
    currentLayer.setGeoJSON(data);

    currentLayer.on('mouseover', function(e) {
        e.layer.openPopup();
    });

    currentLayer.on('mouseout', function(e) {
        e.layer.closePopup();
    });
  }

  createLayer(cities, 'city');
  createLayer(nps, 'park');

  var miles = 1609.34;
  var money = 50;
  var mpg = 25;
  var gasPrice = 2;
  var radius = (money/gasPrice) * mpg * miles;

  var filterCircle;

  var generateFilterCircle = function(coordinates, radius) {
    filterCircle = L.circle(L.latLng(coordinates), radius, {
        opacity: 1,
        weight: 1,
        fillOpacity: 0.4
    }).addTo(map);
  }

  generateFilterCircle([0, 0], 0);

  geocoderControl.on('select', function(res) {
    var coordinates = res.feature.geometry.coordinates;
    temp = coordinates[0];
    coordinates[0] = coordinates[1];
    coordinates[1] = temp;

    filterCircle.setLatLng(coordinates);
    filterCircle.setRadius(radius);

    map.fitBounds(filterCircle.getBounds());
  });

  $('#money').on('input', function(e) {
    money = e.target.value;
    radius = (money/gasPrice) * mpg * miles;
    filterCircle.setRadius(radius);
  });

  $('#mpg').on('input', function(e) {
    mpg = e.target.value;
    radius = (money/gasPrice) * mpg * miles;
    filterCircle.setRadius(radius);
  });
});
