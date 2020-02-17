const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    const hashedFoo = '2C26B46B68FFC68FF99B453C1D30413413422D706483BFA0F98A5E886266E7AE';

    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('foo')).toEqual(hashedFoo);
    });

    it('produces the same HASH with the same input args in any order', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'one', 'three'));
    });
});