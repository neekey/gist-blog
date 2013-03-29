PhoneGap的插件机制为我们提供了自由拓展Native API的可能。但是网络上和PhoneGap插件开发相关的资料较少，本文介绍插件开发的简单过程。

参考资料：

[How to Create a PhoneGap Plugin for Android](http://wiki.phonegap.com/w/page/36753494/How%20to%20Create%20a%20PhoneGap%20Plugin%20for%20Android)

[Migrating your PhoneGap Plugins to Version 1.5+](http://simonmacdonald.blogspot.ca/2012/04/migrating-your-phonegap-plugins-to.html)

##PhoneGap的Plugin原理

###PhoneGap由两部分组件构成：

* PhoneGap JavaScript API将native功能暴露给运行在浏览器中的JavaScript
* 被PhoneGap JavaScript API调用的native code（JAVA）

PhoneGap的这种方式让JavaScript可以调用手机的常用功能。

###局限性

JavaScript在处理一些繁重的任务时，其效率与原生的代码不能比。另外，JavaScript也不能在后台运行，所以我们无法用JavaScript处理后台服务。因此如果我们需要实现一些复杂的商业功能，那么应该尽量使用原生的语言编写。

###解决方案

自然地，解决方案就是扩展暴露更多原生的手机功能给JavaScript，让它能做更多的事情。要实现这点，需要两个关键点：

* 需要一个实现响应功能的原生代码编写的组件
* 需要构造一个JavaScript API

需要注意的是，你需要为每一个你想要实现的系统编写一份独立的原生组件。所有这些原生代码编写的组件都必须与响应的JavaScript API配套。

而这种解决方案也就是PhoneGap提供的插件方式。

