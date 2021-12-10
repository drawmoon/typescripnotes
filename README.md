# Hey TypeScript

- [安装](#安装)
- [函数](#函数)
- [异步](#异步)
- [为模块扩展属性与方法](#为模块扩展属性与方法)
- [利用匿名函数消除过多 if-else 的方法](#利用匿名函数消除过多-if-else-的方法)
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

### 剩余参数

```typescript
function someFn(...args: string[]): void {
  // ...
}

someFn('a1', 'a2', 'a3');
```

### 匿名函数

```typescript
const someFn = function () {
  console.log('Hello World!');
};

someFn();
```

### 箭头函数

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

### 回调函数

```typescript
function someFn(callback: () => void): void {
  callback();
}

function callbackFn() {
  console.log('Hello World!');
}
someFn(callbackFn);
```

匿名回调函数

```typescript
someFn(function () {
  console.log('Hello World!');
})
```

箭头回调函数

```typescript
someFn(() => {
  console.log('Hello World!');
});
```

#### 异步的回调函数

```typescript
async function someFn(callback: () => Promise<void>): Promise<void> {
  await callback();
}

someFn(async () => {
  console.log('Hello World!');
});
```

#### 回调函数中的泛型参数

```typescript
function someFn(callback: <T>(id: T) => void): void {
  callback(123);
}

someFn((id) => {
  console.log(`Id is ${id}!`);
});
```

### 闭包

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

### Callback 形式的异步模型

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

### Promise 形式的异步模型

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

## 为模块扩展属性与方法

### 为模块扩展属性

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
import { Request } from 'express';

import express = require('express');
const app: express.Application = express();

app.get('/', (req: Request, res: Response) => {
  const items = req.items;
  console.log(items);
	
  res.send(`Hello World!`);
});
```

### 为模块扩展方法

在 `typing.d.ts` 文件中声明方法：

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

引入文件后使用扩展方法：

```typescript
import { Request } from 'express';
import './express-extensions';

import express = require('express');
const app: express.Application = express();

app.get('/', (req: Request, res: Response) => {
  req.setItem('key', 'value');
  const val = req.getItem('key');
  console.log(val);
	
  res.send(`Hello World!`);
});
```

## 利用匿名函数消除过多 if-else 的方法

`if-else` 的写法：

```typescript
async function remove<T>(type: string, id: T): Promise<void> {
  if (type === 'file') {
    // do something...
  } else if (type === 'folder') {
    // do something...
  } else if (type === 'tag') {
    // do something...
  } else {
    // do something...
  }
}
```

匿名函数的写法：

```typescript
const relations: Record<string, <T>(id: T) => Promise<void>> = {};

(() => {
  relationRecord['folder'] = async (id) => {
    // do something...
  };

  relationRecord['file'] = async (id) => {
    // do something...
  };

  relationRecord['tag'] = async (id) => {
    // do something...
  };
})();

async function remove<T>(type: string, id: T): Promise<void> {
  await this.relationRecord[type](id);
}
```

## 语法与风格检查

安装

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

- `eslint`: `ESLint` 核心代码
- `@typescript-eslint/parser`: `TypeScript` 解析器
- `@typescript-eslint/eslint-plugin`: `ESLint` 插件
- `prettier`: `Prettier` 核心代码
- `eslint-config-prettier`: 用于关闭所有不必要的或可能与 `Prettier` 冲突的规则
- `eslint-plugin-prettier`: `Prettier` 的 `ESLint` 插件

创建 ESLint 配置文件 `.eslintrc.js`：

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  }
};
```

- `parser`: 指定 ESLint 解析器
- `parserOptions`: 指定 JavaScript 语言选项，默认情况下需要 ECMAScript 5 语法，可以配置 ECMAScript 其他版本或 JSX 的支持
- `plugins`: 配置第三方插件
- `extends`: 表示继承基础配置中的规则
- `root`: 默认情况下，ESLint 会在父目录中寻找配置文件，一直到根目录；如果指定为 `true`，就不会在父目录中寻找
- `env`: 指定脚本的运行环境

创建 Prettier 配置文件 `.prettierrc`：

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

- `singleQuote`: 使用单引号替代双引号
- `trailingComma`: 在对象或数组的最后一个元素后面加上逗号

配置 `packgae.json`：

```json
{
  "scripts": {
    "lint": "eslint \"{src,test}/**/*.ts\" --fix"
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

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
