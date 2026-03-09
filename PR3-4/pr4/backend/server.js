const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
  {
    id: nanoid(6),
    name: "Набор масляных красок «Мастер-класс»",
    category: "Краски",
    description: "Набор из 12 цветов масляных красок по 60 мл. Финское качество",
    price: 3490,
    stock: 15,
    rating: 4.9,
    image: "/images/Краски_маслянные.jpg"
  },
  {
    id: nanoid(6),
    name: "Кисти синтетика набор 10 шт",
    category: "Кисти",
    description: "Профессиональные кисти из синтетического волоса. Размеры от 1 до 10",
    price: 890,
    stock: 25,
    rating: 4.7,
    image: "/images/кисти_синтетика.jpg"
  },
  {
    id: nanoid(6),
    name: "Холст на подрамнике 40x50 см",
    category: "Холсты",
    description: "Льняной холст, среднезернистый. Грунтованный. Толщина подрамника 2 см",
    price: 750,
    stock: 30,
    rating: 4.8,
    image: "/images/холст.webp"
  },
  {
    id: nanoid(6),
    name: "Акварель «Сонет» 24 цвета",
    category: "Краски",
    description: "Медовая акварель, набор 24 цвета. Отлично подходит для начинающих",
    price: 590,
    stock: 40,
    rating: 4.6,
    image: "/images/акварель.webp"
  },
  {
    id: nanoid(6),
    name: "Палитра пластиковая овальная",
    category: "Аксессуары",
    description: "Пластиковая палитра для смешивания красок. 12 ячеек",
    price: 190,
    stock: 50,
    rating: 4.5,
    image: "/images/палитра.jpg"
  },
  {
    id: nanoid(6),
    name: "Мольберт-тренога",
    category: "Мольберты",
    description: "Алюминиевый мольберт-тренога. Регулируемая высота до 2 м",
    price: 2990,
    stock: 8,
    rating: 4.8,
    image: "/images/мольберт.jpg"
  },
  {
    id: nanoid(6),
    name: "Набор пастели 48 цветов",
    category: "Пастель",
    description: "Масляная пастель, мягкая. Яркие цвета, хорошо смешиваются",
    price: 890,
    stock: 18,
    rating: 4.7,
    image: "/images/пастель.jpg"
  },
  {
    id: nanoid(6),
    name: "Бумага для акварели А3",
    category: "Бумага",
    description: "Плотная бумага 300 г/м², 100% хлопок. 10 листов",
    price: 450,
    stock: 35,
    rating: 4.8,
    image: "/images/бумага_акв.jpg"
  },
  {
    id: nanoid(6),
    name: "Набор карандашей графитных",
    category: "Рисование",
    description: "Профессиональные графитные карандаши. Твердость от 2H до 6B. 12 шт",
    price: 650,
    stock: 22,
    rating: 4.7,
    image: "/images/карандаши.webp"
  },
  {
    id: nanoid(6),
    name: "Лак для картин финишный",
    category: "Аксессуары",
    description: "Акриловый лак для защиты готовых работ. Матовый. 200 мл",
    price: 390,
    stock: 14,
    rating: 4.6,
    image: "/images/лак_финиш.jpeg"
  },
  {
    id: nanoid(6),
    name: "Набор мастихинов 3 шт",
    category: "Инструменты",
    description: "Металлические мастихины разной формы для работы маслом",
    price: 590,
    stock: 12,
    rating: 4.5,
    image: "images/мастихины.webp"
  },
  {
    id: nanoid(6),
    name: "Скетчбук А5",
    category: "Бумага",
    description: "Блокнот для набросков. Плотная бумага 160 г/м². 80 листов",
    price: 290,
    stock: 45,
    rating: 4.8,
    image: "/images/скетчбук.jpg"
  }
];

// Остальной код сервера без изменений
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

app.get("/api/products", (req, res) => {
  const { category, minPrice, maxPrice, inStock } = req.query;
  let filteredProducts = [...products];

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
  }
  if (inStock === 'true') {
    filteredProducts = filteredProducts.filter(p => p.stock > 0);
  }

  res.json(filteredProducts);
});

app.get("/api/products/categories", (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.get("/api/products/:id", (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name?.trim() || !category?.trim() || !description?.trim()) {
    return res.status(400).json({ error: "Name, category and description are required" });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
    image: image || "https://via.placeholder.com/300x200?text=Art+Supplies"
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, category, description, price, stock, rating, image } = req.body;

  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  if (image !== undefined) product.image = image;

  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});