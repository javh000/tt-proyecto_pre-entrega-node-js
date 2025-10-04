import readline from "readline";

//  Verificar que los comandos ingresados estén correctos y obtener el ID de existir
export function getResourceAndID(resource) {
  if (!resource) {
    throw new Error(
      "Falto ingresar el recurso 'products' a continuación del método http"
    );
  }
  const [resourceName, productID] = resource.split("/");

  if (resourceName !== "products") {
    throw new Error(`El recurso ingresado no es válido: ${resourceName}.`);
  }

  if (!productID) {
    return { resourceName, productID: null };
  }


  if (!checkPositiveNumber(productID)) {
    throw new Error(`El ID ingresado no es un valor válido: ${productID}.\n\ Ingrese un valor numérico superior a 0`);
  }

  return { resourceName, productID };
}

// función para confirmar antes de eliminar productos usando readline (de node)
// Usando promesa para esperar la respuesta del usuario y await para evitar un undefined
// process.stdin "escucha" lo que el usuario escribe como un listener
export function askConfirm(query) {
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


export function checkPositiveNumber(value){
  const number = Number(value)

  if(!Number.isNaN(number) && number > 0){
    return number
  }
}