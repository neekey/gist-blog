本文介绍如何在Mac OSX下手动清理和安装Ruby。献给所有不怎么懂Ruby，但是又时常为Ruby纠结的人。

## 清理

所谓清理的话，其实只要看看Ruby在安装的时候做了什么就好了。好在Ruby自己源码安装的时候很体贴地会把自己干的事情总结出来：

```
installing binary commands:   /usr/local/bin
installing base libraries:    /usr/local/lib
installing arch files:        /usr/local/lib/ruby/1.9.1/x86_64-darwin12.2.0
installing pkgconfig data:    /usr/local/lib/pkgconfig
installing extension objects: /usr/local/lib/ruby/1.9.1/x86_64-darwin12.2.0
installing extension objects: /usr/local/lib/ruby/site_ruby/1.9.1/x86_64-darwin12.2.0
installing extension objects: /usr/local/lib/ruby/vendor_ruby/1.9.1/x86_64-darwin12.2.0
installing extension headers: /usr/local/include/ruby-1.9.1/x86_64-darwin12.2.0
installing extension scripts: /usr/local/lib/ruby/1.9.1
installing extension scripts: /usr/local/lib/ruby/site_ruby/1.9.1
installing extension scripts: /usr/local/lib/ruby/vendor_ruby/1.9.1
installing extension headers: /usr/local/include/ruby-1.9.1/ruby
installing rdoc:              /usr/local/share/ri/1.9.1/system
installing capi-docs:         /usr/local/share/doc/ruby
installing command scripts:   /usr/local/bin
installing library scripts:   /usr/local/lib/ruby/1.9.1
installing common headers:    /usr/local/include/ruby-1.9.1
installing manpages:          /usr/local/share/man/man1
installing default gems:      /usr/local/lib/ruby/gems/1.9.1 (cache, doc, gems, specifications)
                              rake 0.9.2.2
                              rdoc 3.9.4
                              minitest 2.5.1
                              json 1.5.4
                              io-console 0.3
                              bigdecimal 1.1.0
```
可以看到，在默认设置中，Ruby会在下面这些地方安装东西：

  * `/usr/local/lib/ruby`: 里面根据你安装的ruby可能会有多个版本号
  * `/usr/local/lib/pkgconfig`: 貌似是将ruby的信息写进去，具体不清楚，感觉放着也没什么关系
  * `/usr/local/bin`: 可执行文件，最重要的就是`ruby`和`gem`两个文件了
  * `/usr/local/include/ruby-x.x.x`: ruby需要的依赖
  * `/usr/local/share/ri/ruby-x.x.x`: 相关文档
  * `/usr/local/share/doc/ruby`: 相关文档

其他小细节可以根据上面的log输出自己查看，不过基本上删掉上面列出的，应该就差不多了。

* 如果发现伤处了上面的文件后，控制台下还能使用`ruby`或者`gem`命令，那么应该是你的`/usr/bin`层级也安装了`ruby`，把上面路径所有对应向上一层，都删除掉就是了，如: `/usr/lib`, `/usr/lib/ruby`...

## 安装

这里介绍的方法是手动安装，不使用rvm等包管理程序。

在安装ruby之前，先安装一个包[LibYAML](http://pyyaml.org/wiki/LibYAML)，貌似是ruby用来解析YAML文件的依赖，必须在ruby安装前安装好，否则gem无法正常使用.

安装方法：下载[源码](http://pyyaml.org/download/libyaml/yaml-0.1.4.tar.gz.)，解压，cd进去:

```bash
$ ./configure
$ make
# make install
```

下面安装Ruby。首先到[官网](http://www.ruby-lang.org/en/downloads/)下载源码(Compiling Ruby — Source code)，解压，cd进去：

```bash
$ ./configure
$ make
# make install
```

好安装完毕。此时你的gem的默认bindir是全局的`installing default gems:      /usr/local/lib/ruby/gems/1.9.1 (cache, doc, gems, specifications)`，

之前用rvm安装的ruby，由于不大会用，将gem的路径设置到了用户目录。所以才重装~~

## 其他

附赠rvm的删除方法：

```bash
rvm implode
```
这个单词的意思是自爆.