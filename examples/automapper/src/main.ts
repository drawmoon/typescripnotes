import { Mapper } from './mapper';
import { User } from './user';
import { UserDTO } from './user.dto';

// 对象映射
const user = {
  id: 1,
  firstName: 'hu',
  lastName: 'hongqi',
  email: 'hongqi.hu@email.com',
  password: '123456',
};

const userDto = Mapper.map(user, UserDTO, User);
console.log(userDto);

// 数组对象映射
const users: User[] = [user];

const userDtoList = Mapper.mapArray(users, UserDTO, User);
console.log(userDtoList);