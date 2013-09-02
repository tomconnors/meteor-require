(function() {
  "use strict";

  var 
    // the modules that have already been defined.
    //  the object looks like:
    //  {
    //    moduleName: result of calling module definition function
    //  }
    definedModules = {},


    // the modules whose deps haven't been resolved yet
    // the object looks like
    //  {
    //    moduleName: {
    //      deps: array of dependencies
    //      fn: the definition function
    //    }    
    //  }
    waitingModules = {},

    wasLoadTimeoutSet = false,

    //helper fn, tells us whether all deps in the deps array param
    // have been resolved
    allDepsAreReady = function(deps) {
      return !deps.length || _.every(deps, function(dep) {
        return _.has(definedModules, dep);
      });
    },

    /**
    * check a single module to see whether it is ready to be resolved
    */
    checkOne = function(module, name, list){
      if ( allDepsAreReady(module.deps) ) {

        definedModules[name] = module.fn.apply(null, _.map(module.deps, function(dep) {
          return definedModules[dep];
        }));

        delete waitingModules[name];

        checkList(list, name);

        return true;
      }

      return false;
    },

    /**
    * check a list of modules to see whether any are ready to be resolved.
    */
    checkList = function(waiting, stop) {
      if(_.isString(stop)) {

        _.any(waiting, function(module, name, list) {
          if (name === stop) {
            return true;
          }

          checkOne(module, name, list);
        });

      } else {
        _.each(waiting, checkOne);
      }
    },

    /**
    * set timeout to handle load failure
    */
    setLoadTimeout = function() {
      // TODO: allow the timeout to be set in an external config file
      Meteor.setTimeout(function(){
        if (!_.isEmpty(waitingModules)) {
          throw new Error("Failed to resolve modules: " + _.keys(waitingModules));
        }
      }, 500);
      wasLoadTimeoutSet = true;
    };
    
  this.define = function(name, deps, fn) {
    if (!_.isString(name)) {
      throw new Error("name is not a string. perhaps the file extension isn't .rjs?");
    }
    if (!wasLoadTimeoutSet) {
      setLoadTimeout();
    }
    name = name.toLowerCase();
    deps = _.map(deps, function(dep) {
      return dep.toLowerCase();
    });

    if(!checkOne( {deps:deps, fn:fn}, name, waitingModules)){
      waitingModules[name] = {
        deps: deps,
        fn: fn
      };
    }
  };

  this.require = function(name) {
    return definedModules[name.toLowerCase()];
  };

  // useful for quickly checking for unresolved modules
  this.define._waitingModules = waitingModules;

}).call(this);
