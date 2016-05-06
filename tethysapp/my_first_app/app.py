from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.stores import PersistentStore


class MyFirstApp(TethysAppBase):
    """
    Tethys app class for My First App.
    """

    name = 'World Cup Finder'
    index = 'my_first_app:home'
    icon = 'my_first_app/images/soccerball.png'
    package = 'my_first_app'
    root_url = 'my-first-app'
    color = '#9b59b6'
    description = 'Find locations of the world cup and sort them by year.'
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='my-first-app',
                           controller='my_first_app.controllers.home'),
                    UrlMap(name='map_single',
                           url='my-first-app/map/{id}',
                           controller='my_first_app.controllers.map_single'),
                    UrlMap(name='KMLmap',
                           url='my-first-app/KMLmap',
                           controller='my_first_app.controllers.KMLmap'),
                    UrlMap(name='info',
                           url='my-first-app/info',
                           controller='my_first_app.controllers.info'),
        )

        return url_maps
