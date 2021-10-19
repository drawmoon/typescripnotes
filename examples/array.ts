/*
    数组的声明
 */
const someWordArr = ['Hello', 'World'];
const someNameArr = new Array(6);
someNameArr[0] = 'George';
someNameArr[1] = 'John';
someNameArr[2] = 'Thomas';
someNameArr[3] = 'James';
someNameArr[4] = 'Adrew';
someNameArr[5] = 'Martin';

console.log(someWordArr, someNameArr);

/*
    获取指定索引处的元素，超出范围时返回 undefined
 */
console.log(someNameArr[0], someNameArr[-1], someNameArr[6]);

/*
    拼接数组中的元素为字符串
 */
console.log(someWordArr.join(', '));

/*
    提取指定开始索引到结束索引之间的元素
 */
console.log(someNameArr.slice(0, 3)); // [ 'George', 'John', 'Thomas' ]
console.log(someNameArr.slice(0, -2)); // [ 'George', 'John', 'Thomas', 'James' ]

/*
    删除并返回最后一个元素
 */
const pop = someNameArr.pop();
console.log(pop, someNameArr);

/*
    去重
 */
const someNumberArr = [1, 1, 2, 2];
console.log(Array.from(new Set(someNumberArr)));

/*
    合并、并集、交集、差集
 */
const someArr1 = [1, 2, 3];
const someArr2 = [2, 3, 4];

// 合并
console.log([...someArr1, ...someArr2]);
// 并集
console.log(Array.from(new Set([...someArr1, ...someArr2])));
// 交集
console.log(someArr1.filter((x) => someArr1.includes(x)));
// 差集
console.log(someArr1.filter((x) => !someArr2.includes(x)));
