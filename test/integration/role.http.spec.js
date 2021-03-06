'use strict';

/* dependencies */
const request = require('supertest');
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Role, apiVersion, app } = include(__dirname, '..', '..');

describe('Role HTTP Spec', () => {
  before(done => clear(done));

  let role = Role.fake();

  before(done => {
    role.post((error, created) => {
      role = created;
      done(error, created);
    });
  });

  it('should handle HTTP GET on /roles', done => {
    request(app)
      .get(`/${apiVersion}/roles`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response).to.exist;

        //assert payload
        const result = response.body;
        expect(result.data).to.exist;
        expect(result.total).to.exist;
        expect(result.limit).to.exist;
        expect(result.skip).to.exist;
        expect(result.page).to.exist;
        expect(result.pages).to.exist;
        expect(result.lastModified).to.exist;

        done(error, response);
      });
  });

  it('should handle HTTP GET on /roles/id:', done => {
    request(app)
      .get(`/${apiVersion}/roles/${role._id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response).to.exist;

        const found = response.body;
        expect(found._id).to.exist;
        expect(found._id).to.be.eql(role._id.toString());
        expect(found.name).to.be.eql(role.name);

        done(error, response);
      });
  });

  it('should handle HTTP PATCH on /roles/id:', done => {
    const patch = role.fakeOnly('description');
    request(app)
      .patch(`/${apiVersion}/roles/${role._id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(patch)
      .expect(200)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;

        expect(updated._id).to.exist;
        expect(updated._id).to.be.eql(role._id.toString());
        expect(updated.name).to.be.eql(role.name);

        done(error, response);
      });
  });

  it('should handle HTTP PUT on /roles/id:', done => {
    const put = role.fakeOnly('description');
    request(app)
      .put(`/${apiVersion}/roles/${role._id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(put)
      .expect(200)
      .end((error, response) => {
        expect(error).to.not.exist;
        expect(response).to.exist;

        const updated = response.body;

        expect(updated._id).to.exist;
        expect(updated._id).to.be.eql(role._id.toString());
        expect(updated.name).to.be.eql(role.name);
        done(error, response);
      });
  });

  after(done => clear(done));
});
