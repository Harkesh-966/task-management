import http from 'http';
import app from './app';
import { env } from './config/env';
import { initSocketServer } from './sockets/socket';
import { connectDB } from './db/connect';
import dotenv from 'dotenv';
dotenv.config();
const server = http.createServer(app);
const io = initSocketServer(server);

const start = async () => {
    try {
        await connectDB(env.MONGODB_URI);
        server.listen(env.PORT, () => {
            console.log(`Server listening on http://localhost:${env.PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

start();
export { io };
