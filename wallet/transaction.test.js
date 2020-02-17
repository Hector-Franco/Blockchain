const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util');

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'RECIPIENT-PUBLIC-KEY';
        amount = 50;

        transaction = new Transaction({ senderWallet, recipient, amount });
    });

    it('Has an `id` property', () => expect(transaction).toHaveProperty('id'));

    describe('outputMap', () => {

        it('has an `outputMap`', () =>  expect(transaction).toHaveProperty('outputMap'));

        it('Outputs an AMOUNT to the RECIPIENT', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('Outputs the remaining BALANCE to the SENDER WALLET', () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        });
    });

    describe('Input', () => {
        it('Has an `INPUT` property', () => {
            expect(transaction).toHaveProperty('input');
        });

        it('Has an `TIMESTAMP` property in the `INPUT`', () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('Sets the `AMOUNT` to the `senderWallet` balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('Sets the `ADDRESS` to the `senderWallet` publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('Signs the `INPUT`', () => {
            expect(
                verifySignature({ 
                    publicKey: senderWallet.publicKey,
                    signature: transaction.input.signature, 
                    data: transaction.outputMap
                })
            ).toBe(true);
        });
    });

    describe('validTransaction()', () => {

        let errorMock;

        beforeEach(() => {
            errorMock = jest.fn();
            global.console.error = errorMock;
        });
        
        describe('When the Transaction is VALID', () => {

            it('Returns true', () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });
        
        describe('When the Transaction is INVALID', () => {
            
            describe('And the Transaction outputMap value is invalid', () => {
                it('Returns false and logs an error', () => {

                    transaction.outputMap[senderWallet.publicKey] = 999999;
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            
            describe('And the Transaction input signature is invalid', () => {
                it('Returns false and logs an error', () => {

                    transaction.input.signature = new Wallet().sign('DATA');
                    expect(Transaction.validTransaction(transaction)).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });
});