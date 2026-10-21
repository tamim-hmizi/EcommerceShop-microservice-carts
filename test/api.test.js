import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { bearer, useDatabase } from './helpers.js';

useDatabase();

const base = '/api/carts';
const userId = new mongoose.Types.ObjectId().toString();
const productId = new mongoose.Types.ObjectId().toString();
const auth = () => bearer(userId);

describe('carts service', () => {
  it('requires a token', async () => {
    await request(app).get(base).expect(401);
  });

  it('adds, merges, updates and removes items', async () => {
    await request(app).get(base).set(auth()).expect(404);

    await request(app).post(base).set(auth()).send({ product: productId, quantity: 1, price: 10 }).expect(201);
    const merged = await request(app).post(base).set(auth()).send({ product: productId, quantity: 2 }).expect(201);
    assert.equal(merged.body.items.length, 1);
    assert.equal(merged.body.items[0].quantity, 3);

    const updated = await request(app).put(`${base}/update`).set(auth()).send({ product: productId, quantity: 5 }).expect(200);
    assert.equal(updated.body.items[0].quantity, 5);

    const removed = await request(app).delete(`${base}/remove`).set(auth()).send({ product: productId }).expect(200);
    assert.equal(removed.body.items.length, 0);
  });

  it('keeps carts separate per user', async () => {
    await request(app).post(base).set(auth()).send({ product: productId, quantity: 1 }).expect(201);
    await request(app).get(base).set(bearer()).expect(404);
  });

  it('rejects a quantity below 1', async () => {
    await request(app).post(base).set(auth()).send({ product: productId, quantity: 0 }).expect(400);
  });
});
