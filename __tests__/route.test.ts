import request from 'supertest';
import app from '../app';

describe('GET /', () => {
  it('gives 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
