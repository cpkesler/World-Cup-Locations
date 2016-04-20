//This displays the years of the world cups that will display on start up of the map
var applicableYears = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014];
var currentYears = applicableYears;

//Here is our slider bar code with a loop to show and display the icons
function styleFunction(feature) {
    console.log('Checking a feature');
    var year = feature.get('year');
    var years = year.split(', ');
    console.log(currentYears);
    console.log(years);
    var showFeature = false;
    for (var i = 0; i < currentYears.length; i++) {
        console.log('Next feature');
        for (var j = 0; j < years.length; j++) {
            console.log('Current year: ' + currentYears[i]);
            console.log('Feature\'s year: ' + years[j]);
            console.log('Equality: ' + (Number(years[j]) == currentYears[i]).toString());
            if (years[j] == currentYears[i]) {
                showFeature = true;
                j = years.length;
                i = currentYears.length;
            }
        }
    }
    if (showFeature) {
        return new ol.style.Style({
            image: new ol.style.Icon({
                src: '/static/my_first_app/images/soccerball.png',
                scale: 0.1
            })
        });
    } else {
        var fill = new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0)'
        });
        var stroke = new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0)'
        });
        var radius = 0;
        return new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: radius
            }),
            fill: fill,
            stroke: stroke
        });
    }
}

//Here we are declaring the projection object for Web Mercator
var projection = ol.proj.get('EPSG:3857');

//Here we are declaring the raster layer as a separate object to put in the map later
var rasterLayer = new ol.layer.Tile({
    source: new ol.source.MapQuest({layer: 'sat'})
});

//Let's create another layer from a kml file. We'll call it "vector" but it could be called anything
var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
            url: '/static/my_first_app/kml/doc.kml',
            format: new ol.format.KML({
                extractStyles: false
            })
        }),
        style: styleFunction
});

//Declare the map object itself.
var map = new ol.Map({
    target: document.getElementById('map'),

    //Set up the layers that will be loaded in the map
    layers: [rasterLayer,vector],

    //Establish the view area. Note the reprojection from lat long (EPSG:4326) to Web Mercator (EPSG:3857)
    view: new ol.View({
        center: [00000, 000000],
        projection: projection,
        zoom: 2
    })
});

//Here we create the pop ups
var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);

// display popup on click
map.on('click', function(evt) {
  //try to destroy it before doing anything else...s
  $(element).popover('destroy');

  //Try to get a feature at the point of interest
  var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        return feature;
      });

  //if we found a feature then create and show the popup.
  if (feature) {
    var geometry = feature.getGeometry();
    var coord = geometry.getCoordinates();
    popup.setPosition(coord);
    var displaycontent = feature.get('description');
    $(element).popover({
      'placement': 'top',
      'html': true,
      'content': displaycontent
    });

    $(element).popover('show');

  } else {
    $(element).popover('destroy');
  }
});

//change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(element).popover('destroy');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});

//Here we set the styles and inital setting for the slider bar
$(function() {
    $( "#slider-range" ).slider({
    range: true,
    min: 1930,
    max: 2016,
    values: [ 1930, 2016 ],
    change: function( event, ui ) {
    var range = ui.values;
    var lowerYear = range[0];
    var upperYear = range[1];
    var showYears = [];
    for (var i = lowerYear; i <= upperYear; i++) {
        for (var j = 0; j < applicableYears.length; j++) {
            if (i == applicableYears[j]) {
                showYears.push(i);
            }
        }
        currentYears = showYears;
        vector.getSource().changed();
    }
    },
    slide: function( event, ui ) {
        $( "#amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
        });

    $( "#amount" ).val($( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );
        });