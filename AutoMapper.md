# AutoMapper

## 安装

```bash
npm install @automapper/core @automapper/classes reflect-metadata
```

## 快速入门

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

## 自定义映射规则

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
