捕捉浏览器中的JS运行时错误，主要通过监听window.onerror来实现。但是对于不同的脚本执行方式以及不同的浏览器，能捕获到的信息会有区别。

window.onerror 讲接收3个参数：

  * `msg`：错误描述，比如：a is not defined
  * `url`：出错脚本所在的url
  * `lineNumber`：出错脚本的行数

本文将对不同浏览器和不同的脚本执行方式进行测试，并总结这些区别。

首先对于脚本的执行主要有下面几种：

  * 页面内嵌的`<script>`，需要执行的代码在`<script>`标签内
  * 使用`<script src="external.js">`的方式引入外部脚本，脚本为同域地址
  * 使用`<script src="external.js">`的方式引入外部脚本，脚本为不同域地址
  * 使用`<script src="external.js">`的方式引入外部脚本，脚本为本地地址
  * 使用eval方法来执行脚本
  * 动态地创建内嵌的`<script>`并设置其innerHTML为需要执行的代码

下面列一下各浏览器对与上面集中脚本执行的捕获情况（Markdown对于table的支持不是很好，我是直接在页面上copy HTML进来的，维护可以看下 https://www.evernote.com/shard/s43/sh/a36fc90e-9f72-43b5-8710-1476340d14ac/1160f515582d297f22f495924ba10d3d )

## Chrome (23.0.1271.101)

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（""）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（""）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from code）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from its code）</span><br></td>
</tr>
</tbody>
</table>

### Firefox (16.0.2)

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（file that call this eval）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page））</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top"><span style="text-align: -webkit-center; background-color: rgb(255, 255, 255);"><font face="Arial, Helvetica, sans-serif">✓（position that calls&nbsp;this&nbsp;eval）</font></span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from its code）</span><br></td>
</tr>
</tbody>
</table>

### Safari (6.0.2 (8536.26.17))

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（undefined）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="text-align: -webkit-center; background-color: rgb(255, 255, 255);"><font face="Arial, Helvetica, sans-serif">✓（from code）</font></span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from its code）</span><br></td>
</tr>
</tbody>
</table>

### Opera (12.11)

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（only Script error）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（""）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（""）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✗（0）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from code）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from its code）</span><br></td>
</tr>
</tbody>
</table>

### IE9

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（file path that call this eval）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（position that calls&nbsp;this&nbsp;eval）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from its code）</span><br></td>
</tr>
</tbody>
</table>

### IE8

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script（not available）</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（file path that call this eval）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（position that calls&nbsp;this&nbsp;eval）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
</tbody>
</table>

### IE7

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script（not available）</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（file path that call this eval）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（position that calls&nbsp;this&nbsp;eval）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
</tbody>
</table>

### IE6

<table border="1" width="100%" cellspacing="0" cellpadding="2">
<tbody>
<tr>
<td valign="top"><br></td>
<td valign="top">page script</td>
<td valign="top">external script ( same origin )</td>
<td valign="top">external script ( cross domain )</td>
<td valign="top">external script ( local )</td>
<td valign="top">eval</td>
<td valign="top">dynamic page script（not available）</td>
</tr>
<tr>
<td valign="top">msg</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">url</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（current page）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
<tr>
<td valign="top">lineNumber</td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（from current page）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（line number start from 1）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（line number start from 1）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（line number start from 1）</span><br></td>
<td valign="top"><span style="font-family: Arial, Helvetica, sans-serif; text-align: -webkit-center; background-color: rgb(255, 255, 255);">✓（position that calls&nbsp;this&nbsp;eval，line number start from 1）</span><br></td>
<td valign="top" style="text-align: -webkit-center;"><font face="Arial, Helvetica, sans-serif">-</font></td>
</tr>
</tbody>
</table>
