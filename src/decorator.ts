// 方法装饰器，捕获异常的装饰器
function errorCatch() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    const original = descriptor.value;
    descriptor.value = function () {
      try {
        original.apply(this);
      } catch (e) {
        console.log(e);
      }
    };
  };
}

class SomeDecoratorClass {
  @errorCatch()
  fn(): void {
    console.log('fn');
    throw new Error('error');
  }
}

const c = new SomeDecoratorClass();
c.fn();
