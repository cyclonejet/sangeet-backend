import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('gives 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

describe('GET /non-existent-route', () => {
  it('gives 404', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({ message: 'Could not find route' });
  });
});
