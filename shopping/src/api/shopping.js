import { PublishToCustomerEvent } from "../message.queue/publisher.event.js";
import {ShoppingService} from "../services/shopping-service.js";
import {PublishCustomerEvent} from '../utils/index.js';
import UserAuth from './middlewares/auth.js';

export default  (app) => {
    
    const service = new ShoppingService();
    

    app.post('/shopping/order',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;
        
        try {
          
            const { data } = await service.PlaceOrder({_id, txnNumber});
            
            const payload = await service.GetOrderPayload(_id,data, "CREATE_ORDER")
            PublishToCustomerEvent(payload)
          //  PublishCustomerEvent(payload);
            return res.status(200).json(data);
            
        } catch (err) {
            next(err)
        }

    });

    app.get('/shopping/orders',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });
       
    
    app.get('/shopping/cart', UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        
        try {
            const { data } = await service.getCart({ _id });
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
}