const Block = require('./block');
const { cryptoHash } = require('../util');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.log(`The incoming chain MUST be LONGER`);
            return;
        } 

        if (!Blockchain.isValidChain(chain)) {
            console.log(`The incoming chain MUST be VALID`);
            return;
        } 

        this.chain = chain;
    }

    static isValidChain(chain) {
        // VALIDATES THE FIRST BLOCK IS THE GENESYS BLOCK
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        // VALIDADES THE REST OF THE BLOCKS 1...N
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];

            const currentLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            // VALIDATES THE LAST HASH OF THE CURRENT BLOCK
            if (lastHash !== currentLastHash) return false;
        
            const validateHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            // VALIDATES THE HASH OF THE CURRENT BLOCK
            if (hash !== validateHash) return false;

            // VALIDATES IF THE DIFFICULT JUMPS MORE THAN ONE 1
            if(Math.abs(lastDifficulty - difficulty) > 1) return false;
        }

        return true;
    }
}

module.exports = Blockchain;
