const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-datetime'));

const { expect } = require('chai');
const logger = require('@elastic.io/component-logger')();

const trigger = require('../../lib/trigger');

describe('Simple trigger', async () => {
  let self;
  beforeEach(() => {
    self = {
      emit: sinon.spy(),
      logger,
    };
  });

  afterEach(() => {
    delete process.env.ELASTICIO_FLOW_TYPE;
  });

  it('First execution', async () => {
    const result = await trigger.process.bind(self)({}, {});
    expect(result).to.be.undefined;
    expect(self.emit.calledTwice).to.be.true;

    // Check data emission
    const dataCall = self.emit.getCall(0);
    expect(dataCall.args[0]).to.equal('data');
    const message = dataCall.args[1];
    expect(message).to.not.have.property('id');
    expect(message.body.lastPoll.startsWith('1970-01-01T00:00:00')).to.be.true;
    expect(message.body.fireTime).to.be.withinDate(new Date(0), new Date());

    // Check snapshot emission
    const snapshotCall = self.emit.getCall(1);
    expect(snapshotCall.args[0]).to.equal('snapshot');
    expect(snapshotCall.args[1]).to.have.property('lastPoll');
  });

  it('Recurrent execution', async () => {
    const lastPollDate = new Date('2023-01-01T00:00:00.000Z').toISOString();
    const snapshot = { lastPoll: lastPollDate };

    await trigger.process.call(self, {}, {}, snapshot);

    expect(self.emit.calledTwice).to.be.true;
    const { body } = self.emit.getCall(0).args[1];
    expect(body.lastPoll).to.equal(lastPollDate);
  });

  it('Execution with startTime in config', async () => {
    const startTime = '2023-06-01T10:00:00.000Z';
    const cfg = { startTime };

    await trigger.process.call(self, {}, cfg);

    const { body } = self.emit.getCall(0).args[1];
    expect(body.lastPoll).to.equal(startTime);
  });

  describe('Time fields validation', async () => {
    it('Start time is not valid', async () => {
      const cfg = { startTime: 'not a date' };
      try {
        await trigger.process.call(self, {}, cfg);
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).to.contain('must be in ISO format');
      }
    });

    it('End time is not valid', async () => {
      const cfg = { endTime: 'not a date' };
      try {
        await trigger.process.call(self, {}, cfg);
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).to.contain('must be in ISO format');
      }
    });

    it('Start time is greater than end time', async () => {
      const cfg = {
        startTime: '2023-01-01T00:00:00.000Z',
        endTime: '2022-01-01T00:00:00.000Z',
      };
      try {
        await trigger.process.call(self, {}, cfg);
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).to.equal('"Start Time" must be less than "End Time"');
      }
    });

    it('Start time is greater than now', async () => {
      const cfg = { startTime: '2050-01-01T00:00:00.000Z' };
      await trigger.process.call(self, {}, cfg);
      expect(self.emit.callCount).to.be.equal(0);
    });

    it('End time is less than now', async () => {
      const cfg = { endTime: '2020-01-01T00:00:00.000Z' };
      await trigger.process.call(self, {}, cfg);
      expect(self.emit.callCount).to.be.equal(0);
    });
  });

  describe('Debug mode', () => {
    beforeEach(() => {
      process.env.ELASTICIO_FLOW_TYPE = 'debug';
    });

    it('should throw error if startTime is in future in debug mode', async () => {
      const cfg = { startTime: '2050-01-01T00:00:00.000Z' };
      try {
        await trigger.process.call(self, {}, cfg);
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).to.contain('Start time" is greater then current time');
      }
    });

    it('should throw error if endTime is in past in debug mode', async () => {
      const cfg = { endTime: '2020-01-01T00:00:00.000Z' };
      try {
        await trigger.process.call(self, {}, cfg);
        throw new Error('Should have thrown');
      } catch (error) {
        expect(error.message).to.contain('End time" is less then current time');
      }
    });
  });
});
