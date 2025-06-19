import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test update product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product Test", 99.99);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product Updated",
      price: 149.99,
    };

    const output = await usecase.execute(input);

    expect(output).toEqual(input);

    const productModel = await ProductModel.findOne({ where: { id: "123" } });
    expect(productModel.toJSON()).toEqual({
      id: input.id,
      name: input.name,
      price: input.price,
    });
  });

  it("should throw error when product not found", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product Updated",
      price: 149.99,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Product not found");
  });

  it("should throw error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product Test", 99.99);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "",
      price: 149.99,
    };

    await expect(usecase.execute(input)).rejects.toThrow("Name is required");
  });

  it("should throw error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = new Product("123", "Product Test", 99.99);
    await productRepository.create(product);

    const input = {
      id: "123",
      name: "Product Updated",
      price: -1,
    };

    await expect(usecase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
