import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: true,
      enum: ['seller', 'buyer'],
    },
    name: {
      type: {
        firstName: String,
        lastName: String,
      },
      required: true,
      _id: false,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      unique: true,
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const User = model<IUser, UserModel>('User', userSchema);
