'use strict';


/* ensure mongodb uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/emis-role');


/* dependencies */
const path = require('path');
const _ = require('lodash');
const async = require('async');
const mongoose = require('mongoose');
const faker = require('@benmaruchu/faker');
const { getStrings } = require('@lykmapipo/env');
const {
  Role,
  info,
  app
} = require(path.join(__dirname, '..'));


/* establish mongodb connection */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


function boot() {

  async.waterfall([

    function clear(next) {
      Role.deleteMany(function ( /*error, results*/ ) {
        next();
      });
    },

    function seedRole(next) {
      let roles = [
        'Region Disaster Committee',
        'District Disaster Committee',
        'Ward Disaster Committee',
        'Village Disaster Committee',
        'Ward Executive Officer',
        'Village Executive Officer'
      ];
      roles = _.map(roles, function (role) {
        return {
          name: role,
          responsibilities: faker.lorem.sentences(4, ';').split(';')
        };
      });
      Role.seed(roles, next);
    }

  ], function (error, results) {

    /* expose module info */
    app.get('/', function (request, response) {
      response.status(200);
      response.json(info);
    });

    /* fire the app */
    app.start(function (error, env) {
      console.log(`visit http://0.0.0.0:${env.PORT}`);
    });

  });

}

boot();
