import { Model } from 'mongoose';

type IRole = 'buyer' | 'seller';
type IName = {
  firstName: string;
  lastName: string;
};
export type IUser = {
  role: IRole;
  name: IName;
  password: string;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;

  //   buyer?: Types.ObjectId | IBuyer;
  //   seller?:Types.ObjectId | ISeller;
};
export type UserModel = Model<IUser, Record<string, unknown>>;
