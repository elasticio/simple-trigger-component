const chai = require('chai');
chai.use(require('chai-datetime'));

const { expect } = require('chai');

const utils = require('../../../lib/utils/utils');

describe('Utils', async () => {
  describe('validateISODate', async () => {
    it('valid date should pass', async () => {
      const validDate = '2023-06-23T10:30:00.000Z';
      utils.validateISODate(validDate);
    });
    it('invalid date should fail', async () => {
      const blablaDate = 'asdf';
      try {
        utils.validateISODate(blablaDate);
      } catch (error) {
        expect(error.message).to.equal('Date asdf must be in ISO format (1970-01-01T00:00:00.000Z)');
      }
    });
  });

  describe('newMessageWithBody', () => {
    it('should create a valid message object', () => {
      const body = { foo: 'bar' };
      const result = utils.newMessageWithBody(body);
      expect(result).to.have.property('id');
      expect(result.id).to.match(/^[0-9a-f-]{36}$/); // Basic UUID format check
      expect(result).to.have.property('attachments').that.is.an('object').and.empty;
      expect(result).to.have.property('body').that.deep.equals(body);
      expect(result).to.have.property('headers').that.is.an('object').and.empty;
      expect(result).to.have.property('metadata').that.is.an('object').and.empty;
    });
  });
});
