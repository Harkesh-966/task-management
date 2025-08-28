import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';

export const initSocketServer = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.use((socket, next) => {
        const tokenHeader = socket.handshake.auth?.token as string | undefined;
        if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) return next(new Error('Unauthorized'));
        const token = tokenHeader.replace('Bearer ', '').trim();
        try {
            const payload = verifyAccessToken(token);
            // @ts-ignore
            socket.data.userId = payload.sub;
            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId as string;
        socket.join(userId);
        socket.emit('connected', { ok: true });
    });

    return io;
};
