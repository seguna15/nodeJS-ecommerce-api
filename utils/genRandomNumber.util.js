
const genRandomNumber = async () => {
    const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
    const randomNumbers = Math.floor(1000 + Math.random() * 90000);

    return randomTxt + randomNumbers
}

export default genRandomNumber;