import { ShoppingRepository } from "../database/repository/shopping-repository.js";
import { FormateData } from "../utils/index.js";
import { APIError, BadRequestError,STATUS_CODES } from '../utils/app-errors.js';
// All Business logic will be here
export class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
   
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (error) {
      throw new Error("Cart Not found", error);
      
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;
    console.log("Transaction ID", txnNumber);
    console.log("Customer ID", _id);
    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId).populate("items")
      return FormateData(orders);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async ManageCart({customerId,item, qty, isRemove}) {
    
    try {
      const cartResults = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormateData(cartResults);
    } catch (error) {
      throw error;
      
    }
  }

  async SubcribeEvents(payload){
    console.log("Event Payload",payload);
    const {event, data} = payload;
    const {userId,product,qty} = data;

    switch (event) {
        
            
        case "ADD_TO_CART":
             this.ManageCart({
              customerId: userId,
              item: product,
              qty: qty,
              isRemove: false
            });
            break;
        case "REMOVE_FROM_CART":
            this.ManageCart({
              customerId: userId,
              item: product,
              qty: qty,
              isRemove: true
            });
            break;
       
    
        default:
            break;
    }

}

    async GetOrderPayload(userId,order,event){
       
        if(order){
            const payload ={
                event:event,
                data:{
                    userId,
                    order
                }
            }
            return payload;
        }else{
            return FormateData({error:'Order not found'})
        }
       
    }

}

