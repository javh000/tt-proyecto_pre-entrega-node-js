# Pre Entrega - Talento Tech - Node Js

---

## Clonar el repositorio:

```bash
git clone https://github.com/javh000/tt-proyecto_pre-entrega-node-js.git
cd tt-proyecto_pre-entrega-node-js
```

---

## Uso

### 1. Consultar todos los productos

```bash
npm run start GET products
```

### 2. Consultar un producto específico

```bash
npm run start GET products/<productId>
```

Ejemplo:

```bash
npm run start GET products/15
```

### 3. Crear un producto nuevo

```bash
npm run start POST products <title> <price> <category>
```

- `<title>`: Nombre del producto.
- `<price>`: Precio del producto.
- `<category>`: Categoría del producto.

Ejemplo:

```bash
npm run start POST products T-Shirt-Rex 300 remeras
```

### 4. Eliminar un producto

```bash
npm run start DELETE products/<productId>
```

Ejemplo:

```bash
npm run start DELETE products/7
```

---
