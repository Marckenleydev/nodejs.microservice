import  Cart  from '../models/Cart.js';
import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';
import { APIError, BadRequestError,STATUS_CODES } from '../../utils/app-errors.js';


//Dealing with data base operations
export class ShoppingRepository {

    // payment
    async Orders(customerId){
        try{
            const orders = await Order.find({customerId });        
            return orders;
        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Orders')
        }
    }

    async Cart(customerId){
        try {
            const cartItems = await Cart.find({customerId:customerId});
            if(cartItems){
                return cartItems;
            }
        } catch (error) {
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Cart')
            
        }
    }


    async AddCartItem(customerId, item, qty, isRemove) {
      try {
        // Chache panye kliyan an nan baz done a
        const cart = await Cart.findOne({customerId: customerId});
        const  { _id }= item;
        
        if (cart) {
          // Inisyalize yon varyab pou tcheke si pwodwi a deja egziste nan panye a
          let isExist = false; // Fixed: Changed from const to let
          let cartItems = cart.items;
          
          if (cartItems.length > 0) {
            // Pase nan chak atik nan panye a pou tcheke si pwodwi a deja la
            cartItems.map((item) => {
              
              if (item.product._id.toString() === _id.toString()) {
                if (isRemove) {
                  // Si isRemove=true, retire atik la nan lis la
                  cartItems.splice(cartItems.indexOf(item), 1);
                  console.log("Item removed from cart",cartItems);
                } else {
                  // Sinon, mete ajou kantite a
                  item.unit = qty;
                }
                isExist = true;
              }
            });
          }
         
            if (!isExist && !isRemove) {
            
              cartItems.push({product: {...item}, unit:qty});
            }
            
          
            cart.items = cartItems;
            return await cart.save();
            
         
        } else {
          
          return await Cart.create({
            customerId,
            items: [{product: {...item}, unit:qty}]
          });
        }
      } catch (err) {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Unable to Add CartItem to the shopping cart"
        );
      }
    }


    async CreateNewOrder(customerId, txnId){

        try{
            const cart = await Cart.findOne({customerId: customerId});
    
            if(cart){
                let amount = 0;   
                let cartItems = cart.items;
    
                if(cartItems.length > 0){
                    //process Order
                    cartItems.map(item => {
                        amount += parseInt(item.product.price) *  parseInt(item.unit);   
                    });
                    const orderId = uuidv4();
        
                    const order = new Order({
                        orderId,
                        customerId,
                        amount,
                        txnId,
                        status: 'received',
                        items: cartItems
                    })
        
                    cart.items = [];
                    
                    const orderResult = await order.save();
                    await cart.save();
    
                    return orderResult;
                }
            }
    
          return {}

        }catch(err){
            throw APIError('API Error', STATUS_CODES.INTERNAL_ERROR, 'Unable to Find Category')
        }
        

    }
}

