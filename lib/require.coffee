(() ->

  #the modules that have already been defined.
  # the object looks like:
  # {
  #   moduleName: result of calling module definition function
  # }
  definedModules = {}

  #the modules whose deps haven't been resolved yet
  #the object looks like
  # {
  #   moduleName: {
  #     deps: array of dependencies
  #     fn: the definition function
  #   }    
  # }
  waitingModules = {}

  #helper fn, tells us whether all deps in the deps array param
  # have been resolved
  allDepsAreReady = (deps) ->
    return !deps.length || _.every(deps, (dep)->
      return _.has(definedModules, dep)
    )

  # take a name, an array of dependencies, and a callback function
  @.define = (name, deps, fn) ->
    if(!_.isString(name))
      throw new Error("name is not a string. perhaps the file extension isn't .rjs?")

    deps = _.map(deps, (dep) -> dep.toLowerCase())

    #if all of the deps are in definedModules, or there's no deps,
    #set definedModules.<name> to the result of calling fn
    if allDepsAreReady(deps)

      definedModules[name] = fn.apply(@, _.map(deps, (dep)->
        return definedModules[dep]
      ))      

      #check if we just made any deps for any waiting mdoules ready.
      _.each(waitingModules, (module, name) ->
        if(allDepsAreReady(module.deps))
          #we did! good job!
          definedModules[name] = module.fn.apply(@, _.map(module.deps,(dep)->
            return definedModules[dep]
          ))

          #clean out the waitingModules
          delete waitingModules[name]
      )
    else
      #not all the deps for this fn are ready.
      waitingModules[name] =
        deps: deps
        fn: fn

  @.require = (name) ->
    definedModules[name]

  #by exposing the waiting modules it's easier to see if any modules have
  #deps that are not getting resolved.
  @.define._waitingModules = waitingModules
  
)()