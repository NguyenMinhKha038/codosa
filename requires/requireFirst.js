// 1
// Input: Number array [1- 100]
// Output: find pairs of numbers whose sum is prime and arrange them from small to large.
// [
//   [1, 2],
//   [1, 4],
// ];
//Hàm kiểm tra số nguyên tố
const checkIsPrime = (numb) => {
  if (numb % 2 == 0) return false;
  for (let i = 3; i <= Math.sqrt(numb); i = i + 2) {
    if (numb % i == 0) {
      return false;
    }
  }
  return true;
};

// const checkIncludes = (value1, value2, arr) => {
//   if (arr.toString().includes([value1, value2].reverse().toString()) == true) {
//     return true;
//   }
//   return false;
// };

let arr = [];
for (let i = 1; i <= 100; i++) {
  arr.push(i);
}
console.log(arr);
let arrPrime = [];
for (let i = 0; i < arr.length - 1; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (checkIsPrime(arr[i] + arr[j])) {
      arrPrime.push([arr[i], arr[j]]);
    }
  }
}
console.log(arrPrime);

//sort;

console.log(
  arrPrime.sort(function (a, b) {
    return (
      a.reduce((total, value) => {
        return total + value;
      }) -
      b.reduce((total, value) => {
        return total + value;
      })
    );
  })
);
