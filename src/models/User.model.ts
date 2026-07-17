import { IUser } from "@/types/user.types";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

let userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    mobile: {
        type: String,
        minlength: [10, "Mobile number must be at least 10 characters long"],
        maxlength: [10, "Mobile number must be at most 10 characters long"],
        required: [true, "Mobile number is required"]

    }
}, {
    timestamps: true
});

userSchema.pre("save", function(){
    if(!this.isModified("password")) return;
    this.password=bcrypt.hashSync(this.password, 10)
})

userSchema.methods.comparePassword = function(candidatePassword:string){
    return bcrypt.compareSync(candidatePassword, this.password)
}

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
