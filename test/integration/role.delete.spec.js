'use strict';


/* dependencies */
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Role } = include(__dirname, '..', '..');

describe('Role Delete', () => {

  before((done) => clear(done));

  describe('static delete', () => {
    let role;

    before((done) => {
      role = Role.fake();
      role.post((error, created) => {
        role = created;
        done(error, created);
      });
    });

    it('should be able to delete', (done) => {
      Role.del(role._id, (error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(role._id);
        done(error, deleted);
      });
    });

    it('should throw if not exists', (done) => {
      Role.del(role._id, (error, deleted) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(deleted).to.not.exist;
        done();
      });
    });

  });

  describe('instance delete', () => {
    let role;

    before((done) => {
      role = Role.fake();
      role.post((error, created) => {
        role = created;
        done(error, created);
      });
    });

    it('should be able to delete', (done) => {
      role.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(role._id);
        done(error, deleted);
      });
    });

    it('should throw if not exists', (done) => {
      role.del((error, deleted) => {
        expect(error).to.not.exist;
        expect(deleted).to.exist;
        expect(deleted._id).to.eql(role._id);
        done();
      });
    });

  });

  after((done) => clear(done));

});
