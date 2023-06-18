import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (order: IOrder): Promise<IOrder> => {
  const createdOrder = (
    await (
      await Order.create(order)
    ).populate({
      path: 'cow',
      populate: { path: 'seller' },
    })
  ).populate('buyer');
  if (!createdOrder) {
    throw new Error(`create order failed`);
  }
  return createdOrder;
};

export const OrderService = {
  createOrder,
};
