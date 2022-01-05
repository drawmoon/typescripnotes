- [安装](#安装)
- [函数](#函数)
- [异步](#异步)
- [为模块扩展属性与方法](#为模块扩展属性与方法)
- [使用匿名函数消除过多 if-else 的方法](#使用匿名函数消除过多-if-else-的方法)
- [基于 NestJs 的后端 Web 应用](#基于-nestjs-的后端-web-应用)
- [使用 AutoMapper 实现对象映射](#使用-automapper-实现对象映射)
- [Puppeteer 快速入门](#puppeteer-快速入门)
- [语法与风格检查](#语法与风格检查)
- [依赖包管理](#依赖包管理)

## 安装

**Windows**

在 [Node 官网](https://nodejs.org/) 下载安装程序，然后使用默认配置安装 NodeJs

接下来执行以下命令安装 TypeScript 编译器：

```bash
npm install -g typescript
```

**Ubuntu**

执行以下命令安装 NodeJs 与 Npm：

```bash
apt update
apt install nodejs npm
```

接下来执行以下命令安装 TypeScript 编译器：

```bash
npm install -g typescript
```

## 函数

基本语法

```typescript
function someFn(): void {
  // ...
}
```

声明参数

```typescript
function someFn(args: string[], force: boolean): void {
  // ...
}
```

**剩余参数**

```typescript
function someFn(...args: string[]): void {
  // ...
}

someFn('a1', 'a2', 'a3');
```

**匿名函数**

```typescript
const someFn = function () {
  console.log('Hello World!');
};

someFn();
```

**箭头函数**

```typescript
const someFn = () => {
  console.log('Hello World!');
};

someFn();
```

箭头函数中的泛型参数

```typescript
const someFn = <T>(id: T) => {
  // ...
};
```

**回调函数**

```typescript
function someFn(callback: () => void): void {
  callback();
}

function callbackFn() {
  console.log('Hello World!');
}
someFn(callbackFn);
```

**匿名回调函数**

```typescript
someFn(function () {
  console.log('Hello World!');
})
```

**箭头回调函数**

```typescript
someFn(() => {
  console.log('Hello World!');
});
```

**异步的回调函数**

```typescript
async function someFn(callback: () => Promise<void>): Promise<void> {
  await callback();
}

someFn(async () => {
  console.log('Hello World!');
});
```

**回调函数中的泛型参数**

```typescript
function someFn(callback: <T>(id: T) => void): void {
  callback(123);
}

someFn((id) => {
  console.log(`Id is ${id}!`);
});
```

**闭包**

```typescript
function someFn() {
  return function (msg: string) {
    console.log(msg);
  };
}

const msg = 'Hello World!';
someFn()(msg);
```

## 异步

**Callback 形式的异步模型**

```typescript
function readFile(path: string, callback :(err: Error, data: Buffer) => void): void {
  setTimeout(() => {
    const data = Buffer.from('123456abcdefg', 'utf-8');
    callback(undefined, data);
  }, 2000);
}

readFile('text.txt', (err, data) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(data.toString('utf-8'));
  }
});
```

**Promise 形式的异步模型**

```typescript
function readFile(path: string): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    setTimeout(() => {
      const data = Buffer.from('123456abcdefg', 'utf-8');
      resolve(data);
    }, 2000);
  });
}

readFile('text.txt')
  .then((data) => {
    console.log(data.toString('utf-8'));
  })
  .catch((err) => {
    console.error(err.message);
  });
```

## 模块扩展

**属性扩展**

如果需要扩展其他模块，需要新建类型声明文件，下面新建 `typing.d.ts` 文件，文件名称可以根据模块名来命名 `express.d.ts`：

```typescript
export {};

declare module 'express' {
  interface Request {
    items: Record<string, string>;
  }
}
```

接下来可以在引入模块后使用该属性：

```typescript
import * as express from 'express';
import { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  const items = req.items;
  console.log(items);
	
  res.send(`Hello World!`);
});
```

**函数扩展**

在 `typing.d.ts` 文件中声明函数：

```typescript
export {};

declare module 'express' {
  interface Request {
    items: Record<string, string>;

    getItem(key: string): string;

    setItem(key: string, value: string): void;
  }
}
```

新建 `express.extensions.ts` 文件：

```typescript
import * as express from 'express';

express.request.getItem = function (key: string): string {
  if (this.items) {
    return this.items[key];
  }
  return undefined;
};

express.request.setItem = function (key: string, value: string): void {
  if (this.items) {
    this.items[key] = value;
  }
  this.items = { [key]: value };
};
```

引入文件后使用扩展函数：

```typescript
import * as express from 'express';
import { Request, Response } from 'express';
import './express-extensions';

const app = express();

app.get('/', (req: Request, res: Response) => {
  req.setItem('key', 'value');
  const val = req.getItem('key');
  console.log(val);
	
  res.send(`Hello World!`);
});
```

## 使用匿名函数消除过多 if-else 的方法

`if-else` 的写法：

```typescript
function sayHi(name: string, type: 'zh' | 'en' | 'ja'): string {
  if (type === 'zh') {
    return `你好, ${name}`;
  } else if (type === 'en') {
    return `hi, ${name}`;
  } else if (type === 'ja') {
    return `こんにちは, ${name}`;
  } else {
    // do something...
  }
}
```

匿名函数的写法：

```typescript
const record: Record<string, (name: string) => void> = {
  ['zh']: (name) => `你好, ${name}`,
  ['en']: (name) => `hi, ${name}`,
  ['ja']: (name) => `こんにちは, ${name}`,
};

function sayHi(name: string, type: 'zh' | 'en' | 'ja'): string {
  return record[type](name);
}
```

## 基于 NestJs 的后端 Web 应用

### 依赖注入

在 NestJs 的服务容器中，对象被构建时，有三种生命周期，分别是：

- Default: 在整个应用中只会被构建一次，在应用启动时被构建
- Request: 在每一个请求中被构建，实例将在请求完成处理后被销毁
- Transient: 从容器中请求时被构建，每次都是一个新的实例

在 NestJs 中，所有实例的生命周期默认都是 Default 的，即单例

需要注意的是：

- 如果在 Default 生命周期的对象中注入 Request 生命周期的对象时，前者的生命周期也会变更为 Request
- 如果在 Default 生命周期的对象中注入 Transient 生命周期的对象时，Transient 生命周期的对象只会被实例化一次

**配置对象在容器中的生命周期**

通过 `Injectable` 装饰器来指定对象的生命周期

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({
  scope: Scope.REQUEST
})
class ToDoService {
}
```

在注册到服务容器时指定对象的生命周期

```typescript
import { Module, Scope } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'TODO_SERVICE',
      useClass: ToDoService,
      scope: Scope.REQUEST
    }
  ],
})
class AppModule {}
```

### Swagger

#### 安装与配置

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

配置 Swagger 中间件，添加文件的描述与版本，并将 Swagger 的访问路径指定为 `api`

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 初始化 Swagger
  const config = new DocumentBuilder()
    .setTitle('ToDo API')
    .setDescription('A simple example nodejs Web API')
    .setVersion('v1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

#### 接口分组与描述

通过 `ApiTag` 装饰器可以描述控制器的分组

```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ToDo')
class TodoController {
}
```

#### 接口参数的描述

**Query 形式的数组参数**

通过 `ApiQuery` 装饰器描述接口参数，`isArray` 属性指定参数为数组

```typescript
@ApiQuery({
  name: 'id',
  description: 'The param description',
  type: Number,
  isArray: true,
})
getById(
  @Query('id', new ParseArrayPipe({ items: Number }))
  id: number[],
) {
}
```

**Body 形式的数组参数**

通过 `ApiProperty` 装饰器描述 `Body` 中的参数，`isArray` 属性指定参数是一个数组

```typescript
class GetUserByIdDTO {
  @ApiProperty({
    description: 'The param description',
    type: Number,
    isArray: true,
  })
  id: number[];
}

@ApiBody({
  type: GetUserByIdDTO,
})
getById(
  @Body('id', new ParseArrayPipe({ items: Number }))
  ids: number[],
) {
}
```

#### 文件上传描述

**接收一个文件**

通过 `ApiConsumes` 装饰器描述接口的请求方式为 `multipart/form-data`；将属性的 `type` 指定为 `file`，`format` 指定为 `binary`，表示为二进制数据；`required` 指定属性为必填

```typescript
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        description: '文件的二进制数据',
        type: 'file',
        format: 'binary',
      },
    },
    required: ['file'],
  },
})
@UseInterceptors(FileInterceptor('file'))
upload(@UploadedFile() file: Express.Multer.File) {
}
```

**接收多个文件**

通过 `ApiConsumes` 装饰器描述接口的请求方式为 `multipart/form-data`；将属性的 `type` 指定为 `file`，`format` 指定为 `binary`，表示为二进制数据；`nullable` 描述属性是否可空的，`required` 指定属性为必填

```typescript
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: object,
    properties: {
      ['readme.md']: {
        description: 'readme.md 文件的二进制数据',
        type: 'file',
        format: 'binary',
        nullable: true,
      },
      ['index.docx']: {
        description: 'index.docx 文件的二进制数据',
        type: 'file',
        format: 'binary',
        nullable: false,
      },
    },
    required: ['index.docx'],
  },
})
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'readme.md', maxCount: 1 },
    { name: 'index.docx', maxCount: 1 },
  ])
)
upload(
  @UploadedFile('readme.md') readme: Express.Multer.File,
  @UploadedFile('index.docx') docx: Express.Multer.File,
) {
}
```

**接收任意文件**

通过 `ApiConsumes` 装饰器描述接口的请求方式为 `multipart/form-data`；将 `type` 指定为 `array` 表示属性为数组格式，将 `items` 中的 `type` 指定为 `file`，`format` 指定为 `binary`，表示为二进制数据；`required` 指定属性为必填

```typescript
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: object,
    properties: {
      ['files']: {
        type: 'array',
        description: '文件的二进制数据',
        items: {
          type: 'file',
          format: 'binary',
        },
      },
    },
    required: ['files'],
  },
})
@UseInterceptors(AnyFilesInterceptor())
upload(@UploadedFiles() files: Express.Multer.File[]) {
}
```

### 获取 Request 对象

在 NestJs 应用中获取 `Request` 对象有两种方式:

- `@Req()`: 在控制器中使用装饰器获取
- `@Inject()`: 通过依赖注入的方式获取

**通过装饰器获取 Request**

```typescript
import { Get, Req } from '@nestjs/common';
import { Request } from 'express';

