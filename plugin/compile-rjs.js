

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


Plugin.registerSourceHandler("rjs", function(compileStep){
  var 
    contents = compileStep.read().toString('utf8'),
    name = compileStep.inputPath.slice(0);

  name = name.substr(0, name.indexOf(".rjs")).toLowerCase();

  try {
    contents = addName(contents, name);
  } catch (e) {
    return bundle.error(
      source_path + ':' +
      (e.location ? (e.location.first_line + ': ') : ' ') +
      e.message
    );
  }


  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(".rjs", ".js"),
    data: contents,
    sourcePath: compileStep.inputPath
  });
});