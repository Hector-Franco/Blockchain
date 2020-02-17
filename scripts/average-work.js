const Blockcahin = require('../blockchain');

const blockchain = new Blockcahin();

blockchain.addBlock({ data: 'INITAL' });


let prevTimestamp,
    nextTimestamp,
    nextBlock,
    timeDiff,
    averageTime;

const times = [];

for (let i = 0; i < 10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    
    blockchain.addBlock({ data: `BLOCK: ${i}` });

    nextBlock = blockchain.chain[blockchain.chain.length - 1];

    nextTimestamp = nextBlock.timestamp;

    timeDiff = nextTimestamp - prevTimestamp;

    times.push(timeDiff);

    averageTime = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time to mine BLOCK:  ${timeDiff} ms.
                 Difficulty:   ${nextBlock.difficulty}.
                 Average time: ${averageTime} ms.
                 `);     
}
