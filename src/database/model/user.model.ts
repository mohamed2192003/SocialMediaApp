import mongoose from 'mongoose';
import { IUser } from '../../common/interfaces/index.js';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../common/enums/index.js';
const userSchema = new mongoose.Schema<IUser>({
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, required: function (this) {
            return this.provider === ProviderEnum.System
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
},
    {
        timestamps: true,
        toObject: { virtuals: true } // this option is used to include virtuals in the output of the toObject method, this way we can use the virtual property userName in our application without having to store it in the database, we can also use it in the toJSON method by adding toJSON: { virtuals: true } to the schema options.
    })
userSchema.virtual('username').set(function (value) { // virtuals are properties that are not stored in the database but are calculated from the existing data, they can be used to create computed properties that can be used in the application without having to store them in the database, in this case we are creating a virtual property called userName that is set by splitting the value of the name property into firstName and lastName and then we are returning the full name by concatenating the firstName and lastName properties.
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})
const userModel = mongoose.model<IUser>('User', userSchema)
export default userModel