import CustomerService from "../services/customer-service.js";

export default (app) => {
  const service = new CustomerService();

  app.use("/app-events", async (req, res, next) => {
    

    const payload = req.body.payload || req.body;
    console.log("Received payload:", payload);

    try {
      
      await service.SubcribeEvents(payload);

      console.log("====================== Customer Service received Events ======================");
      return res.status(200).json({ payload });
    } catch (err) {
      console.error('Error in /app-events endpoint:', err);  // Logging any error that happens here
      next(err);  // Pass the error to the error handler
    }
  });
};