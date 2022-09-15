import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';

export const item = {
    title: faker.lorem.word(3),
    url: faker.internet.url(),
    description: faker.lorem.paragraph(),
    amount: 1000
}

export async function createItem() {
    return await prisma.items.create({
        data: item
    })
}