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

  it('First execution', async () => {
    const result = await trigger.process.bind(self)({}, {});
    expect(result).to.be.undefined;
    expect(self.emit.called).to.be.true;
    const call = self.emit.getCall(0);
    const { body } = call.args[1];
    expect(body.lastPoll.startsWith('1970-01-01T00:00:00')).to.be.true;
    expect(body.fireTime).to.be.withinDate(new Date(0), new Date());
  });
  it('Recurrent execution', async () => {
    const snapshot = {
      lastPoll: new Date('01-01-2017Z').toISOString(),
    };
    const result = await trigger.process.bind(self)({}, {}, snapshot);
    expect(result).to.be.undefined;
    expect(self.emit.called).to.be.true;
    const call = self.emit.getCall(0);
    const { body } = call.args[1];
    expect(body.lastPoll).to.equal(new Date('01-01-2017Z').toISOString());
    expect(body.fireTime).to.be.withinDate(new Date(0), new Date());
  });
  describe('Time fields validation', async () => {
    it('Start time is not valid', async () => {
      const cfg = {
        startTime: 'not a date',
      };
      try {
        await trigger.process.call(self, {}, cfg);
      } catch (error) {
        expect(error.message).to.equal('Date not a date must be in ISO format (1970-01-01T00:00:00.000Z)');
      }
    });
    it('End time is not valid', async () => {
      const cfg = {
        endTime: 'not a date',
      };
      try {
        await trigger.process.call(self, {}, cfg);
      } catch (error) {
        expect(error.message).to.equal('Date not a date must be in ISO format (1970-01-01T00:00:00.000Z)');
      }
    });
    it('Start time is greater than end time', async () => {
      const cfg = {
        startTime: '2023-01-01T00:00:00.000Z',
        endTime: '2022-01-01T00:00:00.000Z',
      };
      try {
        await trigger.process.call(self, {}, cfg);
      } catch (error) {
        expect(error.message).to.equal('"Start Time" must be less than "End Time"');
      }
    });
    it('Start time is greater than now', async () => {
      const cfg = {
        startTime: '2036-01-01T00:00:00.000Z',
      };
      await trigger.process.call(self, {}, cfg);
      expect(self.emit.callCount).to.be.equal(0);
    });
    it('End time is less than now', async () => {
      const cfg = {
        endTime: '2020-01-01T00:00:00.000Z',
      };
      await trigger.process.call(self, {}, cfg);
      expect(self.emit.callCount).to.be.equal(0);
    });
  });
});
