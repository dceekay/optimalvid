const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

// Mock MySQL database connection
jest.mock('../config/db');

let server;

describe('Projects API', () => {

  beforeAll((done) => {
    server = app.listen(5001, () => { 
      done();
    });
  });

  
  afterAll((done) => {
    server.close(() => {
      done();
    });
    jest.clearAllMocks();
  });

  const mockProjects = [
    { id: 1, title: 'Test Project 1', description: 'Test Description 1' },
    { id: 2, title: 'Test Project 2', description: 'Test Description 2' },
  ];

  it('GET /projects - should return all projects', async () => {
    db.query.mockResolvedValueOnce([mockProjects]);

    const res = await request(app).get('/projects');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockProjects);
  });

  it('POST /projects - should create a new project', async () => {
    const newProject = { title: 'New Project', description: 'New Description' };
    db.query.mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app).post('/projects').send(newProject);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 3, ...newProject });
  });
});