class TodoController {
	@Get()
	get(@Req() req: Request) {
	}
}
```

**通过依赖注入获取 Request**

```typescript
import { Inject }from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

class ToDoController {
	constructor(
		@Inject(REQUEST)
		private readonly req: Request,
	) {}
}
```

> 需要注意的一点，`Request` 注册的生命周期是作用域（REQUEST），所以在 `ToDoController` 注入 `Request` 后，`ToDoController` 的生命周期也会变更为作用域（REQUEST）。

### 处理 form-data 形式的请求

安装

```bash
npm install express-form-data
```

接下来新建 `FormDataInterceptor` 拦截器类，实现 NestJs 提供的 `NestInterceptor` 类

```typescript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import * as os from 'os';
import * as FormData from 'express-form-data';

@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const options = {
      uploadDir: os.tmpdir(),
      autoClean: true,
    };

    const http = context.switchToHttp();

    const subject = new Subject();
    FormData.parse(options)(http.getRequest(), http.getResponse(), () => {
      next.handle().subscribe(subject);
    });

    return subject;
  }
}
```

使用 `UseInterceptors` 装饰器装饰方法

```typescript
class ToDoController {
  @UseInterceptors(FormDataInterceptor)
  @Post()
  post(@Body("name") name: string) {
  }
}
```

接下来 `form-data` 形式的请求进来后，就可以顺利的拿到 `name` 参数的值了

### 将文件的二进制数据下载到客户端

```typescript
import { Get, Res } from "@nestjs/common";
import { Response } from "express";
import { Readable } from "stream";

