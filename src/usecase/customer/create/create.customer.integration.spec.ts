import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "./create.customer.usecase";

describe("Test create customer use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    const input = {
      name: "John Doe",
      address: {
        street: "Street",
        number: 123,
        zip: "12345",
        city: "City",
      },
    };

    const output = await usecase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
    });

    const customerModel = await CustomerModel.findOne({ 
      where: { id: output.id },
      rejectOnEmpty: true,
    });

    expect(customerModel.toJSON()).toEqual({
      id: output.id,
      name: input.name,
      street: input.address.street,
      number: input.address.number,
      zipcode: input.address.zip,
      city: input.address.city,
      active: false,
      rewardPoints: 0,
    });
  });

  it("should throw error when name is missing", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    const input = {
      name: "",
      address: {
        street: "Street",
        number: 123,
        zip: "12345",
        city: "City",
      },
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw error when street is missing", async () => {
    const customerRepository = new CustomerRepository();
    const usecase = new CreateCustomerUseCase(customerRepository);

    const input = {
      name: "John Doe",
      address: {
        street: "",
        number: 123,
        zip: "12345",
        city: "City",
      },
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Street is required"
    );
  });
});
