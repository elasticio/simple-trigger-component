const { messages } = require('elasticio-node');
const util = require('./utils/utils');

const isDebugFlow = process.env.ELASTICIO_FLOW_TYPE === 'debug';

async function simpleTrigger(msg, cfg, snapshot = {}) {
  const now = new Date().getTime();
  this.logger.info('Trigger execution started');
  if (cfg.startTime) util.validateISODate(cfg.startTime);
  if (cfg.endTime) util.validateISODate(cfg.endTime);
  if (cfg.startTime && cfg.endTime) {
    if (new Date(cfg.startTime).getTime() > new Date(cfg.endTime).getTime()) {
      throw new Error('"Start Time" must be less than "End Time"');
    }
  }
  if (now < new Date(cfg.startTime).getTime()) {
    if (isDebugFlow) throw new Error('"Start time" is greater then current time, no messages will be produced. This error is only applicable to the Retrieve Sample. In flow executions there will be no error, executions will be skipped until Start Time becomes less than the current time.');
    this.logger.info(`Start time ${cfg.startTime} is in future. The current execution is skipped.`);
    return;
  }
  if (now > new Date(cfg.endTime).getTime()) {
    if (isDebugFlow) throw new Error('"End time" is less then current time, trigger will never produce messages');
    this.logger.info(`End time ${cfg.endTime} has been reached already. Further executions will be skipped.`);
    return;
  }
  const lastPoll = snapshot.lastPoll || cfg.startTime || new Date(0).toISOString();
  this.logger.info('Last polling timestamp=%s', lastPoll);
  const newSnapshot = {
    lastPoll: new Date(now).toISOString(),
  };
  const body = {
    fireTime: new Date(now),
    lastPoll,
  };
  await this.emit('data', messages.newMessageWithBody(body));
  await this.emit('snapshot', newSnapshot);
  this.logger.info('Message emitted. Execution finished.');
}

exports.process = simpleTrigger;