export class ToDoController {
  @Get()
  export(@Res() res: Response): void {
    const buffer = this.toDoService.getBuffer();
    
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const filename = 'export.docx';

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length,
      "Content-Disposition": `attachment; filename="${encodeURI(filename)}"`, // 指定下载的文件名称
    });

    stream.pipe(res);
  }
}
```

## 使用 AutoMapper 实现对象映射

### 安装

```bash
npm install @automapper/core @automapper/classes reflect-metadata
```

### 快速入门

创建实体对象与 DTO 模型对象，使用 `AutoMap` 装饰器装饰需要映射的属性：

```typescript
import { AutoMap } from '@automapper/classes';

export class User {
  @AutoMap()
  id: number;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap()
  email: string;

  password: string;
}

export class UserDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  fullName: string;

  @AutoMap()
  email: string;
}
```

实现 `MappingProfile` 接口，创建 `User` 与 `UserDTO` 的映射关系：

```typescript
import { CamelCaseNamingConvention, MappingProfile } from '@automapper/core';
import { UserDTO } from './user.dto';
import { User } from './user';

export const UserProfile: MappingProfile = (mapper) => {
  mapper.createMap(User, UserDTO, {
    namingConventions: {
      source: new CamelCaseNamingConvention(),
      destination: new CamelCaseNamingConvention(),
    }
  });
}
```

初始化 `Mapper` 对象，并将刚刚创建的 `UserProfile` 对象添加到 `Mapper` 中：

```typescript
import { classes } from '@automapper/classes';
import { createMapper } from '@automapper/core';
import { UserProfile } from './mapper-profile';

