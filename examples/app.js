'use strict';


/* ensure mongo uri */
process.env.MONGODB_URI =
  (process.env.MONGODB_URI || 'mongodb://localhost/emis-role');


/* dependencies */
const path = require('path');
const mongoose = require('mongoose');
const {
  Role,
  apiVersion,
  info,
  app
} = require(path.join(__dirname, '..'));


/* connect to mongoose */
mongoose.connect(process.env.MONGODB_URI);


Role.seed(( /*error, results*/ ) => {

  /* expose module info */
  app.get('/', (request, response) => {
    response.status(200);
    response.json(info);
  });

  /* fire the app */
  app.start((error, env) => {
    console.log(
      `visit http://0.0.0.0:${env.PORT}/v${apiVersion}/roles`
    );
  });

});
