const request = require('supertest');

const server = require('../../src/index');

describe('Get posts errors', () => {
  const agent = request.agent(server);

  it('should return tag error', async () => {
    const response = await agent.get(`/api/posts?sortBy=id&direction=desc`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Tags parameter is required');
  });

  it('should return tag error', async () => {
    const response = await agent.get(
      `/api/posts?tags="tech"&sortBy=id&direction=desc`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Tags parameter is not an array');
  });

  it('should return sortBy error', async () => {
    const response = await agent.get(
      `/api/posts?tags=["tech"]&sortBy=idd&direction=desc`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('sortBy parameter is invalid');
  });

  it('should return direction error', async () => {
    const response = await agent.get(
      `/api/posts?tags=["tech"]&sortBy=id&direction=descc`
    );

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('direction parameter is invalid');
  });
});
