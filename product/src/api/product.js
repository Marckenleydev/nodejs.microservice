import { PublishToCustomerEvent,PublishToShoppingEvent } from "../message.queue/publisher.event.js";
import ProductService from "../services/product-service.js";
import UserAuth from "./middlewares/auth.js";
export default (app) => {
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/product/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/product/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/product/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put("/product/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    // get payload to send to customer service
    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST"
    );

    try {
      // PublishCustomerEvent(data);
      PublishToCustomerEvent(data);
      return res.status(200).json(data.data.product);
    } catch (err) {}
  });

  app.delete("/product/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );
      // PublishCustomerEvent(data);
      PublishToCustomerEvent(data);

      return res.status(200).json(data.data.product);
    } catch (err) {
      next(err);
    }
  });

  app.put("/product/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      // get payload to send to customer service
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        "ADD_TO_CART"
      );
      console.log("Data", data);
      PublishToCustomerEvent(data);
      PublishToShoppingEvent(data);
      const response = {
        product: data.data.product,
        qty: data.data.qty,
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/product/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;
    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_CART"
      );
      //PublishCustomerEvent(data);
     // PublishShoppingEvent(data);
      PublishToCustomerEvent(data);
      PublishToShoppingEvent(data);

      
      const response = {
        product: data.data.product,
        qty: data.data.qty,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/product", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
