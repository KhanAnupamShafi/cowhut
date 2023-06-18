import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { Types, startSession } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { OrderService } from './order.service';

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...orderData } = req.body;

    const session = await startSession();
    session.startTransaction();
    try {
      // Validate if `cow` and `buyer` are valid ObjectId strings
      if (
        !Types.ObjectId.isValid(orderData?.cow) ||
        !Types.ObjectId.isValid(orderData?.buyer)
      ) {
        throw new ApiError(
          400,
          'Invalid ObjectId provided for `cow` or `buyer`.'
        );
      }

      // Check if the `cow` and `buyer` exist in their respective collections
      const isCowValid = await Cow.exists({ _id: orderData?.cow });
      const isBuyerValid = await User.exists({ _id: orderData?.buyer });

      if (!isCowValid || !isBuyerValid) {
        throw new ApiError(
          400,
          'Invalid `cow` or `buyer` reference. Make sure they exist in the Database'
        );
      }

      // Fetch the cow and buyer details
      const cowDetails = await Cow.findById(orderData?.cow);
      const buyerDetails = await User.findById(orderData?.buyer);

      if (!cowDetails || !buyerDetails) {
        throw new ApiError(
          400,
          'Cow or buyer details not found in the Database.'
        );
      }

      // Check if the cow is already sold
      if (cowDetails.label === 'sold') {
        throw new ApiError(
          400,
          'This cow is already sold and cannot be purchased again.'
        );
      }

      // Check if the buyer has enough budget to buy the cow
      const cowPrice = cowDetails.price;
      const buyerBudget = buyerDetails.budget;

      if (cowPrice > buyerBudget) {
        throw new ApiError(
          400,
          'Buyer does not have enough budget to buy the cow.'
        );
      }

      // Deduct the cow price from the buyer's budget
      buyerDetails.budget -= cowPrice;
      await buyerDetails.save();

      // Update the cow's label to 'sold'
      cowDetails.label = 'sold';
      await cowDetails.save();

      // Increase the seller's income by the cow price
      const sellerDetails = await User.findById(cowDetails.seller).session(
        session
      );
      if (!sellerDetails) {
        throw new ApiError(400, 'Seller details not found in the Database.');
      }

      sellerDetails.income += cowPrice;
      await sellerDetails.save();
      await User.findById(sellerDetails._id).session(session);

      // Create the order
      const result = await OrderService.createOrder(orderData);

      await session.commitTransaction();
      session.endSession();

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order created successfully!',
        data: result,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
);

export const OrderController = {
  createOrder,
};
