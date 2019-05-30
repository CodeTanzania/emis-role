'use strict';

/* dependencies */
const path = require('path');
const _ = require('lodash');
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Role } = include(__dirname, '..', '..');

describe('Role Seed', () => {
  const SEEDS_PATH = process.env.SEEDS_PATH;

  before(done => clear(done));

  before(() => {
    process.env.SEEDS_PATH = path.join(__dirname, '..', 'fixtures');
  });

  it('should be able to seed', done => {
    Role.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if seed exist', done => {
    Role.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = { name: 'IT Officer' };
    Role.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, seed)).to.exist;
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = { name: 'IT Officer' };
    Role.seed([seed], (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, seed)).to.exist;
      done(error, seeded);
    });
  });

  it('should not throw if provided exist', done => {
    const seed = { name: 'IT Officer' };
    Role.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, seed)).to.exist;
      done(error, seeded);
    });
  });

  it('should seed .env resources', done => {
    process.env.ROLE_SEEDS = 'IT Officer,Billing Officer';
    Role.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, { name: 'IT Officer' })).to.exist;
      expect(_.find(seeded, { name: 'Billing Officer' })).to.exist;
      done(error, seeded);
    });
  });

  it('should be able to seed from environment', done => {
    Role.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, { name: 'Supervisor' })).to.exist;
      done(error, seeded);
    });
  });

  it('should not throw if seed from environment exist', done => {
    Role.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      expect(_.find(seeded, { name: 'Supervisor' })).to.exist;
      done(error, seeded);
    });
  });

  after(done => clear(done));

  after(() => {
    process.env.SEEDS_PATH = SEEDS_PATH;
  });
});
