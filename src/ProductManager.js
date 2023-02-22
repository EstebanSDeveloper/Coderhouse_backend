import fs from "fs";

class ProductManager {
	#nextId = 0;
	#path = "./productos.json";

	async getProducts() {
		try {
			const getProductsFromJSON = await fs.promises.readFile(
				this.#path,
				"utf8"
			);
			return JSON.parse(getProductsFromJSON);
		} catch (error) {
			return [];
		}
	}
	async addProduct(title, description, price, thumbnail, code, stock) {
		const newProduct = {
			id: this.#nextId,
			title,
			description,
			price,
			thumbnail,
			code,
			stock,
		};

		const prod = await this.getProducts();
		let productWithSameCode = prod.find((p) => p.code === code);

		if (!productWithSameCode) {
			fs.promises.writeFile(this.#path, JSON.stringify([...prod, newProduct]));
			this.#nextId += 1;
		}
		if (productWithSameCode) {
			throw new Error(`Producto con codigo ${code}ya existente`);
		}

		if (!title || !description || !price || !thumbnail || !code || !stock) {
			throw new Error("Parametros faltantes");
		}
	}

	async getProductById(productID) {
		try {
			const idExist = await this.getProducts();
			const idProduct = idExist.find((p) => p.id === productID);
			if (idProduct) {
				return idProduct;
			} else {
				throw new Error(`Product with ID ${productID} not found`);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async deleteProduct(productId) {
		const products = await this.getProducts();
		const updatedProducts = products.filter((p) => p.id !== productId);
		await fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
	}

	async updateProduct(id, updates) {
		try {
			const fileContents = await fs.promises.readFile(this.#path, "utf-8");
			const products = JSON.parse(fileContents);
			const productIndex = products.findIndex((product) => product.id === id);
			if (productIndex === -1) {
				throw new Error(`Product with ID ${id} not found`);
			}

			const updatedProduct = { ...products[productIndex], ...updates };
			products[productIndex] = updatedProduct;

			await fs.promises.writeFile(this.#path, JSON.stringify(products));
			return updatedProduct;
		} catch (error) {
			console.log("error");
		}
	}
}

// Tests

async function main() {
	const manager = new ProductManager();

	//----------TEST ADD PRODUCT = SHIFT + ALT +F DAR FORMATO A .JSON

	// await manager.addProduct(
	// 	"Manzana",
	// 	"Es una manzana",
	// 	20,
	// 	"sin foto",
	// 	"codigo4",
	// 	120
	// );
	// await manager.addProduct(
	// 	"Banana",
	// 	"Es un banano",
	// 	10,
	// 	"sin foto",
	// 	"codigo2a",
	// 	23
	// );

	// await manager.addProduct("Pera", "Es un pera", 40, "sin foto", "codigo6", 56);

	console.log(await manager.getProducts());

	//----------TEST GET PRODUCT BY ID

	// const searchedProduct = manager.getProductById(0);

	// console.log(await searchedProduct);

	//----------TEST DELETE PRODUCT

	// await manager.deleteProduct(0);

	// console.log(await manager.getProducts());

	//----------ACTUALIZAR PRODUCTOS

	// const productUpdates = {
	// 	title: "pina",

	// 	description: "hey apple hey",

	// 	price: 50,

	// 	thumbnail: "con foto",

	// 	code: "codigo3",

	// 	stock: 89,
	// };

	// const UpdateProductPera = manager.updateProduct(1, productUpdates);

	// console.log(await UpdateProductPera);

	// console.log(await manager.getProducts());
}

main();

export default ProductManager;
