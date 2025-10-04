import { askConfirm, getResourceAndID, checkPositiveNumber } from "./utils.js";

const FONT_STYLE = "\x1b[1;34m";
const RESET_FONT_STYLE = "\x1b[0m";

const [method, resource, inputTitle, inputPrice, inputCategory] =
  process.argv.slice(2);
// console.log(method, resource, inputTitle, inputPrice, inputCategory);

const API_URL = "https://fakestoreapi.com/products";

// Obtener listado completo de productos
async function showAllProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Error status: ${response.status}. Error al obtener los productos`
    );
  }

  const data = await response.json();
  return data;
}

// Obtener producto por ID
async function showProducts() {
  try {
    const { resourceName, productID } = getResourceAndID(resource);
    // console.log(resourceName, productID);

    if (!productID) {
      const allProducts = await showAllProducts();
      console.log(allProducts);
      return;
    }

    const response = await fetch(API_URL + "/" + productID);
    // Convertir a text() antes de json para chequear y evitar Unexpected end of JSON input porque la API de Fake store devuelve un body vació al solicitar productos inexistentes
    const text = await response.text();
    // console.log("text" + text);

    if (!text || text === "{}") {
      throw new Error(`El producto ${productID} no existe`);
    }

    if (!response.ok) {
      throw new Error(
        `Error al obtener el producto ${productID}: ${response.status}`
      );
    }

    const data = JSON.parse(text);
    console.log(data);
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log(`Proceso finalizado`);
  }
}

// Eliminar producto por ID
async function deleteProducts() {
  try {
    const { resourceName, productID } = getResourceAndID(resource);
    // console.log(resourceName, productID);
    const answer = await askConfirm(
      `Confirma que desea eliminar el producto con id: ${productID}? (s/n) `
    );

    if (answer.toLowerCase() === "s") {
      if (!productID) {
        throw new Error("No se proporcionó ID de producto para eliminar.");
      }

      const response = await fetch(API_URL + "/" + productID, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Error al eliminar el producto ${productID}: ${response.status}`
        );
      }

      const text = await response.text();
      // console.log("text" + text);

      if (!text || text === "{}") {
        throw new Error(`El producto ${productID} no existe`);
      }

      const data = JSON.parse(text);
      console.log(
        `${FONT_STYLE}Producto con ID:${data.id} se elimino correctamente.${RESET_FONT_STYLE}`
      );
    } else {
      console.log("Operación cancelada");
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log(`Proceso finalizado`);
  }
}

// Agregar un nuevo producto
async function storeProducts() {
  try {
    if (
      inputTitle === undefined ||
      inputPrice === undefined ||
      inputCategory === undefined
    ) {
      throw new Error(
        "Error falta uno o varios de los siguientes argumentos \n Nombre, precio, categoría \n ejemplo correcto: npm run start POST products T-Shirt-Rex 300 remeras"
      );
    } else if (!checkPositiveNumber(inputPrice)) {
      throw new Error("El precio debe ser un valor numérico y superior a 0");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputTitle,
        price: inputPrice,
        category: inputCategory,
      }),
    });

    if (!response.ok) {
      throw new Error("El producto no pudo ser cargado");
    }

    const data = await response.json();
    console.log(
      `${FONT_STYLE}Producto cargado correctamente. \n\ id: ${data.id} \n\ Nombre: ${data.title} \n\ Precio: ${data.price} \n\ Categoría: ${data.category}.${RESET_FONT_STYLE}`
    );
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log(`Proceso finalizado`);
  }
}

switch (method) {
  case "GET":
    showProducts();
    break;
  case "POST":
    storeProducts();
    break;
  case "DELETE":
    deleteProducts();
    break;
  default:
    console.log("Comando no reconocido. Usa 'GET', 'POST' o 'DELETE'");
    break;
}
