import mongoose from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../../common/enums/index.js';
const userSchema = new mongoose.Schema({
    userName: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: true
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
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: { virtuals: true }, // this option is used to include virtuals in the output of the toObject method, this way we can use the virtual property userName in our application without having to store it in the database, we can also use it in the toJSON method by adding toJSON: { virtuals: true } to the schema options.
    strictQuery: true
});
userSchema.virtual('username').set(function (value) {
    let [firstName, lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
}).get(function () {
    return `${this.firstName} ${this.lastName}`;
});
//hooks => middleware functions that are executed before or after certain operations on the document, they can be used to perform some operations before or after saving, validating, updating or deleting a document in the database, in this case we are using pre and post hooks to perform some operations before and after saving and validating the user document in the database.
// userSchema.pre('save', async function(this: HydratedDocument<IUser> & {wasNew?: boolean}){ // pre save hook is used to perform some operations before saving the document to the database, in this case we are hashing the password before saving it to the database, we are using the generateHash function that takes the plain text password and a salt value from the environment variables and returns the hashed password, this way we can ensure that the password is stored securely in the database.
//     console.log('pre save');
//     if(this.isModified('password')){
//         this.password = await generateHash({plainText: this.password, salt: env.salt})
//     }
//     this.wasNew = this.isNew
// })
// userSchema.pre('validate', async function(){ // pre validate hook is used to perform some operations before validating the document, in this case we are just logging a message to the console, but we can also use it to perform some validation checks before saving the document to the database, for example we can check if the email is already registered in the database before saving the new user, this way we can avoid duplicate email addresses in the database.
//     console.log('pre validate');
//     if(this.firstName.length < 5){
//         throw new BadRequestExeption('First Name must be at least 5 characters long')
//     }
// })
// userSchema.post('save', async function(){ // post save hook is used to perform some operations after saving the document to the database, in this case we are just logging a message to the console, but we can also use it to perform some operations after saving the document to the database, for example we can send a welcome email to the user after saving their profile to the database, this way we can improve the user experience by sending them a welcome email after they register on our platform.
//     console.log('post save');
//     let that: HydratedDocument<IUser> & {wasNew?: boolean} = this
//     console.log(that.wasNew)
// })
// userSchema.post('validate', async function(){ // post validate hook is used to perform some operations after validating the document, in this case we are just logging a message to the console, but we can also use it to perform some validation checks after validating the document, for example we can check if the email is already registered in the database after validating the new user, this way we can avoid duplicate email addresses in the database.
//     console.log('post validate');
// })
// userSchema.pre('updateOne', async function(){
//     console.log(this);
// })
// userSchema.pre('insertMany', {document: true}, async function(this, docs){
//     console.log('---------------------------------');
//     console.log(this);
//     console.log(docs);
// })
// userSchema.pre('findOne', async function(){
//     console.log('---------------------------');
//     console.log(this.getFilter());
//     let query = this.getFilter()
//     if (!query.admin) {
//         this.setQuery({
//             ...query,
//             isDeleted: false
//         })
//     }
//     console.log(this.getQuery());
// })
// userSchema.pre('deleteOne', async function(){
//     console.log(this);
// })
const userModel = mongoose.model('User', userSchema); // this line is used to create a model from the schema, the model is used to interact with the database, we can use the model to create, read, update and delete documents in the database, in this case we are creating a model called User that is based on the userSchema, this way we can use the User model to perform CRUD operations on the user collection in the database.
export default userModel;
