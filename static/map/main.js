
// Declare a Tile layer with an OSM source
var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
// Create a View, set it center and zoom level to Helsinki
var view = new ol.View({
  center: ol.proj.fromLonLat([24.9375, 60.170633]),
  zoom: 4
});
// Instanciate a Map, set the object target to the map DOM id
var map = new ol.Map({
  target: document.getElementById('map'),
});
var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: './layer/kansallispuistot_syke_points_4326.geojson',
    format: new ol.format.GeoJSON()
   })
});

var fill = new ol.style.Fill({
   color: 'rgba(153,204,53,0.6)'
 });
 var stroke = new ol.style.Stroke({
   color: '#cc3399',
   width: 1.25
 });
 vector.setStyle(
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 5
     }),
     fill: fill,
     stroke: stroke
   })
 );

// Add the created layer to the Map
map.addLayer(osmLayer);
// Add vector to map
map.addLayer(vector);

var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -5],
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  if (feature) {
    $(element).popover('dispose');
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      content: feature.get('Nimi'),
    });
    $(element).popover('show');
  } else {
    $(element).popover('dispose');
  }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
  if (e.dragging) {
    $(element).popover('dispose');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});

// Set the view for the map
map.setView(view);
     
