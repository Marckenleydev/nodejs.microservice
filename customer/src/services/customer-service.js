import CustomerRepository from "../database/repository/customer-repository.js";
import { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utils/index.js';


class CustomerService {
    constructor (){
        this.repository = new CustomerRepository();
    }

    async SignUp(userInputs){
        const {name, email, password, phone} = userInputs;

        try {
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(password, salt);
            const existingCustomer = await this.repository.CreateCustomer({ name,email, password: userPassword, phone, salt});
            const token = await GenerateSignature({email: email, _id: existingCustomer._id});

            return FormateData({
                id: existingCustomer._id, token
            })
           
        } catch (error) {
            
            return json ("Error sign Up:", error);
            
        }
    }

    async SignIn(userInputs){
        const {email, password} = userInputs;

        try {
            const existingCustomer = await this.repository.FindCustomer({email});
            if(existingCustomer){
                const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);
                if(validPassword){
                    const token = await GenerateSignature({email: existingCustomer.email, _id: existingCustomer._id});
                    return FormateData({
                        id: existingCustomer._id, token
                    });
                }
            }
            return FormateData(null)
        } catch (error) {
            throw new Error("Error signing in:", error.message);
            
        }

    }



    async AddNewAddress(_id,userInputs){
        const {street,postalCode,city,country} = userInputs;

        try {
            const address = await this.repository.CreateAddress({
                _id,
                street,
                postalCode,
                city,
                country
            })
            return FormateData(address);
        } catch (error) {
            throw new Error("Error adding address");
            
        }

    }

    async GetProfile(id){
        try {
            const existingCustomer = await this.repository.FindCustomerById({id});
            return FormateData(existingCustomer);
            
        } catch (err) {
            throw new Error('Data Not found', err)
        }
    }

    async GetShoppingDetails(id){
        try {
            const existingCustomer = await this.repository.FindCustomerById({id});

            if(existingCustomer){
                return FormateData(existingCustomer);
            }
            return FormateData({msg:"No Customer Found"});
        } catch (error) {
            throw new Error("Error getting shopping details");
            
        }
    }

    async GetWishList(customerId){

        try {
            const wishListItems = await this.repository.Wishlist(customerId);
            return FormateData(wishListItems);
        } catch (err) {
            throw new Error('Data Not found', err)           
        }
    }

    async AddToWishlist(customerId, product){
        
        try {
            const wishlistResult = await this.repository.AddWishlistItem(customerId, product);        
           return FormateData(wishlistResult);
    
        } catch (err) {
            throw new Error(`Data Not found: ${err.message}`);

        }
    }

    async ManageCart(customerId, product, qty, isRemove){
        try {
            const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);        
            return FormateData(cartResult);
        } catch (err) {
            throw new Error('Data Not found', err)
        }
    }

    async ManageOrder(customerId, order){
        try {
            const orderResult = await this.repository.AddOrderToProfile(customerId, order);
            return FormateData(orderResult);
        } catch (err) {
            throw new Error('Data Not found', err)
        }
    }

    async SubcribeEvents(payload){
        const {event, data} = payload;
        const {userId,product,order,qty} = data;
        console.log("Event Received:", event);

        switch (event) {
            case "ADD_TO_WISHLIST":
            case "REMOVE_FROM_WISHLIST":
                this.AddToWishlist(userId, product);
                break;
                
            case "ADD_TO_CART":
                 this.ManageCart(userId, product, qty,false);
                break;
            case "REMOVE_FROM_CART":
                this.ManageCart(userId, product, qty,true);
                break;
            case "CREATE_ORDER":
                this.ManageOrder(userId, order);
                break;
        
            default:
                break;
        }

    }

}

export default CustomerService;