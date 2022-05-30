const PlayerFactory = function ({ name, mark, image }) {
    let score = 0;

    const getName = () => name;
    const getMark = () => mark;
    const getImage = () => image;
    const getScore = () => score;
    const addScore = () => score++
    return {
        getName,
        getMark,
        getImage,
        getScore,
        addScore,
    }
};

export default PlayerFactory