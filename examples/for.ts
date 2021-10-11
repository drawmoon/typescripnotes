const words = ['Hello', 'World'];

console.log('for:');
for (let i = 0; i < words.length; i++) {
    console.log(i, words[i]);
}

console.log('forin:');
for (const wordsKey in words) {
    console.log(wordsKey, words[wordsKey]);
}

console.log('forof:');
for (const word of words) {
    console.log(word);
}
