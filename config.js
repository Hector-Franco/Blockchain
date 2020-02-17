const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: new Date(2000, 0, 1).getTime(),
    lastHash: '-----',
    hash: 'GENESIS HASH',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: ['PRIMER BLOQUE', 'BLOQUE GENESIS', 'ELECCIONES 2020']
};

const STARTING_BALANCE = 1000;

module.exports = {GENESIS_DATA, MINE_RATE, STARTING_BALANCE};
