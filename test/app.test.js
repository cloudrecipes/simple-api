const request = require('supertest')
const app = require('../app')

describe('API tests', () => {
  describe('GET /healthcheck', () => {
    it('should response health information', (done) => {
      request(app)
        .get('/healthcheck')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body).to.have.key('uptime')
          done()
        })
        .catch(done)
    })
  })

  describe('GET /echo', () => {
    it('should echo request', (done) => {
      request(app)
        .get('/echo?name=world')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {message: 'Hello world'}, done)
    })
  })

  describe('GET /unknown', () => {
    it('should return 404 for unknown paths', (done) => {
      request(app)
        .get('/unknown')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
  })
})
