const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Логирование запросов
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      console.log('Body:', req.body);
    }
  });
  next();
});

// ================ Swagger Configuration ================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Художественный магазин API',
      version: '1.0.0',
      description: 'API для управления товарами художественного магазина (практики 1-5)',
      contact: {
        name: 'Студент',
        email: 'student@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Локальный сервер разработки',
      }
    ],
    tags: [
      {
        name: 'Products',
        description: 'Управление товарами художественного магазина'
      },
      {
        name: 'Categories',
        description: 'Получение категорий товаров'
      },
      {
        name: 'System',
        description: 'Системные эндпоинты'
      }
    ]
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Art Shop API Documentation'
}));

// JSON спецификация
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ================ База данных товаров ================
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
    image: "/images/мастихины.webp"
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

// ================ Swagger Schemas ================
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный идентификатор товара
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "Набор масляных красок «Мастер-класс»"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Краски"
 *         description:
 *           type: string
 *           description: Описание товара
 *           example: "Набор из 12 цветов масляных красок по 60 мл"
 *         price:
 *           type: integer
 *           description: Цена в рублях
 *           minimum: 0
 *           example: 3490
 *         stock:
 *           type: integer
 *           description: Количество на складе
 *           minimum: 0
 *           example: 15
 *         rating:
 *           type: number
 *           format: float
 *           description: Рейтинг товара (0-5)
 *           minimum: 0
 *           maximum: 5
 *           example: 4.9
 *         image:
 *           type: string
 *           description: Путь к изображению товара
 *           example: "/images/Краски_маслянные.jpg"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "Product not found"
 */

// ================ Вспомогательные функции ================
function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// ================ API Endpoints ================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить все товары
 *     description: Возвращает список всех товаров с возможностью фильтрации
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фильтр по категории
 *         example: "Краски"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: Минимальная цена
 *         example: 500
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Максимальная цена
 *         example: 5000
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Только товары в наличии
 *         example: true
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
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

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Получить все категории
 *     description: Возвращает список уникальных категорий товаров
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["Краски", "Кисти", "Холсты", "Бумага"]
 */
app.get("/api/products/categories", (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     description: Возвращает详细信息 о конкретном товаре
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     description: Добавляет новый товар в каталог
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название товара
 *                 example: "Новый набор кистей"
 *               category:
 *                 type: string
 *                 description: Категория товара
 *                 example: "Кисти"
 *               description:
 *                 type: string
 *                 description: Описание товара
 *                 example: "Набор профессиональных кистей из колонка"
 *               price:
 *                 type: integer
 *                 description: Цена в рублях
 *                 example: 1290
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *                 example: 10
 *               rating:
 *                 type: number
 *                 description: Рейтинг товара (опционально)
 *                 example: 4.5
 *               image:
 *                 type: string
 *                 description: Путь к изображению (опционально)
 *                 example: "/images/new-brushes.jpg"
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка в данных запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, rating, image } = req.body;

  if (!name?.trim() || !category?.trim() || !description?.trim()) {
    return res.status(400).json({ error: "Name, category and description are required" });
  }

  if (price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Price and stock are required" });
  }

  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
    image: image || "/images/placeholder.jpg"
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Обновить товар
 *     description: Частичное обновление информации о товаре
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара для обновления
 *         example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название
 *                 example: "Обновленное название"
 *               category:
 *                 type: string
 *                 description: Новая категория
 *                 example: "Новая категория"
 *               description:
 *                 type: string
 *                 description: Новое описание
 *                 example: "Обновленное описание"
 *               price:
 *                 type: integer
 *                 description: Новая цена
 *                 example: 3990
 *               stock:
 *                 type: integer
 *                 description: Новое количество
 *                 example: 20
 *               rating:
 *                 type: number
 *                 description: Новый рейтинг
 *                 example: 4.8
 *               image:
 *                 type: string
 *                 description: Новый путь к изображению
 *                 example: "/images/updated.jpg"
 *     responses:
 *       200:
 *         description: Обновленные данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Нет данных для обновления
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     description: Удаляет товар из каталога по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара для удаления
 *         example: "abc123"
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some(p => p.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "Product not found" });
  }

  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка работоспособности сервера
 *     description: Эндпоинт для проверки, что сервер работает
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Сервер работает
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 productsCount:
 *                   type: integer
 *                   example: 12
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    productsCount: products.length 
  });
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api-docs`);
  console.log(`📄 JSON спецификация: http://localhost:${port}/api-docs.json`);
});
