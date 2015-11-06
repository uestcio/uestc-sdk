<!-- ![UESTC Logo]() -->

# UESTC SDK / 电子科技大学开发工具包

  A concise, reliable and powerful SDK platform for UESTC.

  简洁、可靠且功能强大的 [UESTC](http://portal.uestc.edu.cn) 集成 SDK 平台。


  [![NPM Version][npm-image]][npm-url]
  [![Node Version][node-version]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

```js
var sdk = require('uestc');
var app = sdk.single();
var user = app.identify('2012019050031', '12345678');

app.searchForPeople('章萌芊', function (people) {
  console.log('全电子科大叫章萌芊的共有' + people.length + '人，分别是：');
  for(var i in people) {
    person = people[i];
    console.log('身份：' + person.metier + '，学院：' + person.deptName + '，学号：' + person.id);
  }
});
// 很遗憾的告诉你真的没有这个人...

user.getCourses(3, 2, function (courses) {
  console.log('上学期的成绩如下：');
  for(var i in courses) {
    var course = courses[i];
    console.log('课程: ' + course.name + '，成绩: ' + course.score + '，学分: ' + course.credit);
  }
});

user.on('consumption', function (err, consumption) {
  console.log('饭卡于' + consumption.time + '在' + consumption.place + '消费了' + consumption.cost + '元');
});
```

## Installation / 安装

Install via Npm / 通过 Npm 安装 ：

```bash
$ npm install uestc
```

Install \& save to dependency / 安装并将项目添加到依赖库中：

```bash
$ npm install uestc --save
```

Install \& save to devDependency / 安装并将项目添加到开发依赖库中：

```bash
$ npm install uestc --save-dev
```

## Features / 特性

已有功能：

  * 用户登陆认证
  * 学校的课程信息条件查询
  * 学校的人员信息关键字查询
  * 用户学籍信息获取
  * 用户课程成绩信息获取
  * 用户课程表信息获取
  * 用户考试信息获取
  * 考试安排、学科成绩事件推送
  * 数据缓存，支持离线访问


预计增加功能：

  * 教务处公告获取（不急，辅导员和班委会塞给你的）
  * 一卡通消费信息查询（不急，有喜付了）
  * 图书馆图书信息查询（不急，有官方APP）
  * 一卡通消费、教务处通知事件推送（见上面）
  * 教务系统自动评教（现在拿不到接口）
  * 选课系统退补选时自动实时抢课（现在拿不到接口）

## Docs / 文档

  * Documentation / 官方文档： [GitHub Wiki](https://github.com/trotyl/UESTC-sdk-Npm/wiki)
  * Source Code / 源代码： [GitHub Repo](https://github.com/trotyl/UESTC-sdk-Npm)
  * Npm Package / Npm 包： [Npm Package Site](https://www.npmjs.com/package/uestc)

## Quick Start / 快速入门

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-sdk-Npm/wiki) 。

## Philosophy / 设计理念

> A Project for the sake of all Project.

  由于在日常的学习生活中有大量的项目（比如通信学院的 P2P）等都需要用到学校的一些网站（尤其是教务系统），
  以及一些平台也往往需要验证用户的电子科技大学学生身份等。

  而绝大多数人都是直接开始从零造车子，目前还没有见到任何组织或个人有造轮子的计划，效率及其低下。
  虽然也有部分同学开源的一些相关项目（如教务系统爬虫等，可以在 GitHub 中搜索 `uestc` ），
  但大都功能单一，且都为独立项目不利于重复利用。

  从而构想出将学校网站所有功能抽离成独立 SDK 的理念，对外提供友好的 API ，将其与项目的业务逻辑相分离，从而高效化项目开发过程，
  专心于业务逻辑本身，也能够让项目更利于维护和扩展。

  初版 SDK 仅进行了 NodeJS 版本的开发，后续根据需求及现实情况可能继续开发 Ruby、Python、Java、C# 版本，
  仍然会按照现有的文档设计接口（其他语言可能大多采用同步函数接口，JS 版采用异步函数接口主要基于语言本身的原因），
  如果有意愿共同开发其他语言版本的可以联系作者。

  项目会随着官方接口的变更而（不一定及时的）更新，如果遇到了不正常运行的情况可以在 Issue 中提出或直接请求 Pull Request ，
  如果有任何功能或其他方面的意见或建议也欢迎提出。

  如果有对项目本身的实现，或项目架构以及测试方法感兴趣的同学，也欢迎联系。

## Prospect / 用途

  * 作为第三方登陆支持库，以验证电子科大学生身份。
  * 作为微信服务器支持库，可以快速查询相关信息并实现推送。
  * 作为移动端服务器支持库，可以快速打造掌上校园等校园客户端。
  * 作为参考代码，了解学校各个接口的相关细节信息（项目开源，可随意使用）。
  * 作为参考代码，学习 NodeJS 项目的开发（水平有限，还怕误导）。

## Examples / 示例

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-sdk-Npm/wiki) 。

## Tests / 测试

  如果需要运行测试，首先需要安装相应的依赖项，然后运行测试命令：

  Unit tests / 单元测试：

```bash
$ npm install
$ npm test
```

  Coverage / 代码覆盖率测试：

```bash
$ npm install
$ npm run test-ci
```

## Developer / 开发人员

本项目目前由 [Trotyl Yu](https://github.com/trotyl) 独立开发。

[贡献者清单](https://github.com/trotyl/uestc-sdk-npm/graphs/contributors)

## License / 许可协议

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/uestc.svg
[npm-url]: https://npmjs.org/package/uestc
[node-version]: https://img.shields.io/node/v/uestc.svg
[downloads-image]: https://img.shields.io/npm/dm/uestc.svg
[downloads-url]: https://npmjs.org/package/uestc
[appveyor-image]: https://img.shields.io/appveyor/ci/trotyl/UESTC-SDK-NPM/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/trotyl/UESTC-SDK-NPM
[travis-image]: https://img.shields.io/travis/uestcio/uestc-sdk/master.svg?label=linux
[travis-url]: https://travis-ci.org/uestcio/uestc-sdk
[coveralls-image]: https://img.shields.io/coveralls/trotyl/UESTC-SDK-Npm.svg
[coveralls-url]: https://coveralls.io/r/trotyl/UESTC-SDK-Npm
