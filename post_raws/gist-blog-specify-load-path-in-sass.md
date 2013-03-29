[SASS](http://http://sass-lang.com/)的`@import`是最常用的功能之一，默认我们可以使用相对，绝对路径来以当前目录为根节点进行文件的查找，但是有时候我们需要引入的文件并不在我们的当前目录下（并且文件位置相差很大，特别是很多需要被多个项目共用的框架等，如compass）。

针对这样的需求，SASS 可以通过指定`--load-path` 来添加一个额外用于查找的路径，可以看官方文档：http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#import

> Sass looks for other Sass files in the current directory, and the Sass file directory under Rack, Rails, or Merb. Additional search directories may be specified using the :load_paths option, or the --load-path option on the command line.

下面举个例子，来说明如何使用:

#### 目录

假设我们的源码目录结构如下：

```
dir/
 | ----- subDir/
 | ----- | ----- test.scss
 | ----- | ----- mod.scss
 | ----- | ----- sibDir
 | ----- | ----- | ----- base.scss
sibDir/
 | ----- base.scss
 | ----- common.scss
```

我们需要编译的入口文件为`/dir/subDir/test.scss`，它除了需要`import`当前目录下的模块外，还需要引入`/sibdir`下的模块。
如果是正常情况下，我们需要在`test.scss`中使用相对路径:

```scss
@import "../../sibDir/common.scss"
```

那么下面我们用`--load-path`来简化引用路径。

### 测试

针对`test.scss`文件进行编译，命令为：

```shell
$ sass test.scss test.css --load-path ~/Dropbox/nodejs/app/sassPathTest/`
```

先把几个文件的内容列一下：

`sibDir/common.scss`:

```scss
body{ color: red; }
```

`sibDir/base.scss`:

```scss
a { color: red; }
```

`dir/subDir/mod.scss`:

```scss
div { color: yellow; }
```

`dir/subDir/sibDir/base.scss`:

```scss
a { color: yellow; }
```

这边的测试文件特地举出了下面几种情景：
  * 当前目录模块: `mod.scss` 
  * 在外层目录的模块：`sibDir/common`
  * 在当前目录中引用地址与外层目录模块一致但是内容不一致模块：`sibDir/base.scss` 和 `dir/subDir/sibDir/base.scss`

OK，下面对几种情况进行测试：

首先，引入了外部模块和内部模块：

`test.scss`：

```scss
@import "sibDir/common";
@import "mod";
```
`test.css`:

```css
body{ color: red; }
div { color: yellow; }
```

达到了我们的目的，下面我们再看看如果单签目录和外部目录中出现同名的模块会发生什么：

我们将`test.scss`修改为：

```scss
@import "sibDir/common";
@import "sibDir/base"
@import "mod";
```

`test.css`:

```css
body{ color: red; }
a { color: yellow }
div { color: yellow; }
```
可以看到，SASS优先引入了当前目录的模块

### 总结

所以SASS的`--load-path`的超找原则基本上是
  * 根据`@import`中给定的路径，先在本地查找
  * 若本地不存在，就在`--load-path`作为`root`进行查找

另外`--load-path`可以多次指定，也就说可以指定多个`Additional search directories`.

题外话：想必[compass](http://compass-style.org/)也就是这么将自己引入进来的。