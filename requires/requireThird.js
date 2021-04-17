// 3
// Input: https://corona.lmao.ninja/v2/jhucsse
// Output: Total of confirmed, deaths, recovered worldwide
// Format:
/*
    {  "confirmed": x,
      "deaths": y,
      "recovered": z
    }
 */

// totalDeaths = await result.reduce((total, value) => {
//   return (total += value["stats"]["deaths"]);
// }, 0);
// totalConfirmed = await result.reduce((total, value) => {
//   return (total += value["stats"]["confirmed"]);
// }, 0);
// totalRecovered = await result.reduce((total, value) => {
//   return (total += value["stats"]["recovered"]);
// }, 0);
import fetch from "cross-fetch";

const linkApi = "https://corona.lmao.ninja/v2/jhucsse";
const getData = async (link) => {
  let totalConfirmed = 0;
  let totalDeaths = 0;
  let totalRecovered = 0;
  let arrGetData = [];

  try {
    const res = await fetch(link);
    const result = await res.json();
    const arr = result.reduce((total, value) => {
      return [
        (totalConfirmed += value["stats"]["confirmed"]),
        (totalDeaths += value["stats"]["deaths"]),
        (totalRecovered += value["stats"]["recovered"]),
      ];
    });
    const arrGetData = [
      { confirmed: arr[0] },
      { deaths: arr[1] },
      { recovered: arr[2] },
    ];
    console.log(arrGetData);
  } catch (err) {
    console.error(err);
  }
};
getData(linkApi);
