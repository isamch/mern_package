import { faker } from "@faker-js/faker";

export const make__NAME__ = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
  };
};
