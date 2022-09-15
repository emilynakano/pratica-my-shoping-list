import supertest from 'supertest';
import app from '../src/app';

import {createItem, item} from './factories/itemFactory';

import { prisma } from '../src/database';

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const response = await agent.post('/items').send(item);
    expect(response.status).toBe(201)
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const createdItem = await createItem();
    const response = await agent.post('/items').send({
      title: createdItem.title,
      url: createdItem.url,
      description: createdItem.description,
      amount: createdItem.amount
    })
    expect(response.status).toBe(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const response = await agent.get('/items').send();

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual ao item cadastrado', async () => {
    const createdItem = await createItem();
    const response = await agent.get(`/items/${createdItem.id}`).send();
    expect(response.status).toBe(200)
    expect(response.body).toEqual(createdItem)
  });
  it('Deve retornar status 404 caso não exista um item com esse id',async () => {
    const response = await agent.get(`/items/1`).send();
    expect(response.status).toBe(404)
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
