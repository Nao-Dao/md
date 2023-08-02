![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690866885492-209d8149-99ca-44c0-a0b6-8fe7d31309d4.gif)

<<<c[脑岛平台（www.naodao.com）自 2022 年 2 月开放以来，平台受到了许多研究者的支持和厚爱。从开放至今，脑岛团队不断开发各类实用的在线研究功能，以提升研究者的在线科研体验。]
&[戳我秒速了解脑岛~](http://mp.weixin.qq.com/s?__biz=Mzk0NzI3MjkyNQ==&mid=2247511639&idx=1&sn=adec04d018e3cadd53a1f39c9d58b03c&chksm=c37b83e5f40c0af3888d4cebbb3206f2fc1e8d8df1625e316149e1d6299e3cfaed5178485c4d&scene=21#wechat_redirect)
本期，**脑岛团队**将面向`jspsych`用户。jspsych是心理学实验在线的重要工具，不过如果要从零开始，理解和掌握代码可能是一个繁琐的过程。而今天，脑岛团队结合`nodejs + vue`这两个优秀的代码解析器和框架，并配合jspsych框架，打造一款通用jspsych简易框架。

在这个框架当中，我们充分的优化了编程体验，大大降低了技术门槛。现在，你们可以更容易、更高效地创建和运行你们的实验。>>>

# 简介

此仓库基于`vue-cli`进行开发，面向广大jspsych实验编程研究者，旨在提高编程体验所设计。

此篇文章内容将会涉及到以下：
- 配置环境
- 使用npm包管理
- 运行实验程序
- 理解vue router应用
- 与脑岛平台进行联动

# 配置环境
首先，当然是安装各类语言、软件啦~

这里我们需要下载两个软件，并安装。他们分别是 [vscode](https://code.visualstudio.com/download) + [nodejs](https://nodejs.org)。
> vscode 是一款轻量级的编辑器，本身不具备代码执行能力，不过有众多大佬的插件，以至于它很强大。
>
> nodejs 是一款基于javascript的解析器，能够让javascript在本地电脑上运行，可谓是前端开发者的最爱。

然后，再从我们的仓库中下载一份代码，因为所配置的环境都在仓库内哦。
[jsPsych template](https://github.com/Nao-Dao/jspsych-template)

在这最后一步，我们仅需要安装一个vscode的插件，就可以了。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872333356-80d1889e-5f2f-42b4-a58c-f0e436878a01.png)

# 使用npm包管理
安装完毕`nodejs`之后，将会提供该软件。

可以在终端输入`npm version`来查看是否安装成功。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872395722-7b1f4cc6-761a-4941-9e3b-6f6de9e00ca7.png)

## 如何使用
不知道有没有发现，从仓库上下载下来的体积很小，这真的能"跑起来"嘛？

当然~不行。我们需要进行安装，只需要运行`npm install`即可。

---
在一杯茶的时间结束之后，安装程序也完成了。然后我们只需要用`npm run dev`就能让程序运行起来。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872409853-0e2bbd5d-b76e-450a-b667-43a686a62045.png)

出现这个界面，就意味着实验顺利运行起来了。不妨打开蓝色的网址看看呢，这里就不做展示了。

> 这个 `8080`的数值也可以修改哦，在根目录下面的`vue.config.js`这个文件当中。

## 安装jspsych插件
jspsych有着众多的插件，可能会让我们眼花缭乱，所以我们建议只选择需要的插件进行安装。

这里我们举一个例子，比如我们要安装`plugin-preload`这个插件，我们需要先到[npm官网](https://www.npmjs.com/)进行检索，找到我们需要的插件。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872420845-15d81f19-1afe-487a-a440-6c9101d397e0.png)

进入之后能够看到明显的安装代码

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872428319-6a124a3b-f5bb-4abd-a45b-ff4e3d3ef66f.png)

`npm i @jspsych/plugin-preload`直接运行这个即可。

然后我们到对应的文件夹下面进行引入
```javascript
import jsPsychPreload from '@jspsych/plugin-preload';

var jspsych_trial_preload = {
	type: jsPsychPreload
}
```
是不是很简单了，不过这还不是亮点哦~

毕竟，如果你在引入的时候，能够自动补全，能节约很多时间。比如~

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872455126-8a3dff72-654b-491a-9829-a9a72c561994.png)

这是其中的一个亮点哦，强大的包管理，让您的目录不在混乱。

至此，包管理部分就到这里了。

# 理解vue router应用
这一部分，我们将介绍如何修改实验程序，并且实现被试间设计。

聪明的你，应该能够发现在`src/views`文件夹下存有两个`vue`文件，这两个就是我们的实验程序，在本次案例中，我们将以`naodao.vue`来讲解。

在此之前，我们先介绍以下vue的路由，也就是router的使用。

## vue router使用
在`scr/router`下方有一个`index.js`文件，这是一个很明显的路由文件，里面只存在一个路由，那就是`/`，也就是当你访问`http://127.0.0.1:8080`的时候，就会渲染该页面的内容。

接下来我们稍做修改
```javascript
const View1 = () => import("../views/link1.vue");
const View2 = () => import("../views/naodao.vue");
const routes = [{
    path: "/",
    component: View1
}, {
    path: "naodao",
    component: View2
}];
```

