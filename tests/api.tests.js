import { use, expect } from 'chai'
import chaiHttp from 'chai-http'
const chai = use(chaiHttp)

const request = chai.request.execute;

describe('Auth API service', () => {
  // run one time then .skip once working
  it.skip('should POST a new user (only tested once on initial setup)', (done) => {
    const testUser = {
      username: 'admin',
      password: 'password',
      email: 'admin@example.com',
    };
    const expected = { msg: 'New user created!' };

    request('http://localhost:3000')
      .post('/api/auth/register')
      .send(testUser)
      .end((err, resp) => {
        console.log(resp.body);
        expect(resp.body).to.eql(expected);
        done();
      });
  });

  it('should not POST a new user if they already exist', (done) => {
    const testUser = {
      username: 'admin',
      password: 'password',
      email: 'admin@example.com',
    };
    const expected = { msg: 'User already exists!' };

    request('http://localhost:3000')
      .post('/api/auth/register')
      .send(testUser)
      .end((err, resp) => {
        expect(resp.body).to.eql(expected);
        done();
      });
  });

  it('should POST a login for an existing', (done) => {
    const testUser = {
      username: 'admin',
      password: 'password',
      email: 'admin@example.com',
    };

    request('http://localhost:3000')
      .post('/api/auth/login')
      .send(testUser)
      .end((err, resp) => {
        expect(resp.body.auth).to.be.true;
        expect(resp.body.expires_in).to.be.eql(86400);
        expect(resp.body.access_token).to.be.a('string');
        expect(resp.body.refresh_token).to.be.a('string');
        done();
      });
  });
});

describe('Tasks API Service', () => {
  it('should POST a single task', (done) => {
    const newTask = {
      name: 'New test task!',
    };
    const expected = { message: 'Add task successfully!' };

  request('http://localhost:3000')
      .post('/api/tasks')
      .send(newTask)
      .end((err, resp) => {
        expect(resp.status).to.be.eql(200);
        expect(resp.body).to.be.eql(expected);
        done();
      });
  });
  
  it('should GET all tasks', (done) => {
    request('http://localhost:3000')
      .get('/api/tasks')
      .end((err, resp) => {
        expect(resp.status).to.be.eql(200);
        expect(resp.body).to.be.a('array');
        expect(resp.body.length).to.not.be.eql(0);
        done();
      });
  });

  it('should GET a single task', (done) => {
    const expected = [
      {
        id: 1,
        name: "I'm the first task!",
        created_date: '2020-03-24T05:09:49.000Z',
        status: 'completed',
      },
    ];

  request('http://localhost:3000')
      .get('/api/tasks/1')
      .end((err, resp) => {
        expect(resp.status).to.be.eql(200);
        expect(resp.body).to.be.a('array');
        expect(resp.body.length).to.not.be.eql(0);
        expect(resp.body).to.be.eql(expected);
        done();
      });
  });
});

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTg2Mjk5NzgzLCJleHAiOjE1ODYzODYxODN9.0WGrPHozwciIqD2iaoraPnLGC4nWV2ydqLUOKD7ra5I';

// describe('User API service', () => {
//   it("should GET a logged in user's unique id, username, and password", (done) => {
//     const expected = [
//       {
//         user_id: 1,
//         username: 'admin',
//         email: 'admin@example.com',
//       },
//     ];

//   request('http://localhost:3000')
//       .get('/api/user/me')
//       .set('Authorization', `Bearer ${token}`)
//       .end((err, resp) => {
//         expect(resp.body).to.eql(expected);
//         done();
//       });
//   });

//   // run one time then skip once working
//   it.skip('should PUT updated credentials for a logged in user', (done) => {
//     const updatedUser = {
//       username: 'admin2',
//       password: 'newPassword',
//       email: 'admin@example.com',
//     };
//     const expected = { msg: 'Updated succesfully!' };

//   request('http://localhost:3000')
//       .put('/api/user/me/update')
//       .set('Authorization', `Bearer ${token}`)
//       .send(updatedUser)
//       .end((err, resp) => {
//         expect(resp.body).to.eql(expected);
//         done();
//       });
//   });

//   it('should PUT updated credentials for a logged in user', (done) => {
//     const updatedUser = {
//       username: 'admin2',
//       password: 'newPassword',
//       email: 'admin@example.com',
//     };
//     const expected = { msg: 'Nothing to update...' };

// request('http://localhost:3000')
//       .put('/api/user/me/update')
//       .set('Authorization', `Bearer ${token}`)
//       .send(updatedUser)
//       .end((err, resp) => {
//         expect(resp.body).to.eql(expected);
//         done();
//       });
//   });
// });