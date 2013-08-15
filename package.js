Package.describe({
  summary: "A very simple implementation of require/define for meteor"
});

Package._transitional_registerBuildPlugin({
  name: "compileRjs",
  use: [],
  sources: [
    'plugin/compile-rjs.js'
  ],
  npmDependencies: {  }
});

Package.on_use(function (api) {
  api.use('underscore', ['client', 'server']);
  api.add_files([
    'lib/require.js',
    "lib/post.js"
    ], ['client', 'server']
  );

  api.export(["require", "define"], ["client", "server"]);
  
});
