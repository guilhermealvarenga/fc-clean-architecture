import Product from "./product";
import NotificationError from "../../@shared/notification/notification.error";

describe("Product unit tests", () => {
  it("should create a valid product", () => {
    const product = new Product("123", "Product 1", 100);
    expect(product.id).toBe("123");
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);
  });
  
  it("should throw error when id is empty", () => {
    expect(() => {
      new Product("", "Product 1", 100);
    }).toThrow(NotificationError);
  });
  
  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("123", "", 100);
    }).toThrow(NotificationError);
  });
  
  it("should throw error when price is less than zero", () => {
    expect(() => {
      new Product("123", "Name", -1);
    }).toThrow(NotificationError);
  });
  
  it("should throw error with all validation errors when creating invalid product", () => {
    let error: NotificationError;
    
    try {
      new Product("", "", -1);
    } catch (e) {
      error = e as NotificationError;
    }
    
    expect(error.errors.length).toBe(3);
    expect(error.errors[0].message).toBe("Id is required");
    expect(error.errors[1].message).toBe("Name is required");
    expect(error.errors[2].message).toBe("Price must be greater than zero");
  });
  
  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });
  
  it("should detect error when changing to invalid name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("");
    const notification = product.notification;
    expect(notification.hasErrors()).toBe(true);
    expect(notification.getErrors()).toEqual([{
      context: "product",
      message: "Name is required"
    }]);
  });
  
  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });
  
  it("should detect error when changing to invalid price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(-1);
    const notification = product.notification;
    expect(notification.hasErrors()).toBe(true);
    expect(notification.getErrors()).toEqual([{
      context: "product",
      message: "Price must be greater than zero"
    }]);
  });

  it("should accumulate errors", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("");
    product.changePrice(-1);
    const notification = product.notification;
    expect(notification.hasErrors()).toBe(true);
    
    const errors = notification.getErrors();
    expect(errors).toHaveLength(2);
    expect(errors).toContainEqual({
      context: "product",
      message: "Name is required"
    });
    expect(errors).toContainEqual({
      context: "product",
      message: "Price must be greater than zero"
    });
  });
});
