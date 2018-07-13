// dependencies
const mongoose = require('mongoose');
const uuid = require('uuid-v4');

// libs
const { encryptString } = require('../utils/common');

const userSchema = new mongoose.Schema({
// avatar, nombre, email, password
  name: String,
  email: String,
  password: String,
  token: String,
  avatar: String,

  user_type: {
    type: String,
    enum: ['administrador', 'customer'],
    default: 'customer',
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});


userSchema.statics.validateBody = function validateBody(body) {
  const requiredFields = 'name email password password_confirmation user_type'.split(' ');
  const regExpEmail = new RegExp('[^@]+@[^@]+.[^@]+');
  // const regExpEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const errors = requiredFields.reduce((acc, requiredField) => (
    (!body[requiredField] && acc.concat([{
      code: 'MissingField',
      description: `Missing field ${requiredField}`,
    }])) || acc
  ), []);

  // should be a valid email
  if (body.email && !regExpEmail.test(body.email)) {
    errors.push({
      code: 'InvalidEmail',
      description: 'Email entered is not valid.',
    });
  }

  // validate password should be in the body and have to be plus long 6
  if (body.password && body.password.length <= 6) {
    errors.push({
      code: 'InvalidPassword',
      description: 'Password must be at least 6 characters.',
    });
  }

  // password must match the password confirmation
  if (body.password && body.password_confirmation && body.password !== body.password_confirmation) {
    errors.push({
      code: 'InvalidConfirmationPassword',
      description: 'Password must match the confirmation.',
    });
  }

  return errors.length ? Promise.reject({
    error: errors,
  }) :

    this.findOne({ email: body.email })

      .then(user => (
        user ? Promise.reject({
          error: [{
            code: 'UserAlreadyExists',
            description: 'Email is already registered.',
          }],
        }) : Promise.resolve(body)
      ));
};

/**
 * Hooks
 */
userSchema.pre('save', function preSave(next) {
  // generar token
  // encriptar la contraseña
  // modificar el updated_at
  if (this.isNew) {
    return Promise.all([
      encryptString(this.password),
      encryptString(uuid()),
    ])

      .then(([password, token]) => {
        this.password = password;
        this.token = token;
        return next();
      });
  }

  this.updated_at = Date.now();
  return next();
});

module.exports = mongoose.model('users', userSchema);
