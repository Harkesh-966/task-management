import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 100,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    // @ts-ignore
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
