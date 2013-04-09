meteor-require
==============

The simplest possible implementation of requirejs' `define` and `require` functions, so that meteor dependency management sucks less.

## Why?
I love meteor, but the idea of the execution order of my scripts being dependent upon their file location/names fills me with rage.

## How?
Very simply. There's two functions exposed by this package:
* `define`
* `require`

Use `define` like this:
```
define("moduleName", ["dependency1", "dependency2"], definitionFunction);
```
  
Note that you do have to name dependencies. I don't know any way around that right now.

Only use `require` after you know a dep is already loaded.
```
var localThingy = require("thingy");
```

## But servers?
Don't use this with your server code. For shared code, use this trick, or something like it:
```
(function(root, factory) {
if(typeof define === "undefined") {
  root.newModule = factory(dep1, dep2);
} else {
  define("newModule", ["dep1", "dep2"], factory);
}
})(this, function(dep1, dep2){ });
```
  
That's it. Pull requests + issues encouraged.

