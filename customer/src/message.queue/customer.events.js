import amqplib from 'amqplib';
import CustomerService from "../services/customer-service.js";

export default async () => {
    const service = new CustomerService();
    const connection = await amqplib.connect('amqps://rmejlqbu:tPymZ8jdR8i3TjTJbhLis5NutMT7JJf2@stingray.rmq.cloudamqp.com/rmejlqbu');
    const channel = await connection.createChannel();

    const EXCHANGE_NAME = "customer_exchange";
    const EXCHANGE_TYPE = "direct";
    const ROUTING_KEY = "customer_event";
    const QUEUE_NAME = "customer_service_queue";

    // 1. Assert exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });

    // 2. Assert queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 3. Bind queue to exchange with routing key
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);

    console.log("Customer Service is listening for messages...");

    // 4. Consume messages
    channel.consume(QUEUE_NAME, async (message) => {
        if (message) {
            try {
                const payload = JSON.parse(message.content.toString());
                
                const { event } = payload;
                
                await service.SubcribeEvents(event);
                console.log("====================== Customer Service received Events successfully ======================");

                channel.ack(message);
            } catch (error) {
                console.error("Error processing message:", error);
                // You can optionally requeue: channel.nack(message, false, true);
            }
        }
    });

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
        console.log("Closing RabbitMQ connection...");
        await channel.close();
        await connection.close();
        process.exit(0);
    });
};
