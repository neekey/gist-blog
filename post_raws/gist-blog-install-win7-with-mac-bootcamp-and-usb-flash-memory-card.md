Mac自带的Boot Camp程序，可以非常便利地帮助用户在Mac电脑上同时安装一个Windows系统。针对Macbook Air用户，这里记录下在没有光驱的情况下，使用USB制作启动盘来安装Windows的过程。

### 需要准备的物品：

1、U盘一个（>= 4g)
2、win7镜像文件（.iso)
3、rEFIT.dmg（用于让不支持USB等外设设备启动引导的设备能识别USB设备启动）

### 制作启动盘

打开Bootcamp，先检查一下是否有第一个选项：“创建windows 7安装盘”，如果没有，则本身是你的硬件属于不能原生支持USB等外设引导（比如第一代的air），这里我们需要进行一定的Hack，让Bootcamp认为我们的这个硬件也能支持，Hack方式如下：

在应用程序——实用工具——找到Bootcamp助理，右键——显示包内容——打开Contents文件夹，找到Info.plist文件，里面是一个XML配置文件，找到如下两个字段区域：`<key>DARequiredROMVersions</key>`,`<key>USBBootSupportedModels</key>`，分别在下方的`array`节点中将你自己硬件的`Boot Rom`信息添加到第一行。`Boot Rom`信息可以在：关于本机->系统报告中找到。修改完成后重新打开Boot Camp就有这个选项了。

将三个选项都勾选（1、创建系统盘，2、下载更新，3、安装windows），然后点击下一步，在浏览器选取windows景象文件，下面的盘符中选定要将那个盘作为需要制作的启动盘（注意会将该盘符格式化，自己小心），然后点击下一步，就开始了。

注意到，下载更新这个过程（根据不同的网络状况）会非常漫长，它在下载windows下的驱动程序，以及适用于windows的Boot Camp程序，会自动保存到启动盘的windowsSupport文件夹中，因此这里推荐下载。

待进度条走完以后，会提示为windows设置分区，设置完成后，会进行分区，分区完成后会自动重启。

### 安装windows

重启时按Option键，如果能看到启动盘（你的U盘），那么就点进去，应该就能进行windows的安装过程了，否则选择Mac，我们继续解决启动盘不识别的问题：

重新回到Mac后，安装rEFIT（现在的新版，下过来的DMG文件，里面是mpkg的一键安装），然后cd到`/efit/refit/`目录下，执行`sudo sh enable-aways.sh`。执行完毕后重启，应该不用按option，就会出现rEFIT的菜单了，选择你的U盘即可进行windows的安装了。

