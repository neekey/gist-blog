这是Meteor的大坑，希望以后这块能做的更好。

首先，在Meteor中，由于经过了沙箱的封装，无法直接触碰到require, module等全局变量。

且，Meteor会自动执行所有不在`test`，`public`目录下的js文件，因此我们需要使用的npm模块都需要安装到public目录下。

然后使用[meteor-node-module](https://github.com/possibilities/meteor-node-modules)进行模块的加载。

举例，我们现在需要使用`mustache`，那么`cd`到`public`目录下，安装之`npm install mustache`，然后在我们的代码中使用:

```js
var Mustache = NodeModules.require( 'mustache' );
```

来引入模块。

----------

上面没有提到自定义模块。是的，因为meteor根本没有把module等变量暴露出来，因此目前来说模块按照文件分离的话，只能通过全局变量了，比如：

在a.js文件中定义:

```js
Myapp = {};
```

在b.js文件中定义:
```js
Myapp.foo = function(){ ... }
```

在c.js中调用:

```js
Myapp.foo();
```

嗯...感觉回到了以前的前端脚本是么...