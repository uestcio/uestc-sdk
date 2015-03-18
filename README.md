<!-- ![UESTC Logo]() -->

# UESTC SDK

  简洁、可靠且功能强大的 [UESTC](http://portal.uestc.edu.cn) 集成 API 工具。

  （项目目前还在开发中，部分功能尚未完成）

  [![NPM Version][npm-image]][npm-url]
  [![Node Version][node-version]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

```js
var sdk = require('uestc');
var app = sdk();
var user = app.login('2012019050031', '12345678');

app.searchForPeople('章萌芊').then(function (people) {
  console.log('全电子科大叫章萌芊的共有' + people.length + '人，分别是：');
  for(var i in people) {
    person = people[i];
    console.log('身份：' + person.metier + '，学院：' + person.deptName + '，学号：' + person.id);
  }
});

user.getCourses(3, 2).then(function (courses) {
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

通过 Npm 安装：

```bash
$ npm install uestc
```

安装并将项目添加到依赖库中：

```bash
$ npm install uestc --save
```

安装并将项目添加到开发依赖库中：

```bash
$ npm install uestc --save-dev
```

## Features / 特性

  * 用户模拟登陆
  * 学校的课程信息条件查询
  * 用户课程成绩信息获取
  * 用户学籍信息获取
  * 学校的人员的信息查询
  * 用户考试信息获取（待实现）
  * 教务处公告获取（待实现）
  * 课程表信息获取（待实现）
  * 数据信息缓存，支持离线访问
  * 根据配置自动完成统一评教（待实现）
  * 一卡通消费信息查询（待实现）
  * 考试安排、学科成绩、饭卡消费等事件推送（待实现）
  * 选课系统退补选时自动实时抢课（待实现）

## Docs / 文档

  * 官方文档： [GitHub Wiki](https://github.com/trotyl/UESTC-Npm/wiki)
  * 项目源代码： [GitHub Repo](https://github.com/trotyl/UESTC-Npm)
  * Npm 包： [Npm Package Site](https://www.npmjs.com/package/uestc)

## Quick Start / 快速入门

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-Npm/wiki) 。

## Philosophy / 设计理念

> A Project for the sake of all Project.

  由于在日常的学习生活中有大量的项目（比如通信学院的 P2P）等都需要用到学校的一些网站（尤其是教务系统），
  甚至有时候也会进行一些相关测试（如常用密码字典破解等）。

  而绝大多数人都是直接开始从零造车子，目前还没有见到任何组织或个人有造轮子的计划，效率及其低下。
  虽然也有部分同学开源的一些相关项目（如教务系统爬虫等，可以在 GitHub 中搜索 `uestc` ），
  但大都功能单一，且都为独立项目不利于重复利用。

  从而构想出将学校网站所有功能抽离成独立 SDK 的理念，对外提供友好的 API ，将其与项目的业务逻辑相分离，从而高效化项目开发过程，
  也能够让项目本身更利于维护。

  初版 SDK 仅进行了 NodeJS 版本的开发，后续根据需求及现实情况可能继续开发 Ruby、Python、Java、C# 版本，
  仍然会按照现有的文档设计接口（其他语言可能大多采用同步函数接口，JS 版采用异步函数接口主要基于语言本身的原因），
  如果有意愿共同开发其他语言版本的可以联系作者。

## Examples / 示例

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-Npm/wiki) 。

## Tests / 测试

  如果需要运行测试，首先需要安装相应的依赖项，然后运行测试命令：

  单元测试：

```bash
$ npm install
$ npm test
```

  代码覆盖率测试：

```bash
$ npm install
$ npm run test-ci
```

## People / 开发人员

本项目目前由 [Trotyl Yu](https://github.com/trotyl) 独立开发。

[贡献者清单](https://github.com/trotyl/uestc/graphs/contributors)

## License / 许可协议

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/uestc.svg
[npm-url]: https://npmjs.org/package/uestc
[node-version]: https://img.shields.io/node/v/uestc.svg
[downloads-image]: https://img.shields.io/npm/dm/uestc.svg
[downloads-url]: https://npmjs.org/package/uestc
[appveyor-image]: https://img.shields.io/appveyor/ci/trotyl/UESTC-SDK-Npm/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/trotyl/UESTC-SDK-Npm
[travis-image]: https://img.shields.io/travis/trotyl/UESTC-SDK-Npm/master.svg?label=linux
[travis-url]: https://travis-ci.org/trotyl/UESTC-SDK-Npm
[coveralls-image]: https://img.shields.io/coveralls/trotyl/UESTC-SDK-Npm.svg
[coveralls-url]: https://coveralls.io/r/trotyl/UESTC-SDK-Npm
