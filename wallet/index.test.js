const Wallet = require('./index');
const { verifySignature } = require('../util');
const Transaction = require('./transaction');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('Has a `balance` property', () => expect(wallet).toHaveProperty('balance'));

    it('Has a `publicKey` property', () => expect(wallet).toHaveProperty('publicKey'));

    describe('Signing data', () => {
        const data = 'FOO-DATA';

        it('Verifies a VALID signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    signature: wallet.sign(data),
                    data
                })
            ).toBe(true);
        });

        it('Does NOT verify an INVALID signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    signature: new Wallet().sign(data),
                    data
                })
            ).toBe(false);
        });
    });

    describe('createTransaction()', () => {
        describe('and the amount exceeds the the balance', () => {
            it('Throws an error', () => {
                expect(() => wallet.createTransaction({ amount: 99999, recipient: 'FOO-RECIPIENT' }))
                                   .toThrow('Amount exceeds the balance');
            });
        });

        describe('and the amount is valid', () => {

            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'FOO-RECIPIENT';
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it('creates an instance of `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('Matches the transaction input with the wallet`', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('Outputs the amount the recipient`', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });
});