import amqplib from 'amqplib';

export const PublishToCustomerEvent = async (event, data) => {
    const connection = await amqplib.connect('amqps://rmejlqbu:tPymZ8jdR8i3TjTJbhLis5NutMT7JJf2@stingray.rmq.cloudamqp.com/rmejlqbu');
    const channel = await connection.createChannel();

    const CUSTOMER_EXCHANGE = "customer_exchange";
    const CUSTOMER_QUEUE = "customer_service_queue";
    const ROUTING_KEY = "customer_key";

    // Declare exchange
    await channel.assertExchange(CUSTOMER_EXCHANGE, "direct", { durable: true });

    // Declare queue
    await channel.assertQueue(CUSTOMER_QUEUE, { durable: true });

    // Bind queue to exchange with a routing key
    await channel.bindQueue(CUSTOMER_QUEUE, CUSTOMER_EXCHANGE, ROUTING_KEY);

    // Send message to exchange using routing key
    const payload = { event, data };
    channel.publish(CUSTOMER_EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(payload)), {
        persistent: true
    });

    console.log(`Event sent to exchange ${CUSTOMER_EXCHANGE} -> queue ${CUSTOMER_QUEUE}`);

    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);
};

