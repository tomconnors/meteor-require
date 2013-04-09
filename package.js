Package.describe({
  summary: "A very simple implementation of require/define for client-side meteor scripts"
});

Package.on_use(function (api) {
  api.use('underscore', 'client');
  api.use('coffeescript', 'client');
  api.add_files([
    'lib/require.coffee'
  ], 'client'
  );
});