这样子，我们就有了两个地址，当我们访问`http://127.0.0.1:8080`，渲染的文件是`src/views/link1.vue`。

当我们访问`http://127.0.0.1:8080/naodao`，渲染的文件是`scr/views/naodao.vue`。

这样子构建多个不同版本的实验程序，是不是就很轻松了呢，而且被试加载的时候也不会随着文件数量的增加而增加哦。

## 修改实验程序
接着我们进入到`scr/views/naodao.vue`文件，来尝试修改以下代码。

这里我们需要简单介绍一下所设计jspsych程序采取的思路：
- 先读取配置，配置包含了一些实验的信息以及静态资源的文件名称。
- 然后创建一个`session`实例，用于保存被试的基本信息，防止丢失，也便于后续程序的调用。
- 定义一个`timeline`变量，用于存放jspsych的时间线
	- 时间线的第一个进行静态资源的加载，这里不仅保存`jpg`等常见的，还将加载`public/assets/external_html`下面的文件。
	- 加载完毕后，自动进入实验，实验由一份问卷组成。
	- 最后输入被试的个人信息
- 在实验结束之后，调用`naodao.save()`上传数据。

当我们需要修改程序，一般仅需要修改上方流程中的`问卷`和`被试的个人信息`，对应于文件中的`140`行下方，到`283`行的上方。

比如这里，我们需要呈现一个文本，让被试按键反应。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872483191-3a603655-42e2-41c5-b83b-08dd2173e889.png)

是不是又发现一个亮点，vscode和插件的配合，能够提示所使用插件的属性成员，也就是`jsPsychHtmlKeyboardResponse`插件下面有一个`stimulus`的属性，而这个属性的类型需要是`string`，也就是我们可以采取下面两种形式达到要求。
```javascript
var str;
str = "var"
str = () => {return "var"}
```

## 补充知识
如果我们还是想看插件的源代码怎么办？

不知道有没有发现`node_modules`这个特殊的文件夹呢，当执行`npm install`的命令时，会自动创建一个该文件夹，用`npm`装的包都可以在这个位置找到。

# 与脑岛平台进行联动
这里我们将介绍传数据到脑岛平台的主要原理，以及一些可进行的拓展。

## 代码讲解
```javascript
import Naodao from "@/utils/naodao";

naodao.getData = () => {
  return session.t["getData"]().csv();
};

naodao.save();
```
与脑岛进行交互的核心代码由以上几行组成，这样就完成了数据的自动上传哦。是不是很简单呢。

> 获取数据的部分由实例化的`session`类所存储的临时变量`getData`完成，这里不对此进行介绍。

## 代码传到脑岛
这样子编写好的代码是传不到脑岛平台的哦。

我们需要先进行`npm run build`，执行完毕后根目录下会多一个`dist`文件夹，我们需要压缩这个文件夹，再上传到脑岛平台。

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690872494747-92a51f81-3e4b-4d0d-9b67-16ccbfb04c96.png)

&[jspsych上传到脑岛，可以参考此教程](https://mp.weixin.qq.com/s/vik0H8ewEIwXeJ4bpyUHOw)

## 此外
我们还引入了`electron`，此开源项目能够让jspsych程序运行在一个独立的环境当中，也就是独立的浏览器。我们只需要运行`npm run pack`。然后，会在`release`文件夹下面自动创建对应的执行程序哦。这样子，就再也不用担心被试受到浏览器的限制了。

> 需要先运行`npm run build`，再运行`npm run pack`

怎么样，看到这里你是否感觉到心动呢，赶快来试试吧。我们等你在脑岛平台相见！同样，也欢迎大家在下方留言，分享你们在使用jspsych的心路历程。用你的故事，激发更多人的灵感，一起创造更美好的明天。

y[还在等什么呢？]
y[快来加入脑岛吧！]
y[www.naodao.com]

在这里你将获得：

&[在线实验教程](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzk0NzI3MjkyNQ==&action=getalbum&album_id=2496733486171881473)
&[在线实验科普好文](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=Mzk0NzI3MjkyNQ==&action=getalbum&album_id=2158706799493840898#wechat_redirect)
&[经典心理学实验的有趣介绍](https://mp.weixin.qq.com/s?__biz=Mzk0NzI3MjkyNQ==&mid=2247484301&idx=1&sn=27d56663ebcf7f229969f4858947cbdc&scene=21#wechat_redirect)
&[脑岛科研平台最新消息和福利](http://mp.weixin.qq.com/s?__biz=Mzk0NzI3MjkyNQ==&mid=2247511930&idx=1&sn=17a3080382531aa202cc98c9216bf35a&chksm=c37b82c8f40c0bde1f9ba325e79a39f598e68ce2f3cf4ee934afcec297c3ffa8259399a1c55b&scene=21#wechat_redirect)
<center><strong>以及一切你想知道的更好做科研的法宝！</strong></center>

!s[](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690880642596-b4ce3a26-6a38-407c-a35a-fad38255f55b.gif)

![](http://insula.oss-cn-chengdu.aliyuncs.com/2023/08/01/1690867138895-f22c772a-6571-4a1f-9a6a-eccb47f0e088.jpg)
