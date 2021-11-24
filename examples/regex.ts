/*
  使用正则表达式匹配指定字符串
 */
const somePattern =
  /^[前后]?(?<digit>[0-9零一二两三四五六七八九十])个?(?:[年月日]|星期|季度)以?[前后]?$/;

const inputText = '前两个星期';

// 返回一个 Boolean，指示该字符串是否匹配成功
console.log(somePattern.test(inputText));

// 对指定字符串进行搜索，返回搜索结果的数组
const execArr = somePattern.exec(inputText);
console.log(execArr[1]);

/*
  将匹配到的分组的值替换为新的值
 */
const somePattern2 = /<[^>]*=(?<stain>3D)+\"\S+\"\s*\/?>/g;

const html =
  '<figure class=3D"image"><img src=3D"file:///C:/fake/image0.png"> <figcaption>3D图形</figcaption>';
const rst = html.replace(somePattern2, (sub, stain) => {
  return sub.replace(stain, '');
});
console.log(rst);
