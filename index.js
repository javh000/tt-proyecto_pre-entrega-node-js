import readline from "readline";

const FONT_STYLE = "\x1b[1;34m";
const RESET_FONT_STYLE = "\x1b[0m";

const [method, resource, productTitle, productPrice, productCategory] =
  process.argv.slice(2);
// console.log(method, resource, productTitle, productPrice, productCategory);

const API_URL = "https://fakestoreapi.com/products";

// Obtener listado completo de productos
async function showAllProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `Error status: ${response.status}. Error al obtener los productos`
      );
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error.message);
  } finally {
    console.log(`Proceso finalizado`);
  }
}

// Obtener producto por ID
async function showProducts() {
  try {
    const { resourceName, productID } = getResourceAndID(resource);
    // console.log(resourceName, productID);

    if (!productID) {
      return showAllProducts();
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
      productTitle === undefined ||
      productPrice === undefined ||
      productCategory === undefined
    ) {
      throw new Error(
        "Error falta uno de los siguientes argumentos \n Nombre, precio, categoría \n ejemplo correcto: npm run start POST products T-Shirt-Rex 300 remeras"
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: productTitle,
        price: productPrice,
        category: productCategory,
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

//  Verificar que los comandos ingresados estén correctos y obtener el ID de existir
function getResourceAndID(resource) {
  if (!resource) {
    throw new Error(
      "Falto ingresar el recurso 'products' a continuación del método http"
    );
  }
  const [resourceName, idPart] = resource.split("/");

  if (resourceName !== "products") {
    throw new Error(`El recurso ingresado no es válido: ${resourceName}.`);
  }

  if (!idPart) {
    return { resourceName, productID: null };
  }

  const productID = Number(idPart);

  if (Number.isNaN(productID)) {
    throw new Error(`El ID ingresado no es un valor válido: ${idPart}`);
  }

  return { resourceName, productID };
}

// función para confirmar antes de eliminar productos usando readline (de node)
// Usando promesa para esperar la respuesta del usuario y await para evitar un undefined
// process.stdin "escucha" lo que el usuario escribe como un listener
function askConfirm(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
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
