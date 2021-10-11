const someArr = [1, 2, 3];
console.log( someArr[3] ); // undefined

// 拼接数组中的元素为字符串
const someArr2: string[] = [];
console.log( someArr2.join(' and ') ); // ''

// 提取指定开始索引到结束索引之间的元素
const someArr3 = new Array(6);
someArr3[0] = 'George';
someArr3[1] = 'John';
someArr3[2] = 'Thomas';
someArr3[3] = 'James';
someArr3[4] = 'Adrew';
someArr3[5] = 'Martin';

console.log( someArr3.slice(0, 3) ); // [ 'George', 'John', 'Thomas' ]
console.log( someArr3.slice(0, -2) ); // [ 'George', 'John', 'Thomas', 'James' ]

// 删除并返回最后一个元素
const pop = someArr3.pop();
console.log( pop, someArr3 );

// 去重
const someArr4 = [1, 1, 2, 2];
console.log( Array.from(new Set(someArr4)) );

const someArr5 = [1, 2, 3];
const someArr6 = [2, 3, 4];

// 合并两个数组
console.log( [...someArr5, ...someArr6] );
// 并集
console.log( Array.from(new Set([...someArr5, ...someArr6])) );
// 交集
console.log( someArr5.filter((x) => someArr5.includes(x)) );
// 差集
console.log( someArr5.filter((x) => !someArr6.includes(x)) );
