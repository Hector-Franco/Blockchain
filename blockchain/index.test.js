const Blockchain = require('./index');
const Block = require('./block');
const { cryptoHash } = require('../util');

describe('Blockchain', () => {

    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it('Contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('Starts with the Genesys Block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('Adds a new Block to the chain', () => {
        const newData = 'NEW DATA';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('When the chain does NOT start with the Genesys Block', () => {
            it('return false', () => {
                blockchain.chain[0] = { data: 'FAKE-GENESYS' };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('When the chain starts with the Genesys Block, and has multiple Blocks', () => {

            beforeEach(() => {
                blockchain.addBlock({ data: 'BEARS' });
                blockchain.addBlock({ data: 'BARES' });
                blockchain.addBlock({ data: 'BIRRAS' });
            });

            describe('and a lastHast reference has changed', () => {
                it('returns false', () => {

                    blockchain.chain[2].lastHash = 'BROKEN-LAST_HASH';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains an invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[1].data = 'BAD-DATA';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    const badBlock = new Block({timestamp, data, hash, lastHash, nonce, difficulty});

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does NOT contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        describe('when the chain is NOT longer', () => {
            it('Does NOT replace the chain', () => {
                newChain.chain[0] = {new: 'Chain'};

                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(originalChain);
            });
        });

        describe('when the chain IS longer', () => {

            beforeEach(() => {
                newChain.addBlock({ data: 'BEARS' });
                newChain.addBlock({ data: 'BARES' });
                newChain.addBlock({ data: 'BIRRAS' });
            });

            describe('and the chain is NOT valid', () => {
                it('Does NOT replace the chain', () => {
                    newChain.chain[3].hash = 'INVALID-HASH';
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe('and the chain IS valid', () => {
                it('replaces the chain', () => {
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});