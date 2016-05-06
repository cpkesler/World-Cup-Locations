from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .model import SessionMaker, StreamGage
from tethys_gizmos.gizmo_options import MapView, MVLayer, MVView, TextInput


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'my_first_app/home.html', context)

def KMLmap (request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'my_first_app/KMLmap.html', context)

def info (request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'my_first_app/info.html', context)

def map_single(request, id):
    """
    Controller for map page.
    """
    # Create a session
    session = SessionMaker()

    # Query DB for gage objects
    gage = session.query(StreamGage).filter(StreamGage.id==id).one()

    # Transform into GeoJSON format
    gage_feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [gage.longitude, gage.latitude]
      }
    }

    geojson_gages = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326'
        }
      },
      'features': [gage_feature]
    }

    # Define layer for Map View
    geojson_layer = MVLayer(source='GeoJSON',
                            options=geojson_gages,
                            legend_title='Provo Stream Gages',
                            legend_extent=[-111.74, 40.22, -111.67, 40.25])

    # Define initial view for Map View
    view_options = MVView(
        projection='EPSG:4326',
        center=[-111.70, 40.24],
        zoom=13,
        maxZoom=18,
        minZoom=2
    )

    # Configure the map
    map_options = MapView(height='500px',
                          width='100%',
                          layers=[geojson_layer],
                          view=view_options,
                          basemap='OpenStreetMap',
                          legend=True)

    context = {'map_options': map_options,
               'gage_id': id}

    return render(request, 'my_first_app/map.html', context)