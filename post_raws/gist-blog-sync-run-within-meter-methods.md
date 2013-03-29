相关issue: https://github.com/meteor/meteor/issues/74#issuecomment-14659538

方法是使用[fiber](https://github.com/laverdet/node-fibers)模块来实现同步阻塞。

首先先利用该模块封装一个同步执行方法：

```js
syncRun = function(func) {
    var Fiber = NodeModules.require( 'fibers' );
    var fiber = Fiber.current;
    var result, error;

    var args = Array.prototype.slice.call(arguments, 1);

    func.apply(undefined, [cb].concat(args));
    Fiber.yield();
    if (error) throw new Meteor.Error(500, error.code, error.toString());
    return result;

    function cb(err, res) {
        error = err;
        result = res;
        fiber.run();
    }
};
```

直接看下使用举例：

```js
Meteor.methods({
  foo: function(){
    this.unblock();
    var myTask = function( done, num ){
      setTimeout(function(){
        done( null, num);  
      }, num );
    }
    
    return syncRun( myTask, 1000 );
  }
})
```