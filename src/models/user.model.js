import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
     username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
     },
        email: {
           type: String,
           required: true,
           unique: true,
           lowercase: true,
           trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
    
      avatar: {
        type: String, //cloudinary url
        required: true,
       },
       coverImage: {
        type: String, //cloudinary url
       },
       watchHistory: [
           {
               type: Schema.Types.ObjectId,
                ref: "Video"
           }
        ],
        pasasword:{
            type: String,
            required: [true, 'Password is required' ]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.pasasword = await bcrypt.hash(this.pasasword, 10)
    next()
})

userSchema.methods.ispasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.pasasword)
    
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign (
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign (
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)