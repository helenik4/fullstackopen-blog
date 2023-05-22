const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'test author 1',
    url: 'testurlll',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'test author 2',
    url: 'url',
    likes: 2
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs are identified by id', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].id).toBeDefined()
})

test('blogs can be added by HTTP POST', async () => {
    const newBlog = {
        title: 'Added blog',
        author: 'test author 3',
        url: 'testurl',
        likes: 0
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(initialBlogs.length + 1)
    
      const contents = response.body.map(n => n.title)
      expect(contents).toContain(
        'Added blog'
      )
})

afterAll(async () => {
  await mongoose.connection.close()
})