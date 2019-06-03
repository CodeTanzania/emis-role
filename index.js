'use strict';

/**
 * @module Role
 * @name Role
 * @description A representation on how a party(or stakeholder) acts or,
 * in other words, what role party(or stakeholder) plays in event of
 * emergency(or disaster).
 *
 * It defines set of permissions(or access rights) and responsibilities that
 * are applicable to a specific party(ies).
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @licence MIT
 * @since  0.1.0
 * @version 0.1.0
 * @example
 *
 * const { app } = require('@lykmapipo/role');
 * app.start();
 *
 */

/* dependencies */
const { pkg } = require('@lykmapipo/common');
const { include } = require('@lykmapipo/include');
const { apiVersion } = require('@lykmapipo/env');
const { app, mount } = require('@lykmapipo/express-common');
const { Permission, permissionRouter } = require('@lykmapipo/permission');
const Role = include(__dirname, 'lib', 'role.model');
const roleRouter = include(__dirname, 'lib', 'role.http.router');

/**
 * @name info
 * @description package information
 * @type {Object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */
exports.info = pkg(
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
);

/**
 * @name Permission
 * @description Permission model
 * @type {mongoose.Model}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
exports.Permission = Permission;

/**
 * @name Role
 * @description Role model
 * @type {mongoose.Model}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
exports.Role = Role;

/**
 * @name permissionRouter
 * @description permission http router
 * @type {express.Router}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
exports.permissionRouter = permissionRouter;

/**
 * @name roleRouter
 * @description role http router
 * @type {express.Router}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
exports.roleRouter = roleRouter;

/**
 * @name apiVersion
 * @description http router api version
 * @type {String}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
exports.apiVersion = apiVersion();

/**
 * @name app
 * @description express app
 * @type {Object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
Object.defineProperty(exports, 'app', {
  get() {
    /* @todo bind oauth middlewares authenticate, token, authorize */
    mount(permissionRouter);
    mount(roleRouter);
    return app;
  },
});
