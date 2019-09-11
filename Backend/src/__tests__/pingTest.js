const request = require('supertest');

const server = require('../../src/index');

describe('Ping', () => {
  const agent = request.agent(server);

  it('should return success', async () => {
    const response = await agent.get(`/api/ping`);
    expect(response.status).toBe(200);
  });
});
