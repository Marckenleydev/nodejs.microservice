import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    customerId: String,
    items: [
        {   
            product: {
                _id:{type:String, required: true},
                name: {type:String},
                desc: {type:String},
                type: {type:String},
                unit: {type:Number},
                banner: {type:String},
                price: {type:Number},
                suplier: {type:String},
            } ,
            unit: { type: Number, require: true} 
        }
    ]
},
{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

export default  mongoose.model('Cart', CartSchema);