import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const productManager = new ProductManager();

// listado de items con query de numero de items mostrados

app.get("/products", async (req, res) => {
	const { limit } = req.query;

	if (!limit) {
		const products = await productManager.getProducts();
		res.send(products);
	}

	// filtrado de el numero de datos solicitados
	const products = await productManager.getProducts();
	const filtered = await products.splice(0, limit);
	res.send(filtered);
});

// productos por id

app.get("/products/:id", async (req, res) => {
	const productId = Number(req.params.id);
	const product = await productManager.getProductById(productId);

	if (!product) {
		return res
			.status(404)
			.send(`The Id number ${productId} has not been assigned yet`);
	}

	res.send(product);
});

app.listen(8080, () => {
	console.log("Server listening on port 8080");
});
