这两天在重构项目中的DPL（DESIGN PARTTEN LIBRARY），说白了就是项目需要的样式库（类似[Bootstrap](http://twitter.github.com/bootstrap/)）.本文结合Bubble的实现来看看如何用[SASS](http://sass-lang.com/)来编写一个相对复杂的组件.

什么是Bubble？如图，现在web上这样的设计还是很多的：

![Bubble](https://f.cloud.github.com/assets/499870/42546/e37506ae-5630-11e2-95f7-976f0acf818d.png)

单单从实现上谈，无非两种，图片和DOM节点模拟：
  * 图片：好处是实现比较简单，但是缺点明显：若要修改箭头的位置/颜色/大小，需要重新作图，后期修改和维护的成本较高
  * DOM节点模拟：实现比较复杂，但是能解决图片方式的所有缺点。

本文介绍DOM节点模拟方式的实现。

### 原理

要实现上图效果的Bubble主要有两点需要思考：
  * 如何实现三角形效果？
  * 如何实现三角形的边框？
  
#### 用DOM实现三角形效果

我们使用任意节点的`border`属性来实现三角形。想象一下，一个`height`和`width`都是0的节点，具有`5px`的`border`，是什么效果？

很明显会是一个宽高为`5px`的正方形。那么如果它的三条边颜色透明，只有一条边有颜色呢？就是一个三角形（为了让效果更明显，给其它三条边设置了蓝色）

![Screen Shot 2013-01-04 at 1 48 33 PM](https://f.cloud.github.com/assets/499870/42559/68fa265a-5632-11e2-86ea-37068a63fae5.png)

##### HACK

如果你深入研究过颜色透明这件事，那么你肯定知道，`IE6`才不知道什么是`transparent`呢，但是在目前的大环境下，我们不得不兼容IE6.

##### 滤镜

我们先看看单单从颜色透明这个点出发，有没有解决方案？好在微软还是给自己留了一手，我们可以使用滤镜`chroma`来实现透明色:

```css
  /* IE6下border颜色透明，chroma滤镜使得某个指定颜色透明，我们随便来个颜色吧 */
  _border-color: tomato;
  _filter: chroma(color=tomato);
```

但是，滤镜这种东西，还是少用为妙，何况经过实验发现，如果两个三角形都用了`chroma`来实现透明，那么它们相互之间会互相遮挡.

##### dashed

还有一个非常巧妙的hack能帮我们实现`border-color`的透明，那就是`border-style: dashed`：在IE6下，当一个节点的宽高都为0时，如果其`border`的`style`为`dashed`，那么这个`border`将不显示出来，和透明的效果一致，因此针对IE6，要实现一个三角形，我们需要如下额外的代码：

```css
border: 5px solid transparent;
_border-style: dashed;

border-bottom-color: blue;
/* 必须将需要显示的border-style该回solid，否则显示不出来咯 */
_border-bottom-style: solid;
```

#### 实现箭头的边框

OK，我们已经知道如何实现一个三角形了。但是我们的三角形没有边框，而且我们已经没有其它属性可以使用了（border-border？ORZ...），那么怎么才能实现边框效果呢？

我们用两个三角形进行重叠来实现边框。这里其实有两种思路：

  * 使用一个外层容器作为箭头的容器，然后在里面放置两个绝对定位的三角形作为箭头
  * 使用一个三角形作为外层容器（大箭头，实际露出来的部分就是边框，另一个三角形放在第一个三角形里面）
  
第一种方式的节点大概是这个样子:

```html
<div class="bubble">I'm a bubble 
  <span class="arrow-top">
    <i class="outer"></i>
    <i class="inner"></i>
  </span>
</div>
```

结构稍微有点复杂，而且需要为两个箭头都设置`class`以区分主次。

第二种方式的节点：

```html
<div class="bubble">I'm a bubble 
  <span class="arrow-top">
    <i></i>
  </span>
</div>
```

第二种方式简单很多，而且由于外层容器和内层容器的唯一性，节省了几个`class`。推荐使用第二种方式.

### 实现

讲完了原理，那么我们开始实现。下面请出们的[SASS](http://sass-lang.com/)。

首先，要用好`SASS`最需要掌握的应该是`@extend`，以帮助我们精简我们的CSS，并且通过`@extend`也改变了我们编写CSS的思维习惯。

首先我们抽象出一些通用的供继承(extend)的类(Class):

```scss
// 变量
// -------------

// 气泡背景色
$defaultBubbleBgColor: #ffffdd;

// 气泡边框颜色
$defaultBubbleBdColor: #ffcc66;

// 气泡箭头边框宽度
$defaultBubbleBdWidth: 1px;

// 气泡箭头高度
$defaultBubbleArrowWidth: 6px;

// Base Bubble Class
// ----------------------------------------------

%bubble-common {
  padding: 5px;
  background-color: $defaultBubbleBgColor;
  border: $defaultBubbleBdWidth solid $defaultBubbleBdColor;
  color: inherit;
  position: relative;

  // HACK 触发Layout fix: IE6下绝对定位子元素绝对位置不正确的问题
  _zoom:1;

  // 让箭头出现在上方
  .arrow-top {
    @extend %arrow-top;
  }

  // 让箭头出现在下方
  .arrow-bottom {
    @extend %arrow-bottom;
  }

  // 让箭头出现在左边
  .arrow-left {
    @extend %arrow-left;
  }

  // 让箭头出现在右边
  .arrow-right {
    @extend %arrow-right;
  }
}

// Base Arrow Class
// ----------------------------------------------

%arrow-common {

  border: $defaultBubbleArrowWidth + $defaultBubbleBdWidth solid transparent;

  // 内层arrow
  i {
    border: $defaultBubbleArrowWidth solid transparent;
  }

  &, & i {
    position: absolute;
    height: 0;
    width: 0;

    // HACK: fix: IE6下宽高不为0
    _line-height: 0;

    // HACK: IE6下需要使用dashed来实现透明，其他style都无法透明而显示黑色
    // 也可以使用滤镜来处理透明，但是会导致内层箭头遮盖外层箭头的问题
    _border-style: dashed;
  }
}
```

我们用*类/继承*的思路去编写SASS。

上面定义了`bubble-common`和`arrow-common`两个基础类，这两个类的样式是所有`bubble`相关的节点共有的，因此应该被复用。

注意到在`bubble-common`中对于四个箭头方向的箭头`arrow-top/arrow-bottom..`又继承了对应的四个方向的箭头类。为什么要这样做呢？

因为所谓的DPL是针对具体业务的，具有一些预设定的默认样式。而由于业务变化，后期肯定会有新的样式出现，所以需要新增样式，考虑下面这些需求：

  > A: 我需要新增一个Bubble，尺寸和默认样式一样，但是希望边框是红色的
  >
  > B: 我需要新增一个Bubble，边框颜色和背景颜色和默认样式一致，但是我希望将箭头宽度增加5像素，让它更突出

上面两个需求的共同点是，都只修改了默认样式的一部分，而希望其他样式和默认样式一致。因此其实我们在考虑一个DPL的扩展性的时候，需要考虑到：

  > 只新建新增的样式，复用旧的样式

说的不是很清楚，看四个箭头基类的定义：

```scss
// Base Arrow Class for top/right/bottom/left
// ----------------------------------------------

// 让箭头出现在上方
%arrow-top {

  @extend %arrow-common;
  
  // 设置箭头具体样式，颜色/位置等的复杂计算
  @include arrowStyle( top, $bgColor: $defaultBubbleBgColor, $bdColor: $defaultBubbleBdColor, $width: $defaultBubbleArrowWidth, $bdWidth: $defaultBubbleBdWidth );

  // 从样式上考虑，箭头的边框颜色总是会和去泡一致
  border-bottom-color: inherit;

  // HACK IE67 fix: inherit无效
  *border-bottom-color: $defaultBubbleBdColor;

  &, & i {

    // HACK IE6需要设置为solid才能显示出border的样色，下面的其他三个方向一致
    _border-bottom-style: solid;
  }
}

// 让箭头出现在下方
%arrow-bottom {
  ...
}

// 让箭头出现在下方
%arrow-left {
  ...
}

// 让箭头出现在下方
%arrow-right {
  ...
}
```

先不管`arrowStyle`这个`mixin`的定义，上面四个方向的箭头都继承自`arrow-common`，并给定了每个方向箭头的公用属性，添加了默认样式。那么，当我们需要添加新的箭头时，只需要继承对应方向的箭头，并添加新增的样式即可。

下面是`arrowStyle`的定义，较复杂，主要表现在自定义属性的可选性以及箭头位置等的计算上:

```scss
// 设置箭头样式
// 建议使用 key-value 的方式传参.
// @param $dir 箭头方向
// @param $bgColor 背景色
// @param $bdColor 边框颜色
// @param $width 箭头宽度
// @param $bdWidth 边框宽度
// -----------------------------------------------------------

@mixin arrowStyle( $dir, $bgColor, $bdColor, $width, $bdWidth ){

  $defaultArrowPosRadio: 1.2;

  $opDir: oppositeDirection($dir);

  // 背景色
  @if $bdColor != null {
    *border-#{$opDir}-color: $bdColor;
  }

  // 设置箭头位置以及外层箭头的宽度
  @if $bdWidth != null and $width != null {

    border-width: $width + $bdWidth;

    @if( $dir == top ){
      top: -($width + $bdWidth) * 2;
      left: $width * $defaultArrowPosRadio;
    }
    @if( $dir == bottom ){
      bottom: -($width + $bdWidth) * 2;
      // IE6 有1px的差别，和bdWidth无关
      _bottom: -($width + $bdWidth) * 2 - 1;
      left: $width * $defaultArrowPosRadio;
    }
    @if( $dir == left ){
      left: -($width + $bdWidth) * 2;
      top: $width * $defaultArrowPosRadio;
    }
    @if( $dir == right ){
      right: -($width + $bdWidth) * 2;
      top: $width * $defaultArrowPosRadio;
    }
  }

  // 内部箭头
  @if $bgColor != null or $bdWidth != null or $width != null {
    i {

      @if $width != null and $bdWidth {

        // 设置箭头宽度
        border-width: $width;

        // 设置位置
        @if( $dir == top ){
          top: - $width + $bdWidth;
          left: - $width;
        }
        @if( $dir == bottom ){
          top: - $width - $bdWidth;
          left: - $width;
        }
        @if( $dir == left ){
          left: - $width + $bdWidth;
          top: - $width;
        }
        @if( $dir == right ){
          left: - $width - $bdWidth;;
          top: - $width;
        }
      }

      // 如果还需要修改背景色
      @if $bgColor != null {
        border-#{$opDir}-color: $bgColor;
      }
    }
  }
}

// 根据给定的方向，返回相反的方向
// @param $dir 箭头方向
// --------------------------------------

@function oppositeDirection( $dir ){

  $oppoDir: null;

  @if ( $dir == bottom ) {
    $oppoDir: top;
  }
  @if ( $dir == top ) {
    $oppoDir: bottom;
  }
  @if ( $dir == left ) {
    $oppoDir: right;
  }
  @if ( $dir == right ) {
    $oppoDir: left;
  }

  @return $oppoDir;
}
```

上面还定义了一个`function`，用来计算反方向（top --> bottom）。

OK，如果只是给出了上面的代码，我们需要新增新的Bubble样式的时候还是有点麻烦（需要自己写一个bubble，然后写四个方向的箭头，然后让他们分别继承四个箭头类....尼玛，为此我们再来定义一个供新增Bubble样式的`mixin`：

```scss
// 自定义Bubble样式，所有参数都可选，只有给定了参数才额外添加，否则继承自 `class/bubble`中定义的类
// 注意：箭头宽度和边框宽度如果给出，需要同时给出（因为计算需要啦）
// 建议使用 key-value 的方式传参.
// @depends class/bubble
// @param $bgColor 背景色
// @param $bdColor 边框颜色
// @param $arrowWidth 箭头宽度
// @param $bdWidth 边框宽度
// -------------------------------------------------------------------

@mixin bubble-style( $bgColor: null, $bdColor: null, $arrowWidth: null, $bdWidth: null ){

  @extend %bubble-common;

  // 默认的位置（箭头宽度的倍数）
  $defaultArrowPosRadio: 1.2;

  @if $bgColor != null {
    background-color: $bgColor;
  }

  @if $bdColor != null {
    border-color: $bdColor;
  }

  @if $bdWidth != null {
    border-width: $bdWidth;
  }

  // 若需要设置箭头样式
  // $bdWidth 和 $arrowWidth 应该是需要同时给出滴
  @if $bgColor != null or $bdWidth != null and $arrowWidth != null {

    // 遍历四个方向的箭头
    @each $dir in top bottom left right {

      .arrow-#{$dir} {
        // 继承对应方向的箭头基类        
        @extend %arrow-#{$dir};

        @include arrowStyle( $dir, $bgColor, $bdColor,  $arrowWidth, $bdWidth );
      }
    }
  }
}
```

这么多行代码之后，实现终于完结了! 我们看看这么多复杂的实现之后，是否得到了一个漂亮的接口（*注意到上面只定义了类，而没有定义实际的样式*吧？如果将上面的代码编译一遍，肯定一行CSS都不给你输出，哈哈):

```scss
@import "class/bubble";
@import "mixin/bubble";

// 灰色气泡背景色
$ocpBubbleBackgrondGray: #f2f2f2;

// 灰色气泡边框颜色
$ocpBubbleBorderGray: #ddd;

// 默认样式
.bubble {
  @extend %bubble-common;
}

// 灰色的Bubble，但是尺寸不变
.bubble-grey{
  @include bubble-style( $bgColor: $ocpBubbleBackgrondGray, $bdColor: $ocpBubbleBorderGray );
}

// Only for test...
// ------------------

// 灰色的Bubble，且边框变为原来的3px...
.bubble-grey-3b {
  @include bubble-style( $bgColor: $ocpBubbleBackgrondGray, $bdColor: $ocpBubbleBorderGray, $arrowWidth: 6px, $bdWidth: 3px );
}

// 颜色为默认，但是边框加粗...
.bubble-3b {
  @include bubble-style( $arrowWidth: 6px, $bdWidth: 5px );
}
```
OK，貌似上面几行代码才是我们要的：

  * 基本样式实现完毕
  * 可以非常方便地拓展
  * 部分新增样式，与默认样式一致的，统统继承.

效果：

![Screen Shot 2013-01-04 at 3 08 32 PM](https://f.cloud.github.com/assets/499870/42639/983b70da-563d-11e2-898f-dc3af886c688.png)

  
### 总结

读完全文，肯定会感叹：
 
  > 这年头写个CSS都这么复杂

我想说，确实复杂了，但是也强大了很多。

如何用好这么强大的功能，自然是仁者见仁智者见智。我并不是说用这么复杂的方式实现的Bubble就一定比纯CSS的好，但是我们确实能看到，随着SASS/LESS/STYLES等动态样式语言的发展，我们编写样式的思路已经在慢慢地发生变化。

本文对于Bubble的实现算是一次对于SASS实践的探索。希望对其他人有些借鉴作用.