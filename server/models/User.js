import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {
    approved: {
      type: Boolean,
      required: function () {
        return this.isAdmin || this.isDoctor;
      },
      default: false
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: Date.now()
    },
    name: {
      type: String
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined
    },
    passwordResetCode: {
      type: Number,
      default: undefined
    },
    avatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedCode: {
      type: Number
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    isDoctor: {
      type: Boolean,
      default: false
    },
    specialization: {
      type: String,
      required: function() {
        return this.isDoctor 
      },
      default: undefined
    },
    emailVerifiedCodeExpireIn: {
      type: Date
    },
    accessToken: String,
    // end -----
  },
  { timestamps: true }
);




// Define the `matchPassword` method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // console.log("entered password ===> ", enteredPassword)
  const result = await bcrypt.compare(enteredPassword, this.password);
  console.log("entered password ===> ", enteredPassword, "    this.password ===> ", this.password)
  // console.log("this.password ===> ", this.password)
  // console.log("result ==> ", result)
  return result
};

userSchema.methods.generatePasswordResetCodeForUsers = function () {
  this.passwordResetCode = Math.floor(1000 + Math.random() * 9000);
  
  this.passwordResetCodeExpire = Date.now() + 60 * 5 * 1000;

  return this.passwordResetCode;
};


userSchema.methods.generateEmailVerificationCodeForUsers = function () {
  this.emailVerifiedCode = Math.floor(1000 + Math.random() * 9000);
  this.emailVerifiedCodeExpireIn = Date.now() + 60 * 7 * 1000;

  return this.emailVerifiedCode;
};

const User = mongoose.model('User', userSchema);


export default User;
