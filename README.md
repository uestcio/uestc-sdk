<!-- ![UESTC Logo]() -->

# UESTC SDK

  简洁、可靠且功能强大的 [UESTC](http://portal.uestc.edu.cn) 集成 API 工具。

  （项目目前还在开发中，所有功能尚未完成）

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

```js
var sdk = require('uestc');
var app = sdk();
var user = app.login('2012019050031', '12345678');

app.searchForPerson('章萌芊').then(function (people) {
  console.log('全电子科大叫章萌芊的共有' + people.length + '人，分别是：');
  for(var i in people) {
    person = people[i];
    console.log('身份：' + person.metier + '，学院：' + person.department + '，学号：' + person.number);
  }
});

user.getCourses(3, 2).then(function (courses) {
  console.log('上学期的成绩如下：');
  for(var i in courses) {
    var course = courses[i];
    console.log('课程: ' + course.name + '，成绩: ' + course.score + '，学分: ' + course.credit);
  }
});

user.on(Event.userTypes.eCardConsumption).then(function (consumption) {
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
$ npm install uestc --dev
```

## Features / 特性

  * 用户模拟登陆
  * 课程成绩信息获取及订阅通知（待实现）
  * 考试信息获取及订阅通知（待实现）
  * 教务处公告获取及订阅通知（待实现）
  * 课程表信息获取（待实现）
  * 数据信息缓存，支持离线访问（待实现）
  * 支持学校的人员的信息查询（待实现）
  * 支持一卡通消费信息查询及订阅通知（待实现）
  * 支持学校的开课信息查询（待实现）

## Docs / 文档

  * 官方文档： [GitHub Wiki](https://github.com/trotyl/UESTC-Npm/wiki)
  * 项目源代码： [GitHub Repo](https://github.com/trotyl/UESTC-Npm)
  * Npm 包： [Npm Package Site](https://www.npmjs.com/package/uestc)

## Quick Start / 快速入门

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-Npm/wiki) 。

## Philosophy / 设计理念

  由于在日常的学习生活中经常需要用到学校教务系统的爬虫，甚至有时候也会进行一些相关测试（如常用密码字典破解等），
  故对学校相关网站（尤其是教务系统）需要频繁的信息交互。

  从而构想出将学校网站功能抽离成独立 API 的理念，将其与项目的业务逻辑相分离，从而高效化项目开发过程，
  也能够让项目本身更利于维护。

## Examples / 示例

  由于整个项目的接口较为简单，可直接参考 [__官方文档__](https://github.com/trotyl/UESTC-Npm/wiki) 。

## Tests / 测试

  如果需要运行测试，首先需要安装相应的依赖项，然后运行 `npm test`：

```bash
$ npm install
$ npm test
```

## People / 开发人员

本项目目前由 [Trotyl Yu](https://github.com/trotyl) 独立开发。

[贡献者清单](https://github.com/trotyl/uestc/graphs/contributors)

## License / 许可协议

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/uestc.svg
[npm-url]: https://npmjs.org/package/uestc
[downloads-image]: https://img.shields.io/npm/dm/uestc.svg?label=linux
[downloads-url]: https://npmjs.org/package/uestc
[appveyor-image]: https://img.shields.io/appveyor/ci/trotyl/UESTC-SDK-Npm.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/trotyl/UESTC-SDK-Npm
[travis-image]: https://img.shields.io/travis/trotyl/UESTC-SDK-Npm.svg
[travis-url]: https://travis-ci.org/trotyl/UESTC-SDK-Npm
[coveralls-image]: https://img.shields.io/coveralls/trotyl/UESTC-SDK-Npm.svg
[coveralls-url]: https://coveralls.io/r/trotyl/UESTC-SDK-Npm
