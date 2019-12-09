const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-datetime'));
const { expect } = chai;
const logger = require('@elastic.io/component-logger')();

const trigger = require('../../lib/trigger.js');

describe('Simple trigger', () => {

    let self;

    beforeEach(() => {
        self = {
            emit: sinon.spy(),
            logger,
        };
    });

    it('First execution', () => {

        return trigger.process.bind(self)({}, {})
            .then((result) => {
                expect(result).to.be.undefined;
                expect(self.emit.called).to.be.true;

                const call = self.emit.getCall(0);
                const body = call.args[1].body;

                expect(body.lastPoll.startsWith('1970-01-01T00:00:00')).to.be.true;
                expect(body.fireTime).to.be.withinDate(new Date(0), new Date());
            });
    });

    it('Recurrent execution', () => {
        const snapshot = {
            lastPoll: new Date("01-01-2017Z").toISOString()
        };

        return trigger.process.bind(self)({}, {}, snapshot)
            .then((result) => {
                expect(result).to.be.undefined;
                expect(self.emit.called).to.be.true;

                const call = self.emit.getCall(0);
                const body = call.args[1].body;

                expect(body.lastPoll).to.equal(new Date("01-01-2017Z").toISOString());
                expect(body.fireTime).to.be.withinDate(new Date(0), new Date());
            });

    });

});