import CustomerService from "../services/product-service.js";

export default (app) => {
  const service = new CustomerService();

  app.use("/app-events", async (req, res, next) => {
    

    const payload = req.body.payload || req.body;

    try {
      
      await service.SubcribeEvents(payload);

      console.log("====================== Product Service received Events ======================");
      return res.status(200).json({ payload });
    } catch (err) {
      console.error('Error in /app-events endpoint:', err);  // Logging any error that happens here
      next(err);  // Pass the error to the error handler
    }
  });
};