import request from 'supertest';
import app from '../../app';
import { createReservation, createRestaurant, createTable } from './data/test.data';

describe('Restarant core ednpoint tests', () => {

  it('GET /reservations should return a list of reservations for a restaurant', async () => {
    const data = { date: "2026-01-08", resturant_id: "1" };

    const response = await request(app)
      .get(`/api/v1/reservations?date=${data.date}&?resturant_id=${data.resturant_id}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.reservations)).toBe(true);
  });

  it('POST /restaurant/create should create a restaurant', async () => {

    const response = await request(app).post('/users')
      .set("Content-Type", "Application/json")
      .send(createRestaurant);
      
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("restaurant created");
  });

  it('GET /restaurant/:id should return a restaurant with available tables', async () => {
    const data = { id: 1 };

    const response = await request(app).get(`/api/v1/restaurant/${data.id}`);
    expect(response.status).toBe(200);
    expect(typeof response.body.restaurant === 'object').toBe(true);
  });

  it('POST /reservation/create should create a reservation', async () => {

    const response = await request(app).post(`/api/v1/reservation/create`)
    .set("Content-Type", "Application/json")
    .send(createReservation);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("message");
  });

  it('POST /table/create should add a table to a restaurant', async () => {

    const response = await request(app)
    .post(`/api/v1/table/create`)
    .set("Content-Type", "Application/json")
    .send(createTable);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("table created");
  });
});