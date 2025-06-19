import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("a", "Product A", 10);
const product2 = ProductFactory.create("b", "Product B", 20);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test for listing products use case", () => {
  it("should list all products", async () => {
    const repository = MockRepository();
    const useCase = new ListProductUseCase(repository);

    const output = await useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe("Product A");
    expect(output.products[0].price).toBe(10);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe("Product B");
    expect(output.products[1].price).toBe(40);
  });
});
