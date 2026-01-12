import request from 'supertest';
import app from '../../app';
import { createReservation, createRestaurant, createTable } from './data/test.data';
import { CREATED } from '@/utils/status.utils';
// import
const data = {
  restaurantId: 1,
  date: "2026-02-12"
};

describe('Restarant core endpoint tests', () => {
  it('POST /restaurant/create should create a restaurant', async () => {

    const response = await request(app).post('/api/v1/restaurant/create')
      .set("Content-Type", "Application/json")
      .send(createRestaurant);

    expect(response.status).toBe(CREATED);
    expect(response.body.message).toEqual("restaurant created!");
  });

  it('POST /table/create should add a table to a restaurant', async () => {

    const response = await request(app)
      .post(`/api/v1/table/create`)
      .set("Content-Type", "Application/json")
      .send(createTable);

    expect(response.status).toBe(CREATED);
    expect(response.body.message).toEqual("table added");
  });

  it('POST /reservation/create should create a reservation', async () => {

    const response = await request(app)
      .post(`/api/v1/reservation/create`)
      .set("Content-Type", "Application/json")
      .send(createReservation);

    expect(response.status).toBe(CREATED);
    expect(response.body.message).toEqual("table reserved");
  });

  it('GET /reservations should return a list of reservations for a restaurant', async () => {

    const response = await request(app)
      .get(`/api/v1/reservations?date=${data.date}&restaurantId=${data.restaurantId}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.reservations)).toBe(true);
  });

  it('GET /restaurant/:id should return a restaurant with available tables', async () => {

    const response = await request(app).get(`/api/v1/restaurant/${data.restaurantId}`);
    expect(response.status).toBe(200);
    expect(typeof response.body.restaurant === 'object').toBe(true);
  });
});
