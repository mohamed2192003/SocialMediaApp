import mongoose from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../common/enums/index.js';
const userSchema = new mongoose.Schema({
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, required: function () {
            return this.provider === ProviderEnum.System;
        }
    },
    phone: { type: String },
    profilePic: { type: String },
    profileCoverPic: { type: [String] },
    gender: {
        type: Number,
        default: GenderEnum.Male
    },
    role: {
        type: Number,
        default: RoleEnum.User
    },
    provider: {
        type: Number,
        default: ProviderEnum.System
    },
    EmailConfirmation: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toObject: { virtuals: true } // this option is used to include virtuals in the output of the toObject method, this way we can use the virtual property userName in our application without having to store it in the database, we can also use it in the toJSON method by adding toJSON: { virtuals: true } to the schema options.
});
userSchema.virtual('username').set(function (value) {
    let [firstName, lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
const userModel = mongoose.model('User', userSchema);
export default userModel;
