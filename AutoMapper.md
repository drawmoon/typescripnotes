# AutoMapper

安装

```bash
npm install @automapper/core @automapper/classes reflect-metadata
npm install -D @automapper/types
```

创建实体对象与 DTO 模型对象，然后使用 `AutoMap` 装饰器装饰需要映射的属性：

```typescript
import { AutoMap } from "@automapper/classes";

export class User {
  @AutoMap()
  id: number;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  password: string;

  @AutoMap()
  a1: string;
}

export class UserDTO {
  @AutoMap()
  id: number;

  @AutoMap()
  username: string;

  @AutoMap()
  email: string;

  password: string;

  @AutoMap()
  a2: string;
}
```

新建 `mapper-profile.ts` 文件，创建 `UserProfile` 对象，通过 `createMap` 方法创建 `User` 与 `UserDTO` 的映射关系。可以通过 `forMember` 方法指定属性的映射关系：

```typescript
import { CamelCaseNamingConvention, mapFrom } from "@automapper/core";
import type { MappingProfile } from "@automapper/types";
import { UserDTO } from "../dtos/user.dto";
import { User } from "../entities/user";

export const UserProfile: MappingProfile = (mapper) => {
  mapper.createMap(User, UserDTO, {
    namingConventions: {
      source: new CamelCaseNamingConvention(),
      destination: new CamelCaseNamingConvention(),
    }
  })
  .forMember((user) => user.a2, mapFrom((source) => source.a1)); // 自定义成员的配置，a1 -> a2
}
```

新建 `mapper.ts` 文件，创建 `Mapper` 对象，将刚刚创建的 `UserProfile` 对象添加到 `Mapper` 中：

```typescript
import { classes } from "@automapper/classes";
import { createMapper } from "@automapper/core";
import { UserProfile } from "./mapper-profile";

export const Mapper = createMapper({
  name: 'userMapper',
  pluginInitializer: classes,
});

Mapper.addProfile(UserProfile);
```

使用 `mapArray` 方法将 `User` 数组转换为 `UserDTO` 数组：

```typescript
const users: User[] = [
  {
    id: 1,
    username: 'drsh',
    email: '1340260725@qq.com',
    password: '123',
    a1: 'i from a1',
  }
];
return Mapper.mapArray(users, UserDTO, User);
```

输出的结果：

```json
[
  {
    "id":1,
    "username":"drsh",
    "email":"1340260725@qq.com",
    "a2":"i from a1"
  }
]
```
