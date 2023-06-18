import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: string;
  breed: string;
  weight: number;
  label: string;
  category: string;
  seller: Types.ObjectId | IUser;
};

export type ICowFilters = {
  searchTerm?: string;
  query?: string;
  minPrice?: string;
  maxPrice?: string;
  seller?: Types.ObjectId;
};

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type CowModel = Model<ICow, Record<string, unknown>>;
