'use strict';


/* dependencies */
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const Role = include(__dirname, '..', '..', 'lib', 'role.model');


describe('Role Instance', () => {

  it('`preValidate` should be a function', () => {
    const role = Role.fake();
    expect(role.preValidate).to.exist;
    expect(role.preValidate).to.be.a('function');
    expect(role.preValidate.length).to.be.equal(1);
    expect(role.preValidate.name).to.be.equal('preValidate');
  });

});

describe('Role Validations', () => {

  it('should throw if no name', (done) => {
    const role = Role.fakeOnly('description');
    role.validate((error) => {
      expect(error).to.exist;
      expect(error.name).to.equal('ValidationError');
      expect(error.errors.name).to.exist;
      expect(error.errors.name.name)
        .to.be.equal('ValidatorError');
      done();
    });
  });

  it('should throw if empty name', (done) => {
    const role = Role.fake();
    role.name = '';

    role.validate((error) => {
      expect(error).to.exist;
      expect(error.name).to.equal('ValidationError');
      expect(error.errors.name).to.exist;
      expect(error.errors.name.name)
        .to.be.equal('ValidatorError');
      done();
    });
  });

});

describe('Role Statics', () => {

  it('should expose model name', () => {
    expect(Role.MODEL_NAME).to.exist;
    expect(Role.MODEL_NAME).to.be.equal('Role');
  });

  it('should expose collection name', () => {
    expect(Role.COLLECTION_NAME).to.exist;
    expect(Role.COLLECTION_NAME).to.be.equal('roles');
  });

  it('should expose administrator role name', () => {
    expect(Role.ADMINISTRATOR_ROLE_NAME).to.exist;
    expect(Role.ADMINISTRATOR_ROLE_NAME).to.be.equal('Administrator');
  });

  it('should expose default role type', () => {
    expect(Role.DEFAULT_ROLE_TYPE).to.exist;
    expect(Role.DEFAULT_ROLE_TYPE).to.be.equal('System');
  });

  it('should expose role types', () => {
    expect(Role.ROLE_TYPES).to.exist;
    expect(Role.ROLE_TYPES).to.be.eql(['System', 'Assignable']);
  });

  it('should expose population options', () => {
    expect(Role.OPTION_AUTOPOPULATE).to.exist;
    expect(Role.OPTION_AUTOPOPULATE).to.be.eql({
      select: { name: 1, description: 1 },
      maxDepth: 1
    });
  });

});