export const Mapper = createMapper({
  name: 'userMapper',
  pluginInitializer: classes,
});

Mapper.addProfile(UserProfile);
```

现在可以使用 `Mapper` 对象提供方法实现对象与对象的转换：

```typescript
const users: User[] = [
  {
    id: 1,
    firstName: 'hu',
    lastName: 'hongqi',
    email: 'hongqi.hu@email.com',
    password: '123456',
  }
];
return Mapper.mapArray(users, UserDTO, User);
```

### 自定义映射规则

通过 `forMember` 方法自定义配置属性的映射规则：

```typescript
import { CamelCaseNamingConvention, MappingProfile, mapFrom } from '@automapper/core';
import { UserDTO } from './user.dto';
import { User } from './user';

export const UserProfile: MappingProfile = (mapper) => {
  mapper
    .createMap(User, UserDTO, {
      namingConventions: {
        source: new CamelCaseNamingConvention(),
        destination: new CamelCaseNamingConvention(),
      }
    })
    .forMember(
      (destination) => destination.fullName, 
      mapFrom((source) => source.firstName + source.lastName));
}
```

## Puppeteer 快速入门

### 打开一个页面

调用 `launch` 函数启动一个浏览器，浏览器默认是 `Chrome`；`newPage` 函数打开一个新的标签页；`goto` 跳转到指定页面，配置 `waitUntil: 'domcontentloaded'` 时，表示等待页面加载完成。

```typescript
import { launch, Browser } from 'puppeteer';

async function openPage(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        console.log('Went to:', page.url());
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await openPage(browser, 'https://www.example.com');

    await browser.close();
});
```

### 页面截图

调用 `screenshot` 函数对当前页面截图。你可以加上 `path` 参数，指定文件保存的位置，当 `path` 为空时，它将返回一个 `Buffer`；它还接收 `encoding` 参数，指定返回的数据是 `Buffer` 或 `Base64` 字符串。

```typescript
import { launch, Browser } from 'puppeteer';

async function screenshot(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // 保存文件到指定位置
        await page.screenshot({ path: 'example.png' });

        // 指定 encoding 返回二进制数据或 base64 字符串
        const buf = await page.screenshot({ encoding: 'binary' });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await screenshot(browser, 'https://www.example.com');

    await browser.close();
});
```

### 设置页面的宽高

`setViewport` 函数接收一个对象，对象中 `width`、`height` 设置页面的宽高。

```typescript
import { launch, Browser } from 'puppeteer';

async function setViewport(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 500, height: 500 });

        await page.goto(url, { waitUntil: 'domcontentloaded' });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await setViewport(browser, 'https://www.example.com');

    await browser.close();
});
```

### 设置浏览器的本地存储

调用 `localStorage.setItem` 函数设置本地存储。

```typescript
import { launch, Browser } from 'puppeteer';

