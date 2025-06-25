import mongoose from "mongoose";
import CustomerService  from "../services/customer-service.js";
import UserAuth  from "./middlewares/auth.js";

export default (app) => {
  const service = new CustomerService();

 

  app.post("/customer/signup", async (req, res, next) => {
    try {
      const {name, email, password, phone } = req.body;
      console.log("req.body", req.body);
      const { data } = await service.SignUp({name, email, password, phone });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const { data } = await service.SignIn({ email, password });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/customer/address", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/customer/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // Temporary debug route
  app.get("/customer/debug-customer/:id", async (req, res) => {
    try {
      // Check connection first
      if (!mongoose.connection.db) {
        return res.status(500).json({ error: "Database not connected" });
      }
  
      const collection = mongoose.connection.db.collection('customers');
      const doc = await collection.findOne({ 
        _id: new mongoose.Types.ObjectId(req.params.id) 
      });
      
      res.json({ exists: !!doc, doc });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/customer/shopping-details", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShoppingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/customer/wishlist", UserAuth, async (req, res, next) => {
    try {
      
      const { _id } = req.user;
      const { data } = await service.GetWishList({_id});
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};