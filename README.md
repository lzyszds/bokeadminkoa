# 博客后端项目 -. -

<img src="https://github.com/lzyszds/bokeadminkoa/blob/master/mdfiles/koaLogo.png?raw=true">
<br>这个博客后台项目是基于Koa框架构建的。
<br>项目开始时，我们从Express框架迁移过来，进行了一次全面的项目重构。
<br>在这个过程中，我们引入了许多新的特性和改进。
<br>
<img src="https://img.shields.io/badge/node-20.x-brightgreen.svg">
<img src="https://img.shields.io/badge/Mysql-5.x-brightgreen" >
<img src="https://img.shields.io/badge/Koa-2.x-blue" >
<img src="https://img.shields.io/badge/TypeScript-5.x-yellow">


## 主要功能

1. **用户管理**: 我们为用户提供了头像上传接口，但这个功能目前还未完全完成。此外，我们还实现了用户的删除功能。

2. **权限验证**: 为了保证安全，我们新增了接口拦截和token验证功能。同时，我们还引入了全局的配置项。

3. **文章管理**:
   我们为文章提供了一系列的API接口，包括获取文章列表、获取文章详情、更新文章访问量等。此外，我们还新增了一些文章详情的字段，使得文章的信息更加丰富。在文章类型方面，我们也提供了相应的接口，并且引入了随机文章图库接口。

4. **评论管理**: 我们提供了获取当前系统所有评论的API接口。

5. **首页数据**: 我们为后台首页提供了数据API接口。

## 特性和改进

1. **GitHub贡献图API**: 我们新增了GitHub贡献图API，并进行了相应的配置。

2. **字体压缩**: 为了优化性能，我们实现了字体压缩功能，可以指定字符进行压缩。

3. **代码规范**: 我们对controller代码进行了规范，并且新增了common接口类。此外，我们还封装了SQL语句拼接的方法，使得代码更加简洁。

4. **错误提示**: 我们为数据库操作和SQL语句错误提供了中文提示，使得错误信息更加清晰。

5. **安全性**: 我们新增了token和密码加密函数，提高了系统的安全性。

6. **路由管理**: 我们将API更换为独立的路由，使得路由管理更加清晰。

## Bug修复

在项目的开发过程中，我们修复了一些bug，包括文章作者连接的问题，以及之前遗漏的userMapper问题。此外，我们还解决了文章列表接口count数量的问题。

这个项目还在不断的更新和改进中，我们期待您的反馈和建议。