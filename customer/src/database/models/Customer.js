import mongoose ,{ Schema } from 'mongoose';


const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salt: String,
  phone: String,
  address: [{
    type: Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  }],
  wishlist: [
     {
      _id: { type: String, required: true },
      name: { type: String},
      desc:{ type: String},
      banner: { type: String},
      price: { type: String},
      available: Boolean,
      
    
  }],
  cart: [{
    product: {
      _id: { type: String, required: true },
      name: String,
      banner: String,
      price: String
    },
    unit: {
      type: Number,
      required: true
    }
  }],
  orders: [{
    _id: { type: String, required: true },
    amount: String,
    date: { type: String, default: Date.now }
  }]
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.salt;
      delete ret.__v;
    }
  },
  timestamps: true
});

export default mongoose.model("Customer", CustomerSchema);
