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
 * @see {@link https://en.wikipedia.org/wiki/Role-based_access_control}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */


/* dependencies */
const path = require('path');
const _ = require('lodash');
const { waterfall, parallel } = require('async');
const { abbreviate } = require('@lykmapipo/common');
const { getString, getStrings } = require('@lykmapipo/env');
const { Schema, ObjectId } = require('@lykmapipo/mongoose-common');
const { model, SCHEMA_OPTIONS } = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const { Permission } = require('@lykmapipo/permission');


/* constants */
const ROLE_MODEL_NAME = getString('ROLE_MODEL_NAME', 'Role');
const ROLE_COLLECTION_NAME = getString('ROLE_COLLECTION_NAME', 'roles');
const ROLE_SEED = getString('ROLE_SEED', 'roles');
const ADMINISTRATOR_ROLE_NAME =
  getString('ADMINISTRATOR_ROLE_NAME', 'Administrator');
const POPULATION_MAX_DEPTH = 1;
const OPTION_AUTOPOPULATE = ({
  select: { name: 1, description: 1 },
  maxDepth: POPULATION_MAX_DEPTH
});


/**
 * @name RoleSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
const RoleSchema = new Schema({
  /**
   * @name name
   * @description Unique human readable name of a role.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} required - mark required
   * @property {boolean} trim - force trimming
   * @property {number} minlength - ensure not empty
   * @property {boolean} index - ensure database index
   * @property {boolean} unique - ensure unique database index
   * @property {boolean} searchable - allow for searching
   * @property {boolean} taggable - allow field use for tagging
   * @property {object} fake - fake data generator options
   *
   * @author lally elias <lallyelias87@gmail.com>
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   * @example
   * Administrator, Accountant etc.
   */
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    index: true,
    unique: true,
    searchable: true,
    taggable: true,
    exportable: true,
    fake: {
      generator: 'hacker',
      type: 'noun'
    },
  },


  /**
   * @name abbreviation
   * @description Human readable short form of a role.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {boolean} taggable - allow field use for tagging
   * @property {object} fake - fake data generator options
   *
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   * @example
   * WEO.
   */
  abbreviation: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    taggable: true,
    exportable: true,
    fake: {
      generator: 'hacker',
      type: 'abbreviation'
    }
  },


  /**
   * @name description
   * @description A brief summary about a role if available i.e
   * additional details that clarify what a role for.
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {boolean} trim - force trimming
   * @property {boolean} index - ensure database index
   * @property {boolean} searchable - allow for searching
   * @property {object} fake - fake data generator options
   *
   * @author lally elias <lallyelias87@gmail.com>
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  description: {
    type: String,
    trim: true,
    index: true,
    searchable: true,
    fake: {
      generator: 'lorem',
      type: 'sentence'
    }
  },


  /**
   * @name permissions
   * @description List of defined permits(access rights) of a role
   *
   * @type {object}
   * @property {object} type - schema(data) type
   * @property {string} ref - referenced collection
   * @property {object} default - default value if non provided
   * @property {boolean} exists - ensure ref exists before save
   * @property {boolean} index - ensure database index
   * @property {object} autopopulate - jurisdiction population options
   * select when populating
   *
   * @author lally elias <lallyelias87@gmail.com>
   * @since 0.1.0
   * @version 0.1.0
   * @instance
   */
  permissions: {
    type: [ObjectId],
    ref: Permission.MODEL_NAME,
    default: undefined,
    index: true,
    exists: true,
    autopopulate: true
  }

}, SCHEMA_OPTIONS);


/*
 *------------------------------------------------------------------------------
 *  Hooks
 *------------------------------------------------------------------------------
 */


/**
 * @name validate
 * @function validate
 * @description role schema pre validation hook
 * @param {function} done callback to invoke on success or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
RoleSchema.pre('validate', function (done) {

  this.preValidate(done);

});


/*
 *------------------------------------------------------------------------------
 *  Instance
 *------------------------------------------------------------------------------
 */


