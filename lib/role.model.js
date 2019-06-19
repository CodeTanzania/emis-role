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
const _ = require('lodash');
const { abbreviate } = require('@lykmapipo/common');
const { getString } = require('@lykmapipo/env');
const {
  Schema,
  ObjectId,
  copyInstance,
} = require('@lykmapipo/mongoose-common');
const { model, SCHEMA_OPTIONS } = require('@lykmapipo/mongoose-common');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const { Permission } = require('@lykmapipo/permission');

/* constants */
const ROLE_MODEL_NAME = getString('ROLE_MODEL_NAME', 'Role');
const ROLE_COLLECTION_NAME = getString('ROLE_COLLECTION_NAME', 'roles');
const ADMINISTRATOR_ROLE_NAME = getString(
  'ADMINISTRATOR_ROLE_NAME',
  'Administrator'
);
const POPULATION_MAX_DEPTH = 1;
const OPTION_AUTOPOPULATE = {
  select: { name: 1, description: 1 },
  maxDepth: POPULATION_MAX_DEPTH,
};

/**
 * @name RoleSchema
 * @type {Schema}
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
const RoleSchema = new Schema(
  {
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
        type: 'noun',
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
        type: 'abbreviation',
      },
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
        type: 'sentence',
      },
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
      autopopulate: true,
    },
  },
  SCHEMA_OPTIONS
);

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
RoleSchema.pre('validate', function(done) {
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
  this.abbreviation = _.trim(this.abbreviation) || abbreviate(this.name);

  //ensure description
  this.description = _.trim(this.description) || this.name;

  //ensure permissions
  this.permissions = _.isEmpty(this.permissions) ? undefined : this.permissions;

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
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description prepare role seeding upsert criteria
 * @param {Object} seed plain object role seed
 * @return {Object} criteria used to upsert role
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.5.0
 * @version 0.1.0
 * @public
 */
RoleSchema.statics.prepareSeedCriteria = seed => {
  // prepare role upsert criteria by _id or fields
  let criteria = copyInstance(seed);
  criteria = criteria._id ? _.pick(criteria, '_id') : _.pick(criteria, 'name');
  // return role upsert criteria
  return criteria;
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
