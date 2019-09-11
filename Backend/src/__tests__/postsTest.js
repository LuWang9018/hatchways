const request = require('supertest');

const server = require('../../src/index');

describe('Get posts', () => {
  const agent = request.agent(server);

  it('should get single tag', async () => {
    const response = await agent.get(
      `/api/posts?tags=["tech"]&sortBy=id&direction=desc`
    );

    expect(response.status).toBe(200);
    expect(response.body.posts.length).toBe(28);
  });

  it('should get another single tag', async () => {
    const response = await agent.get(
      `/api/posts?tags=["science"]&sortBy=id&direction=desc`
    );

    expect(response.status).toBe(200);
    expect(response.body.posts.length).toBe(25);
  });

  it('should return unique tags', async () => {
    const response = await agent.get(
      `/api/posts?tags=["science", "tech"]&sortBy=id&direction=asc`
    );

    expect(response.status).toBe(200);
    expect(response.body.posts.length).toBe(49);
  });

  it('should test default', async () => {
    const response1 = await agent.get(
      `/api/posts?tags=["science", "tech"]&sortBy=id&direction=asc`
    );
    const response2 = await agent.get(
      `/api/posts?tags=["science", "tech"]&sortBy=id`
    );

    const response3 = await agent.get(`/api/posts?tags=["science", "tech"]`);
    expect(response1.status).toBe(200);
    expect(response1.body).toStrictEqual(response2.body);
    expect(response1.body).toStrictEqual(response3.body);
  });
});