/**
 * @name preValidate
 * @description role schema pre validation hook logic
 * @param {function} done callback to invoke on success or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
RoleSchema.methods.preValidate = function preValidate(done) {

  //ensure role abbreviation
  this.abbreviation = (_.trim(this.abbreviation) || abbreviate(this.name));

  //ensure description
  this.description = (_.trim(this.description) || this.name);

  //ensure permissions
  this.permissions =
    (_.isEmpty(this.permissions) ? undefined : this.permissions);

  done();

};


/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */


/* static constants */
RoleSchema.statics.MODEL_NAME = ROLE_MODEL_NAME;
RoleSchema.statics.COLLECTION_NAME = ROLE_COLLECTION_NAME;
RoleSchema.statics.ADMINISTRATOR_ROLE_NAME = ADMINISTRATOR_ROLE_NAME;
RoleSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;


/**
 * @name upsert
 * @function upsert
 * @description upsert role
 * @param {role} role valid role details
 * @param {function} done callback to invoke on success or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
RoleSchema.statics.upsert = function upsert(role, done) {
  //normalize arguments
  const _role =
    (_.isFunction(role.toObject) ? role.toObject() : role);

  //refs
  const Role = this;

  //upsert
  waterfall([
    function findExistingRole(next) {
      let criteria = _.merge({}, _role);
      criteria = (
        criteria._id ?
        _.pick(criteria, '_id') :
        _.pick(criteria, 'name')
      );
      Role.findOne(criteria, next);
    },

    function upsertRole(found, next) {
      //instantiate if not found
      if (!found) {
        found = new Role(_role);
      }

      //upsert
      found.updatedAt = new Date();
      found.put(_role, next);
    },

    function setPermissions(role, next) { //TODO refactor
      // assign administrator all permissions
      if (role.name === ADMINISTRATOR_ROLE_NAME) {
        Permission
          .find()
          .select({ _id: 1 })
          .exec(function (error, permissions) {
            role.permissions = [].concat(permissions);
            role.put(next);
          });
      } else {
        next(null, role);
      }
    }
  ], done);
};


/**
 * @name seed
 * @function seed
 * @description seed roles into database. On duplicate last changes will
 * override existing one.
 * @param {Role[]} [roles] set of permission(s) to seed
 * @param {function} done callback to invoke on success or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @public
 */
RoleSchema.statics.seed = function seed(seeds, done) {
  //normalize arguments
  let _seeds = _.isFunction(seeds) ? [] : [].concat(seeds);
  const _done = _.isFunction(seeds) ? seeds : done;

  //obtain .env roles to seed
  let ROLE_SEEDS = getStrings('ROLE_SEEDS');
  ROLE_SEEDS =
    _.uniq(_.compact([].concat(ADMINISTRATOR_ROLE_NAME).concat(ROLE_SEEDS)));

  //refs
  const Role = this;

  //prepare roles
  let roles = _.map(ROLE_SEEDS, function (role) {
    return {
      name: role,
      description: role
    };
  });

  //merge provided roles
  _seeds = _.map([].concat(_seeds), function (_seed) {
    const __seed = (
      _.isString(_seed) ? { name: _seed, description: _seed } : _seed
    );
    return __seed;
  });

  // try load seeds from environment
  const BASE_PATH = getString('BASE_PATH', process.cwd());
  const SEEDS_PATH = getString('SEEDS_PATH', path.join(BASE_PATH, 'seeds'));
  const SEED_PATH = path.join(SEEDS_PATH, ROLE_SEED);
  try {
    const seed = require(SEED_PATH);
    _seeds = [].concat(_seeds).concat(seed);
  } catch (e) { /* ignore */ }

  // collect unique roles from seeds
  _seeds = _.compact(_seeds);
  _seeds = _.uniqWith(_seeds, _.isEqual);

  //upsert roles
  roles = [].concat(roles).concat(_seeds);
  roles = _.map(roles, function (role) {
    return function upsertRoles(next) {
      Role.upsert(role, next);
    };
  });

  //seed roles
  parallel(roles, _done);

};


/*
 *------------------------------------------------------------------------------
 * Plugins
 *------------------------------------------------------------------------------
 */


/* plug mongoose rest actions*/
RoleSchema.plugin(actions);
RoleSchema.plugin(exportable);


/* export role model */
module.exports = model(ROLE_MODEL_NAME, RoleSchema);
