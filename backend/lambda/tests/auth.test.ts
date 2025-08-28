import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectDB } from '../src/db/connect';

let mongo: MongoMemoryServer;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await connectDB(uri);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

describe('Auth', () => {
    it('registers and logs in a user', async () => {
        const reg = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'user@example.com',
            password: 'StrongPass1'
        });
        expect(reg.status).toBe(201);

        const login = await request(app).post('/api/auth/login').send({
            email: 'user@example.com',
            password: 'StrongPass1'
        });
        expect(login.status).toBe(200);
        expect(login.body.data.accessToken).toBeDefined();
    });
});
