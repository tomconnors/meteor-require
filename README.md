meteor-require
==============

A very simple implementation of `define` and `require`, so that meteor dependency management sucks less.
Inspired by requirejs.

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

Another advantage of using the .rjs extension is the ability to list a module's dependecies using relative paths:

```
//suppose we're in a file called notPizza.rjs,
// located next to a file called pizza.rjs
define(["./pizza"], function(pizza){return !pizza});
```
The above code will be delivered to the client as:
```
define("client/views/notpizza", ["client/views/pizza"], function(pizza){ return !pizza});
```

You can also use ../

```
define(["../views/pizza"], function(pizza){return !pizza});
```


Only use `require` after you know a dep is already loaded.
```
var localThingy = require("thingy");
```

todo:
* require.json configuration file to allow custom failure timeout and custom file extension

That's it. Pull requests + issues encouraged. 
