const messages = require('elasticio-node').messages;

async function simpleTrigger(msg, conf, snapshot = {}) {

    const now = new Date().getTime();

    const lastPoll = snapshot.lastPoll || new Date(0).toISOString();

    this.logger.info('Last polling Timestamp=%s', lastPoll);

    const newSnapshot = {
        lastPoll: new Date(now).toISOString()
    };

    const body = {
        fireTime: new Date(now),
        lastPoll
    };

    this.emit('data', messages.newMessageWithBody(body));
    this.emit('snapshot', newSnapshot);

    this.emit('end');
}

exports.process = simpleTrigger;
