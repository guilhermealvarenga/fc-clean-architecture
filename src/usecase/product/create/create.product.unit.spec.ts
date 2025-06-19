import CreateProductUseCase from "./create.product.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputCreateProductDto, OutputCreateProductDto } from "./create.product.dto";

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Create product use case unit tests", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);       

        const input = {
            type: "a",
            name: "Product A",
            price: 10,
        };

        const output: OutputCreateProductDto = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });
    });
    
    it("should create a product type b", async () => {
        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const input = {
            type: "b",
            name: "Product B",
            price: 20,
        };

        const output: OutputCreateProductDto = await createProductUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price * 2,
        });
    });

    it("should throw an error for invalid product type", async () => {
        const productRepository = MockRepository();
        const createProductUseCase = new CreateProductUseCase(productRepository);

        const input: InputCreateProductDto = {
            type: "invalid",
            name: "Invalid Product",
            price: 10,
        };

        await expect(createProductUseCase.execute(input)).rejects.toThrow(
            "Product type not supported"
        );
    });
});
