const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}
class PubSub {
    constructor({ blockchain }) {

        this.blockchain = blockchain;

        // BROADCAST A MESSAGE TO A CHANNEL
        this.publisher = redis.createClient();

        // RECIEVES A MESSAGE FROM A CHANNEL
        this.subscriber = redis.createClient();

        // SUBSCRIBE TO ALL THE AVAILABLE CHANNEL
        this.subscribeToChannels();

        this.subscriber.on(
            'message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`Message received: Channel: ${channel}. | Message: ${message}`);

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) { 
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach((channel) => this.subscriber.subscribe(channel));
    }

    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }
}

module.exports = PubSub;
