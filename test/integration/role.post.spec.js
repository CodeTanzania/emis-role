'use strict';

/* dependencies */
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Role } = include(__dirname, '..', '..');

describe('Role Post', () => {
  before(done => clear(done));

  describe('static post', () => {
    let role = Role.fake();

    it('should be able to post', done => {
      Role.post(role, (error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(role._id);
        expect(created.name).to.exist;
        done(error, created);
      });
    });
  });

  describe('instance post', () => {
    let role = Role.fake();

    it('should be able to post', done => {
      role.post((error, created) => {
        expect(error).to.not.exist;
        expect(created).to.exist;
        expect(created._id).to.eql(role._id);
        expect(created.name).to.exist;
        done(error, created);
      });
    });
  });

  after(done => clear(done));
});
