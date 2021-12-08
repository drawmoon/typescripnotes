# Hey NestJs

- [依赖注入](#依赖注入)
- [Swagger 篇](#swagger-篇)
- [在接口的请求处理中获取 Request 对象](#在接口的请求处理中获取-request-对象)
- [如何处理 form-data 形式的请求](#如何处理-form-data-形式的请求)
- [使用多个环境变量配置文件](#使用多个环境变量配置文件)
- [将文件的二进制数据下载到客户端](#将文件的二进制数据下载到客户端)

## 依赖注入

在 NestJs 的服务容器中，对象被构建时，有三种生命周期，分别是：

- Default: 在整个应用中只会被构建一次，在应用启动时被构建
- Request: 在每一个请求中被构建，实例将在请求完成处理后被销毁
- Transient: 从容器中请求时被构建，每次都是一个新的实例

在 NestJs 中，所有实例的生命周期默认都是 Default 的，即单例

需要注意的是：

- 如果在 Default 生命周期的对象中注入 Request 生命周期的对象时，前者的生命周期也会变更为 Request
- 如果在 Default 生命周期的对象中注入 Transient 生命周期的对象时，Transient 生命周期的对象只会被实例化一次

### 配置对象在容器中的生命周期

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

## Swagger 篇

### 在应用中集成 Swagger

安装

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

### 在文档中为接口分类

通过 `ApiTag` 装饰器可以描述控制器的分组，最终达到接口分类的效果

```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ToDo')
class TodoController {
}
```

### 在文档中为接口的请求参数添加描述

#### 添加 Query 形式的数组参数的描述

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

#### 添加 Body 形式的数组参数的描述

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

### 在文档中为接收二进制数据格式的参数添加描述

#### 添加接收单个文件的参数的描述

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

#### 添加接收多个文件的参数的描述

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

#### 添加接收任意文件的参数的描述

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

## 在接口的请求处理中获取 Request 对象

在 NestJs 中获取 `Request` 对象有两种方式，一种是通过 `Req` 装饰器在控制器层面获取，另一种则是通过依赖注入的方式获取

### 通过装饰器获取 Request

```typescript
import { Get, Req } from '@nestjs/common';
import { Request } from 'express';

class TodoController {
	@Get()
	get(@Req() req: Request) {
	}
}
```

### 通过依赖注入获取 Request

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

> 注意：
> `Request` 对象在容器中的生命周期是作用域（REQUEST），所以在 `ToDoController` 注入 `Request` 对象后，`ToDoController` 的生命周期也会变更为作用域（REQUEST）。

## 如何处理 form-data 形式的请求

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

## 使用多个环境变量配置文件

安装

```bash
npm install --save dotenv
```

在项目根目录新建配置文件，`.env` 用于生产环境的配置，`.development.env` 用于开发环境的配置。

修改 `package.json`：

```json
{
  "scripts": {
    "start": "node -r dotenv/config \"./node_modules/@nestjs/cli/bin/nest.js\" start dotenv_config_path=.development.env",
    "start:dev": "node --watch -r dotenv/config \"node_modules/@nestjs/cli/bin/nest.js\" start dotenv_config_path=.development.env",
    "start:prod": "node main",
    "start:inspect": "node --inspect=127.0.0.1:9229 main"
  }
}
```

执行 `npm run start` 使，使用的配置文件指定为了 `.development.env`；没有指定则默认使用 `.env`，所有执行 `node main` 时，使用的配置文件为 `.env`。

## 将文件的二进制数据下载到客户端

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
