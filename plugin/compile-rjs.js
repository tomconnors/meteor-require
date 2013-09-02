

var 
  /*
  * add a name to a module if it doesn't already have one.
  */
  addName = function(content, name){
    //parse contents for a `define` function call
    // if the first thing after define is a string, return contents.
    // otherwise, plop a string in there for the module's name
    var named = /define\s*\(\s*"/,
      unnamed = /define\s*\(\s*\[/;

    if(!named.test(content)){
      content = content.replace(unnamed, "define(\"" + name + "\", [");
    }
    return content;
  },

  /*
  * given the path to a module (ie, the module's name)
  * and the (maybe relative) path to a dependency,
  * return the absolute path to the dependency.
  * Note that `absolute` isn't file-system absolute,
  * but application absolute. 
  */
  relativeToAbsolutePath = function(modulePath, depPath){
 
    var
      // the dependency's path, split into an array
      splitPath = depPath.split("/"),
      
      // the absolute dep. path
      absPath,

      // the module's path, without the module's filename.
      moduleLocation = _.initial(modulePath.split("/")).join("/");


    for(var i = 0; i < splitPath.length; i++){

      // check for current dir: './'
      if(splitPath[i] === "."){

        // ./ only does anything if it's the first thing.
        if(i === 0){
          absPath = moduleLocation;       
        }

      // check for up a level: '../'
      } else if (splitPath[i] === ".."){

        absPath = _.initial((absPath || moduleLocation).split("/")).join("/");
      } else {

        //otherwise the item is just a dir/file name.
        absPath = absPath ? absPath + "/" + splitPath[i] : splitPath[i];
      }
    }

    return absPath;
  },

  /*
  * rename all the relative paths for the dependencies of the module to use
  * absolute paths.
  */
  renameRelativePaths = function(content, inputPath){

    var
      
      //a regex to match a call to define for a NAMED module.
      // the second string in the result of exec is a list of the dependancy names. 
      // I'm so sorry about this:   
      regex = /define\s*\(\s*['"][\w\/]*['"]\s*,\s*\[(\s*(['"][\w\/\.]*['"]\s*,?\s*)*)\]/,
      result = regex.exec(content),

      // the dependencies as a string of comma seperated values
      sDeps = (result && result.length ? result[1] : "").trim(),

      // the deps as an array 
      aDeps = sDeps ? _.map(sDeps.split(","), function(sDep){ return sDep.trim().replace(/['"]/g, ""); }) : [],

      // the deps, filtered to get rid of any accidental ones - 
      // if a person accidentally leaves a trailing comma after the last
      // dep in the dep array, this filter stops that from being a problem:
      realDeps = _.filter(aDeps, function(dep){ return !!dep; }),

      // get the absolute path for each dep.
      absolutePathDeps = _.map(realDeps, _.partial(relativeToAbsolutePath, inputPath));

    //replace in the absolute paths.
    return content.replace(regex, "define('" + inputPath + "', [" + 
      _.map(absolutePathDeps, function(dep){ return "'" + dep + "'" }).join(",") + "]");
  };


Plugin.registerSourceHandler("rjs", function(compileStep){
  var 
    contents = compileStep.read().toString('utf8'),
    name = compileStep.inputPath;

  name = name.substr(0, name.indexOf(".rjs")).toLowerCase();
   
  try {
    contents = addName(contents, name);
    contents = renameRelativePaths(contents, name);
  } catch (e) {
    console.log("Error naming module", e);
  }

  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(".rjs", ".js"),
    data: contents,
    sourcePath: compileStep.inputPath
  });
});