const str = 'abcdefg';

// 提取索引 0 处到索引 5 处之间的字符
console.log(str.slice(0, 5)); // abcde

// 提取索引 0 处到索引 -2 处之间的字符
console.log(str.slice(0, -2)); // abcde

// format
function strformat(str: string, ...args: string[]) {
    for (const k in args) {
        str = str.replace(`{${k}}`, args[k]);
    }
    return str;
}

const msg = 'Hello, {0}!';
console.log(strformat(msg, 'World'));
