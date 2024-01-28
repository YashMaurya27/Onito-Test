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
    if (code.includes('_')) {
        let wordArr = code.split('_');
        wordArr = wordArr.map((word) => {
            word = word.charAt(0).toLocaleUpperCase() + word.slice(1);
            return word;
        });
        return wordArr.join(' ');
    } else {
        let words = [];
        let currentWord = '';
        for (let char of code) {
            if (char.toUpperCase() === char && currentWord.length > 0) {
                words.push(currentWord);
                currentWord = char;
            } else {
                currentWord += char;
            }
        }
        words.push(currentWord);
        let titleCaseString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return titleCaseString;
    }
};