const npz_loader = require('../src');

const getval = async function () {
    console.time('load');
    const a = await npz_loader.load('test/mat.npz');
    console.timeEnd('load');
    return a;
};

getval().then((model) => {
    const result = {
        user: {},
        placement: {},
        ad: {},
        userPlacement: {},
        userAd: {},
        placementAd: {},
    };

    function createNormalScore(dimension, destination) {
        const timeKey = `normal:${dimension}`;
        console.time(timeKey);
        for (
            let index = 0;
            index < model[`vocab_${dimension}`].length;
            index++
        ) {
            const element = model[`vocab_${dimension}`][index];
            destination[element] = model[dimension][index];
        }
        console.timeEnd(timeKey);
    }

    createNormalScore('user', result.user);
    createNormalScore('position', result.placement);
    createNormalScore('ad', result.ad);

    function createInteractiveScore(rowDimension, colDimension, destination) {
        const timeKey = `interactive:${rowDimension}__${colDimension}`;
        console.time(timeKey);
        const indices = model[`indices__${rowDimension}__${colDimension}`];
        let currentPtrIndex = 0;
        let row = -1;
        for (let index = 0; index < indices.length; index++) {
            if (
                index ==
                model[`indptr__${rowDimension}__${colDimension}`][
                    currentPtrIndex
                ]
            ) {
                row++;
                currentPtrIndex++;
            }
            const col = indices[index];

            const rowValue = model[`vocab_${rowDimension}`][row];
            const colValue = model[`vocab_${colDimension}`][col];

            destination[`${rowValue}:${colValue}`] =
                model[`data__${rowDimension}__${colDimension}`][index];
        }
        console.timeEnd(timeKey);
    }

    createInteractiveScore('user', 'position', result.userPlacement);
    createInteractiveScore('user', 'ad', result.userAd);
    createInteractiveScore('position', 'ad', result.placementAd);
});
