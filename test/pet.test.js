const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')
const petRoute = "/pet"

describe('Pet router', () => {
  const dataCreate = {
    name: 'felix the cat',
    species: 'angora',
    UserId: 1,
    birth_date: new Date(),
    description: 'sudah lama ga dikasih makan',
    status: true,
    request_user_id: 2
  }

  const token = null

  describe('Create a pet', () => {
    describe('Success create pet', () => {
      afterEach(done => {
        queryInterface.bulkDelete('Pets', {})
          .then(_ => done)
          .catch(err => console.log(err))
      })

      it('return pet data (201)',
        done => {
          supertest(app)
            .post(petRoute)
            .set('token', token)
            .send(dataCreate)
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('id', expect.any(Number))
              expect(res.body).toHaveProperty('name', dataRegister.name)
              expect(res.body).toHaveProperty('species', dataRegister.species)
              expect(res.body).toHaveProperty('UserId', expect.any(Number))
              expect(res.body).toHaveProperty('birth_date', dataRegister.birth_date)
              expect(res.body).toHaveProperty('description', dataRegister.description)
              expect(res.body).toHaveProperty('status', dataRegister.status)
              expect(res.body).toHaveProperty('request_user_id', expect.any(Number))
              done()
            })
        })
    });

    describe('Error create pet', () => {
      describe('No token', () => {
        it('Invalid token no token (400)', done => {
          supertest(app)
            .post(petRoute)
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Invalid token (400)', done => {
          supertest(app)
            .post(petRoute)
            .set('token', "zzzz")
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('No owner data', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .post(petRoute)
            .set('token', token)
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Please insert cats's owner id`)
              done()
            })
        })
      });

      describe('Description Error', () => {
        describe('No token', () => {
          it('Invalid token (400)', done => {
            supertest(app)
              .get(petRoute)
              .send({ ...dataCreate, UserId: '' })
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', `Invalid token`)
                done()
              })
          })
        });
  
        describe('Invalid token', () => {
          it('Should return empty validation error (400)', done => {
            supertest(app)
              .get(petRoute)
              .set('token', "zzzz")
              .send({ ...dataCreate, UserId: '' })
              .expect('Content-Type', /json/)
              .expect(400)
              .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', `Invalid token`)
                done()
              })
          })
        });

        it('Should return empty validation error (400)', done => {
          supertest(app)
            .post(petRoute)
            .set('token', token)
            .send({ ...dataCreate, description: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', 'Please insert pet description')
              done()
            })
        })
      });
    });
  });

  describe('Get pets', () => {
    describe('Success get pets', () => {
      it('return pets (200)',
        done => {
          supertest(app)
            .get(petRoute)
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Array))
              done()
            })
        })
    });

    describe('Error get pets', () => {
      describe('No token', () => {
        it('Invalid token no token (400)', done => {
          supertest(app)
            .get(petRoute)
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .get(petRoute)
            .set('token', "zzzz")
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });
    });
  });

  // belom set data update
  describe('Update a pet', () => {
    describe('Success update pet', () => {
      it('return updated pet data (200)',
        done => {
          supertest(app)
            .put(petRoute + "/1")
            .set('token', token)
            .send(dataCreate)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              expect(res.body.data).toHaveProperty('id', expect.any(Number))
              expect(res.body.data).toHaveProperty('name', dataRegister.name)
              expect(res.body.data).toHaveProperty('species', dataRegister.species)
              expect(res.body.data).toHaveProperty('UserId', expect.any(Number))
              expect(res.body.data).toHaveProperty('birth_date', dataRegister.birth_date)
              expect(res.body.data).toHaveProperty('description', dataRegister.description)
              expect(res.body.data).toHaveProperty('status', dataRegister.status)
              expect(res.body.data).toHaveProperty('request_user_id', expect.any(Number))
              done()
            })
        })
    });

    describe('Error update pet', () => {
      describe('No token', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .update(petRoute)
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .update(petRoute)
            .set('token', "zzzz")
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('No owner data', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .update(petRoute)
            .set('token', token)
            .send({ ...dataCreate, UserId: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Please insert cats's owner id`)
              done()
            })
        })
      });

      describe('Description Error', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .update(petRoute)
            .set('token', token)
            .send({ ...dataCreate, description: '' })
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', 'Please insert pet description')
              done()
            })
        })
      });

      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .update(petRoute + "/99999999999999")
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet not found!`)
              done()
            })
        })
      });
    });
  });

  describe('Delete a pet', () => {
    describe('Success delete pet', () => {
      it('return updated pet data (200)',
        done => {
          supertest(app)
            .set('token', token)
            .delete(petRoute + "/1")
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('data', expect.any(Object))
              expect(res.body.data).toHaveProperty('id', expect.any(Number))
              expect(res.body.data).toHaveProperty('name', dataRegister.name)
              expect(res.body.data).toHaveProperty('species', dataRegister.species)
              expect(res.body.data).toHaveProperty('UserId', expect.any(Number))
              expect(res.body.data).toHaveProperty('birth_date', dataRegister.birth_date)
              expect(res.body.data).toHaveProperty('description', dataRegister.description)
              expect(res.body.data).toHaveProperty('status', dataRegister.status)
              expect(res.body.data).toHaveProperty('request_user_id', expect.any(Number))
              done()
            })
        })
    });

    describe('Error delete a pet', () => {
      describe('No token', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .delete(petRoute + "/1")
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('Invalid token', () => {
        it('Should return empty validation error (400)', done => {
          supertest(app)
            .delete(petRoute + "/1")
            .set('token', "zzzz")
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Invalid token`)
              done()
            })
        })
      });

      describe('Invalid id', () => {
        it('Id not found (404)', done => {
          supertest(app)
            .delete(petRoute + "/1")
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
              expect(err).toBe(null)
              expect(res.body).toHaveProperty('msg', `Pet not found!`)
              done()
            })
        })
      });
    });
  });

});