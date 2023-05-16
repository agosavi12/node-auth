const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter a email'],
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Please enter correct email'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be 6 characters long'],
    },
  },
  { timestamps: true },
);

// fire a function after doc save to db
// UserSchema.post('save', function (doc, next) {
//   console.log('User is created and saved', doc);
//   next();
// });

// fire a function before doc create
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error('Incorrect Password');
  }

  throw Error('Incorrect Email');
};

module.exports = mongoose.model('User', UserSchema);
