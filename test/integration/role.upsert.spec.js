'use strict';


/* dependencies */
const faker = require('@benmaruchu/faker');
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Permission } = require('@lykmapipo/permission');
const { Role } = include(__dirname, '..', '..');


describe('Role Upsert', () => {

  let role;

  before((done) => clear(done));

  before((done) => clear(done));

  before((done) => {
    Permission.seed(done);
  });

  beforeEach((done) => {
    role = Role.fakeExcept('description');
    role.post((error, created) => {
      role = created;
      done(error, created);
    });
  });

  it('should be able upsert non existing', (done) => {
    Role.upsert(role, (error, upserted) => {
      expect(error).to.not.exist;
      expect(upserted).to.exist;
      expect(upserted._id).to.be.eql(role._id);
      expect(upserted.name).to.be.eql(role.name);
      done(error, upserted);
    });
  });

  it('should be able upsert existing by _id', (done) => {
    const updates = {
      _id: role._id,
      description: faker.lorem.sentence()
    };
    Role.upsert(updates, (error, upserted) => {
      expect(error).to.not.exist;
      expect(upserted).to.exist;
      expect(upserted._id).to.be.eql(role._id);
      expect(upserted.name).to.be.eql(role.name);
      expect(upserted.description).to.not.be.eql(role.description);
      expect(upserted.description).to.be.eql(updates.description);
      expect(upserted.createdAt).to.be.eql(role.createdAt);
      done(error, upserted);
    });
  });

  it('should be able upsert existing by fields', (done) => {
    const updates = {
      name: role.name,
      description: faker.lorem.sentence()
    };
    Role.upsert(updates, (error, upserted) => {
      expect(error).to.not.exist;
      expect(upserted).to.exist;
      expect(upserted._id).to.be.eql(role._id);
      expect(upserted.name).to.be.eql(role.name);
      expect(upserted.description).to.not.be.eql(role.description);
      expect(upserted.description).to.be.eql(updates.description);
      expect(upserted.createdAt).to.be.eql(role.createdAt);
      done(error, upserted);
    });
  });

  it('should be able upsert Administrator with permissions', (done) => {
    const updates = {
      name: 'Administrator',
      description: faker.lorem.sentence()
    };
    Role.upsert(updates, (error, upserted) => {
      expect(error).to.not.exist;
      expect(upserted).to.exist;
      expect(upserted.name).to.be.eql('Administrator');
      expect(upserted.permissions).to.exist;
      expect(upserted.permissions).to.have.length.at.least(1);
      done(error, upserted);
    });
  });

  after((done) => clear(done));

  after((done) => clear(done));

});
