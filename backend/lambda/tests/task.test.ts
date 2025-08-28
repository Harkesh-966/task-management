import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectDB } from '../src/db/connect';

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await connectDB(uri);

    await request(app).post('/api/auth/register').send({
        username: 'u1',
        email: 'u1@example.com',
        password: 'StrongPass1'
    });
    const login = await request(app).post('/api/auth/login').send({
        email: 'u1@example.com',
        password: 'StrongPass1'
    });
    token = login.body.data.accessToken;
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongo.stop();
});

describe('Tasks', () => {
    it('CRUD flow', async () => {
        const created = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Task A', description: 'Desc' });
        expect(created.status).toBe(201);
        const id = created.body.data._id;

        const list = await request(app)
            .get('/api/tasks?status=pending&page=1&limit=5')
            .set('Authorization', `Bearer ${token}`);
        expect(list.status).toBe(200);
        expect(list.body.data.length).toBeGreaterThan(0);

        const updated = await request(app)
            .patch(`/api/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'completed' });
        expect(updated.status).toBe(200);
        expect(updated.body.data.status).toBe('completed');

        const del = await request(app)
            .delete(`/api/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(del.status).toBe(204);
    });
});
