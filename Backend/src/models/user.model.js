import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    }
    , profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
const userModel = mongoose.model("user", userSchema)
export default userModel

