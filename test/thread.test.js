const supertest = require('supertest')
const { queryInterface } = require('../models').sequelize
const app = require('../app')

describe('Thread Router', () => {
    afterAll(done => {
        queryInterface.bulkDelete('Users', {})
        .then(_ => queryInterface.bulkDelete('Threads', {}))
        .then(_ => done())
        .catch(done)
    })

    const userData = {
        email: 'User1@mail.com',
        password: 'password1',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    const userData2 = {
        email: 'User2@mail.com',
        password: 'password2',
        first_name: 'John2',
        last_name: 'Doe2',
        phone_number: '081123456789',
        bio: 'This is his bio.',
        img_url: 'http://imgurl.com',
        city: 'Jakarta Selatan'
    }

    const newThreadData = {
        title: '5 Kitten found',
        description: 'this is the description',
        longitude: 10.203,
        latitude: -40.5,
    }

    const newThreadData2 = {
        title: '2 Kitten found',
        description: 'this is the description',
        longitude: 20.203,
        latitude: -10.5,
    }

    let token
    let token2
    let idToFind
    let commentId

    supertest(app)
    .post('/register')
    .send(userData)
    .end((err, res) => {
       token = res.body.token
    })

    supertest(app)
    .post('/register')
    .send(userData2)
    .end((err, res) => {
       token2 = res.body.token
    })
    
    describe('Create a thread', () => {
        describe('Successfully created a thread', () => {
            it('Should return a success message: 201', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send(newThreadData)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Thread succesfully created.')
                    done()
                })
            });
        });

        describe('Create thread failed', () => {
            it('Should return an empty title error: 400', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send({ ...newThreadData, title: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please insert the title')
                    done()
                })
            })

            it('Should return an empty long/lat error: 400', (done) => {
                supertest(app)
                .post('/threads')
                .set('token', token)
                .send({ ...newThreadData, longitude: '', last_name: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please choose the location')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .post('/threads')
                .send(newThreadData)
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please login first')
                    done()
                })
            })
        });
    });

    describe('Fetching threads', () => {
        supertest(app)
        .post('/threads')
        .set('token', token)
        .send(newThreadData2)

        describe('Find all', () => {
            it('Should return array of thread object', (done) => {
                supertest(app)
                .get('/threads')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body.data[0]).toHaveProperty('id', expect.any(Number))
                    idToFind = res.body.data[0].id
                    expect(res.body.data[0]).toHaveProperty('title', expect.any(String))
                    expect(res.body.data[0]).toHaveProperty('description', expect.any(String))
                    expect(res.body.data[0]).toHaveProperty('longitude', expect.any(Number))
                    expect(res.body.data[0]).toHaveProperty('latitude', expect.any(Number))
                    expect(res.body.data[0]).toHaveProperty('status', expect.any(String))
                    expect(res.body.data[0]).toHaveProperty('Users', expect.any(Array))
                    expect(res.body.data[1]).toHaveProperty('id', expect.any(Number))
                    expect(res.body.data[1]).toHaveProperty('title', expect.any(String))
                    expect(res.body.data[1]).toHaveProperty('description', expect.any(String))
                    expect(res.body.data[1]).toHaveProperty('longitude', expect.any(Number))
                    expect(res.body.data[1]).toHaveProperty('latitude', expect.any(Number))
                    expect(res.body.data[1]).toHaveProperty('status', expect.any(String))
                    expect(res.body.data[1]).toHaveProperty('Users', expect.any(Array))
                    done()
                })
            })
        })

        describe('Find one', () => {
            it('Should return array of thread object', (done) => {
                supertest(app)
                .get(`/threads/${idToFind}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body.data).toHaveProperty('id', expect.any(Number))
                    expect(res.body.data).toHaveProperty('title', expect.any(String))
                    expect(res.body.data).toHaveProperty('description', expect.any(String))
                    expect(res.body.data).toHaveProperty('longitude', expect.any(Number))
                    expect(res.body.data).toHaveProperty('latitude', expect.any(Number))
                    expect(res.body.data).toHaveProperty('status', expect.any(String))
                    expect(res.body.data).toHaveProperty('Users', expect.any(Array))
                    expect(res.body.data).toHaveProperty('Comments', expect.any(Array))
                    commentId = res.body.data.Comments[0].id
                    done()
                })
            })

            it('Should return a 404 error', (done) => {
                supertest(app)
                .get(`/threads/${-1}`)
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Data not found.')
                    done()
                })
            })
        });
    });
    
    describe('Editing threads', () => {
        describe('Edit thread success', () => {
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token)
                .send({ description: 'new description' })
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Thread succesfully edited.')
                    done()
                })
            });
        });

        describe('Edit thread failed', () => {
            it('Should return an empty title error: 400', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token)
                .send({ title: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please insert the title')
                    done()
                })
            })

            it('Should return an empty long/lat error: 400', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token)
                .send({ longitude: '', last_name: '' })
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please choose the location')
                    done()
                })
            })

            it('Should return unauthenticated error: 401', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .send({ description: 'new description' })
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please login first')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token2)
                .send({ description: 'new description' })
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'You are not authorized')
                    done()
                })
            })
        })
    });

    describe('Create a comment', () => {
        it('Should return a success message: 201', (done) => {
            supertest(app)
            .post(`/threads/${idToFind}`)
            .set('token', token2)
            .send({ message: 'Udah saya bantuin.' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', 'Comment succesfully created')
                done()
            })
        });

        it('Should return a message validation error: 201', (done) => {
            supertest(app)
            .post(`/threads/${idToFind}`)
            .set('token', token2)
            .send({ message: '' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', 'Please insert your message')
                done()
            })
        });
    });

    describe('Delete a comment', () => {
        it('Should return a success message: 200', (done) => {
            supertest(app)
            .delete(`/threads/comment/${commentId}`)
            .set('token', token2)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(err).toBe(null)
                expect(res.body).toHaveProperty('msg', 'Comment succesfully deleted.')
                done()
            })
        });
    });

    describe('Deleting a thread', () => {
        describe('Delete a thread success', () => {
            it('Should return a success message: 200', (done) => {
                supertest(app)
                .delete(`/threads/${idToFind}`)
                .set('token', token)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Thread succesfully deleted.')
                    done()
                })
            });
        });

        describe('Delete a thread failed', () => {
            it('Should return unauthenticated error: 401', (done) => {
                supertest(app)
                .delete(`/threads/${idToFind}`)
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'Please login first')
                    done()
                })
            })

            it('Should return unauthorized error: 401', (done) => {
                supertest(app)
                .put(`/threads/${idToFind}`)
                .set('token', token2)
                .expect('Content-Type', /json/)
                .expect(401)
                .end((err, res) => {
                    expect(err).toBe(null)
                    expect(res.body).toHaveProperty('msg', 'You are not authorized')
                    done()
                })
            })
        })
    });

    
    

});
