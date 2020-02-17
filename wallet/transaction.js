const uuid = require('uuid/v1');
const { verifySignature } = require('../util');

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        this.id = uuid();
        this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    static validTransaction(transaction) {

        const { input: { address, amount, signature }, outputMap } = transaction;

        const outputTotal = Object.values(outputMap)
                                  .reduce((total, outputAmount) => total + outputAmount);

        // CHECKS THE AMOUNT OF THE OUTPUT MAP
        if (amount !== outputTotal) {
            console.error(`Ivalid Transaction from ${address}`);
            return false;
        }

        // CHECKS THE SIGNATURE OF THE WALLET ADDRESS
        if (!verifySignature({ publicKey: address,  data: outputMap, signature })) {
            console.error(`Ivalid signature from ${address}`);
            return false;
        }

        return true;
    }
}

module.exports = Transaction;