async function setLocalstorage(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        const storageItems = {
            ['reqid']: '35741628143751486',
        };
        await page.evaluateOnNewDocument((items) => {
            const keys = Object.keys(items);
            for (const key of keys) {
                localStorage.setItem(key, items[key]);
            }
        }, storageItems);

        await page.goto(url, { waitUntil: 'domcontentloaded' });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await setLocalstorage(browser, 'https://www.example.com');

    await browser.close();
});
```

### 为每个请求设置请求头

`setExtraHTTPHeaders` 函数接收一个 `Record<string, string>` 对象，将 `Record` 的键值添加到请求头中。

```typescript
import {Browser, launch} from 'puppeteer';

async function setHeaders(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        const extraHeaders = {
            ['reqid']: '35741628143751486',
        };
        await page.setExtraHTTPHeaders(extraHeaders);

        await page.goto(url, { waitUntil: 'domcontentloaded' });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await setHeaders(browser, 'https://www.example.com');

    await browser.close();
});
```

### 等待页面 XPath

`waitForXPath` 函数接收一个 `XPath` 表达式，当指定的表达式出现在页面中后，才执行下一步代码，`timeout` 设置等待超时。

```typescript
import { launch, Browser } from 'puppeteer';

async function waitXpath(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        await page.goto('https://www.example.com');

        await page.waitForXPath('//h1[text()="Example Domain"]', { timeout: 4000 });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await waitXpath(browser, 'https://www.example.com');

    await browser.close();
});
```

### 打印页面为 PDF

调用 `pdf` 函数将当前页面打印为 PDF。你可以加上 `path` 参数，指定文件保存的位置，当指定 `path` 的情况下，默认返回二进制数据；你还可以通过 `format` 参数指定 PDF 的纸张尺寸为 `a4`。

```typescript
import { launch, Browser } from 'puppeteer';

async function toPdf(browser: Browser, url: string) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // 保存文件到指定位置
        await page.pdf({ path: 'example.pdf', format: 'a4' });

        // 不指定 path 的情况下，默认返回二进制数据
        const buf = await page.pdf({ format: 'a4' });
    } finally {
        await page.close();
    }
}

const promise = launch({
    headless: true, // 在使用 `pdf` 函数时，需要将 `headless` 设置为 `true`，否则它将无法工作，你将得到 `Protocol error (Page.printToPDF): PrintToPDF is not implemented` 的报错
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 },
});

promise.then(async (browser) => {
    await toPdf(browser, 'https://www.example.com');

    await browser.close();
});
```

> 在使用 `pdf` 函数时，你需要将 `headless` 设置为 `true`，否则它将无法工作，你将得到 `Protocol error (Page.printToPDF): PrintToPDF is not implemented` 的报错。


## 语法与风格检查

安装

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript
```

- `eslint`: `ESLint` 核心代码
- `@typescript-eslint/parser`: `TypeScript` 解析器
- `@typescript-eslint/eslint-plugin`: `ESLint` 插件

创建 ESLint 配置文件 `.eslintrc.js`：

```javascript
'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'script',
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended']
};
```

- `parser`: 指定 `ESLint` 解析器
- `parserOptions`: 指定 `JavaScript` 语言选项，默认情况下需要 `ECMAScript 5` 语法，可以配置 `ECMAScript` 其他版本或 `JSX` 的支持
- `plugins`: 配置第三方插件
- `extends`: 表示继承基础配置中的规则

配置 `packgae.json`：

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts"
  }
}
```

## 依赖包管理

使用 `npm-check` 升级项目中的依赖包，在项目的 `package.json` 所在的目录下执行以下命令：

使用 `npx`：

```bash
npx npm-check -u
```

或执行 `npm install -g npm-check` 将 `npm-check` 安装到系统全局后再执行：

```bash
npm-check -u
```

等待工具检查依赖完毕后，会输出可以更新的依赖，按照推荐和谨慎来分开显示；按上下键可以移动选择，空格选中或取消选中，按下回车键后启动更新：

```bash
? Choose which packages to update. (Press <space> to select)

 Minor Update New backwards-compatible features.
>( ) typescript devDep  4.0.6  ❯  4.2.3  https://www.typescriptlang.org/

 Space to select. Enter to start upgrading. Control-C to cancel.
```

> 执行 `npm-check -u -g` 可以对系统全局的依赖进行升级
