// export const trimTitles = (text, length) => {
//     let trimmed = text.split(" ");
//     if(trimmed.length > length) {
//         trimmed = trimmed.splice(0, length).join(" ");
//     } else {
//         trimmed = trimmed.join(" ");
//     }
//     return trimmed;
// }

export const codeToTitle = (code: string) => {
  if (code.includes("_")) {
    let wordArr = code.split("_");
    wordArr = wordArr.map((word) => {
      word = word.charAt(0).toLocaleUpperCase() + word.slice(1);
      return word;
    });
    return wordArr.join(" ");
  } else {
    let words = [];
    let currentWord = "";
    for (let char of code) {
      if (char.toUpperCase() === char && currentWord.length > 0) {
        words.push(currentWord);
        currentWord = char;
      } else {
        currentWord += char;
      }
    }
    words.push(currentWord);
    let titleCaseString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return titleCaseString;
  }
};

export const BASE_URL = "https://restcountries.com/v3.1/";

export const GET = (
  endpoint: string,
  params: { [name: string]: string } = {},
  fullURL = false
) => {
  let url = "";
  if (!fullURL) {
    url = BASE_URL + endpoint;
  } else {
    url = endpoint;
  }
  const paramKeys = Object.keys(params);
  if (paramKeys.length > 0) {
    url += "?";
    Object.keys(params).forEach((item, index) => {
      url += item + "=" + params[item];
      if (index < paramKeys.length - 1) url += "&";
    });
  }
  return fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((e) => {
      return {
        success: true,
        message: "Data fetched",
        data: e,
      };
    })
    .catch((e) => {
      return { success: false, message: "Something went wrong", data: null };
    });
};
