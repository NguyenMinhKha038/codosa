// 4
// Require: array of 10 next date. Is monday, is even date of month (exclude 2,4,6,8,10) and calculate period of time from now.
// Format
//
// [{
//   date: 08-04-2021,
//   countdown: 12 days 1 minute, 30 second.
// }]
const today = new Date();
let nextDay = new Date();
let arrDay = [];

const addDay = () => {
  const year = nextDay.getFullYear();
  const month = nextDay.getMonth();
  const date = nextDay.getDate();
  if (nextDay.getDay() == 0) {
    nextDay = new Date(year, month, date + 1);
    return nextDay;
  } else if (nextDay.getDay() == 1) {
    nextDay = new Date(year, month, date + 7);
  } else if (nextDay.getDay() == 2) {
    nextDay = new Date(year, month, date + 6);
    return nextDay;
  } else if (nextDay.getDay() == 3) {
    nextDay = new Date(year, month, date + 5);
    return nextDay;
  } else if (nextDay.getDay() == 4) {
    nextDay = new Date(year, month, date + 4);
    return nextDay;
  } else if (nextDay.getDay() == 5) {
    nextDay = new Date(year, month, date + 3);
    return nextDay;
  } else if (nextDay.getDay() == 6) {
    nextDay = new Date(year, month, date + 2);
    return nextDay;
  }
};
const arr = () => {
  let count = 1;
  while (count <= 10) {
    addDay();
    if (nextDay.getDate() % 2 != 0 || nextDay.getDate() < 10) {
      continue;
    } else {
      let countdownDay =
        Math.ceil((nextDay - today) / (24 * 60 * 60 * 1000)) - 1;
      let countdownMin = 60 - today.getMinutes();
      let countdownHour = 24 - today.getHours() - 1;
      let countdownSecond = Math.ceil(60 - today.getMilliseconds() / 1000);
      arrDay.push(
        {
          day:
            fmDate(),
        },
        {
          countdowm:
            countdownDay +
            " days " +
            countdownHour +
            " hours " +
            countdownMin +
            " minutes " +
            countdownSecond +
            " seconds",
        }
      );
      count++;
    }
    nextDay = new Date(
      nextDay.getFullYear(),
      nextDay.getMonth(),
      nextDay.getDate() + 7
    );
  }
};
arr();
console.log(arrDay);
function fmDate() {
  return nextDay.getDate() +
    "-" +
    nextDay.getMonth() +
    "-" +
    nextDay.getFullYear();
}

