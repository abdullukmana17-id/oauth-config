$routes->group('api', ['filter' => 'cors'], function ($routes) {
    $routes->group('oauth-configs', [
        // 'filter'    => 'session',
        'filter' => 'cors'
    ], static function ($routes) {
        $routes->get('/', "OAuthConfigController::index");
        $routes->put('(:num)', "OAuthConfigController::update/$1");
    });

    $routes->options('(:any)', static function () {});
});
