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
  
Note that you do have to name modules unless you use the extension `.rjs`. I don't know any way around that right now.

Should you choose to use the .rjs extension, define modules like:

```
define(["dep1"], function(dep1){});
```
You can then access that module by its path, relative to the root of your app,
so if the module I just defined above were located at /client/views/pizza, I could
define a dependant module with:
```
define(["client/views/pizza"], function(pizza){ return !pizza; });
```

Only use `require` after you know a dep is already loaded.
```
var localThingy = require("thingy");
```

todo:
* relative paths
* anonymous modules without rjs extension

That's it. Pull requests + issues encouraged. 
