import request from 'supertest';

import server from '../../src/index.mjs';

describe('Ping', () => {
  const agent = request.agent(server);

  it('should return success', async () => {
    const response = agent.post(`/api/ping`);

    expect(response.status).toBe(200);

    //expect(response.body.user.email).toBe();
  });
});

// a helper function to make a POST request
// export function post(url, body) {
//   const httpRequest = request.agent(app).post(url);
//   httpRequest.send(body);
//   httpRequest.set('Accept', 'application/json');
//   httpRequest.set('Origin', 'http://localhost:3000');
//   return httpRequest;
// }
