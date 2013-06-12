Package.describe({
  summary: "A very simple implementation of require/define for meteor"
});

var handle = function(bundle, source_path, serve_path, where) {
  var fs = Npm.require('fs');
  var path = Npm.require('path');
  serve_path = serve_path + '.js';

  var contents = fs.readFileSync(source_path);

  var name = serve_path;

  //remove the initial slash
  name = name.slice(1);

  //remove the extension
  name = name.substr(0, name.indexOf(".rjs"));



  try {
    contents = addName(contents.toString('utf8'), name);
  } catch (e) {
    return bundle.error(
      source_path + ':' +
      (e.location ? (e.location.first_line + ': ') : ' ') +
      e.message
    );
  }

  contents = new Buffer(contents);
  bundle.add_resource({
    type: "js",
    path: serve_path,
    data: contents,
    where: where
  });
};

var addName = function(content, name){
  //parse contents for a `define` function call
  // if the first thing after define is a string, return contents.
  // otherwise, plop a string in there for the module's name
  var named = /define\s*\(\s*"/,
    unnamed = /define\s*\(\s*\[/;

  if(!named.test(content)){
    content = content.replace(unnamed, "define(\"" + name + "\", [");
  }
  return content;
}

Package.register_extension("rjs", handle);

Package.on_use(function (api) {
  api.use('underscore', ['client', 'server']);
  api.use('coffeescript', ['client', 'server']);
  api.add_files([
    'lib/require.coffee'
  ], ['client', 'server']
  );
});
