// 2
// Input: No
// Require: Create an array of 200 strings (a-f[length==8]). Finds elements with the letter a but not the letter c and ends with f.

let arr = [];
const makeId = (length) => {
  let text = "";
  const possible = "abcdef";
  for (var i = 0; i <= length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
for (let i = 1; i <= 200; i++) {
  arr.push(makeId(7));
}

let arrSorted = [];

for (const value of arr) {
  if (
    value.includes("c") ||
    !value.includes("a") ||
    value.lastIndexOf("f") != 7
  ) {
    continue;
  }
  arrSorted.push(value);
}
console.log(arr);
console.log(arrSorted);
