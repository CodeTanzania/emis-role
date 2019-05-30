'use strict';


/* dependencies */
const _ = require('lodash');
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Role } = include(__dirname, '..', '..');

describe('Role Patch', () => {

  before((done) => clear(done));

  describe('static patch', () => {

    let role = Role.fake();

    before((done) => {
      role.post((error, created) => {
        role = created;
        done(error, created);
      });
    });

    it('should be able to patch', (done) => {
      role = role.fakeOnly('description', 'abbreviation');
      Role.patch(role._id, role, (error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(role._id);
        expect(updated.name).to.eql(role.name);
        expect(updated.abbreviation).to.be.eql(role.abbreviation);
        done(error, updated);
      });
    });

    it('should throw if not exists', (done) => {
      const fake = Role.fake().toObject();
      Role.patch(fake._id, _.omit(fake, '_id'), (error, updated) => {
        expect(error).to.exist;
        // expect(error.status).to.exist;
        expect(error.name).to.be.equal('DocumentNotFoundError');
        expect(updated).to.not.exist;
        done();
      });
    });

  });

  describe('instance patch', () => {

    let role = Role.fake();

    before((done) => {
      role.post((error, created) => {
        role = created;
        done(error, created);
      });
    });

    it('should be able to patch', (done) => {
      role = role.fakeOnly('description', 'abbreviation');
      role.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(role._id);
        expect(updated.name).to.eql(role.name);
        expect(updated.abbreviation).to.be.eql(role.abbreviation);
        done(error, updated);
      });
    });

    it('should throw if not exists', (done) => {
      role.patch((error, updated) => {
        expect(error).to.not.exist;
        expect(updated).to.exist;
        expect(updated._id).to.eql(role._id);
        done();
      });
    });

  });

  after((done) => clear(done));

});
