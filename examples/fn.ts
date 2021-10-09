// 匿名函数
function someFn(callback: () => void): void {
  callback();
}

someFn(() => {
  console.log('Hello World!');
});

// 异步匿名函数
function someFn2(callback: () => Promise<void>): void {
  callback().then();
}

someFn2(async () => {
  console.log('Hello World!');
});

// 泛型匿名函数
function someFn3(callback: <T>(id: T) => void): void {
  callback(123);
}

someFn3((id) => {
  console.log(`Hello ${id}!`);
});

// 闭包
function someFn4() {
  return function () {
    console.log('Hello World!');
  };
}

someFn4()();
