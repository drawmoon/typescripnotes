/*
  类的声明
 */
class Store {
  constructor(private name: string) {}

  getName() {
    return this.name;
  }
}

/*
  类的继承与函数重写
 */
class PhysicalStore extends Store {
  getName(): string {
    console.log('PhysicalStore getName');
    return super.getName();
  }
}

const physicalStore = new PhysicalStore('Game World');
physicalStore.getName();

/*
  类的继承之构造函数
 */
class CloudStore extends Store {
  constructor(name: string, public tag: string) {
    super(name);
  }
}

const cloudStore = new CloudStore('Steam', 'lib');
cloudStore.getName();
console.log(cloudStore.tag);

/*
  函数重载
 */
class UserService {
  getUser(id: number);

  getUser(name: string);

  getUser(u: number | string) {
    console.log(u);
  }
}

const userService = new UserService();
userService.getUser(1);
userService.getUser('George');
