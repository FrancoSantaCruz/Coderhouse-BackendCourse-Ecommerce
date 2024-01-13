import { productsModel } from "../db/models/products.model.js";
import Manager from "./manager.js";

class ProductsManager extends Manager {
  constructor() {
    super(productsModel);
  }

  async findAllProducts(obj) {
    const { limit = 10, page = 1, sort: sortPrice, ...queryFilter } = obj;
    const response = await productsModel.paginate(queryFilter, {
      limit,
      page,
      sort: { price: sortPrice === "asc" ? 1 : -1 },
      lean: true,
    });
    return response;
  }
}

export const productsManager = new ProductsManager();