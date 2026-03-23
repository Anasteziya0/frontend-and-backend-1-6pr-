const express = require('express');
const { nanoid } = require('nanoid');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

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

// База данных пользователей
let users = [
  { id: nanoid(6), name: 'Петр', age: 16 },
  { id: nanoid(6), name: 'Иван', age: 18 },
  { id: nanoid(6), name: 'Дарья', age: 20 },
];

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API управления пользователями',
      version: '1.0.0',
      description: 'Простое API для управления пользователями с полной документацией Swagger',
      contact: {
        name: 'Разработчик',
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
        name: 'Users',
        description: 'Операции с пользователями'
      }
    ]
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Подключаем Swagger UI по адресу /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Users API Documentation'
}));

// JSON спецификация
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Вспомогательная функция
function findUserOr404(id, res) {
  const user = users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  return user;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID пользователя
 *           example: "abc123"
 *         name:
 *           type: string
 *           description: Имя пользователя
 *           example: "Иван Петров"
 *         age:
 *           type: integer
 *           description: Возраст пользователя
 *           minimum: 0
 *           maximum: 150
 *           example: 25
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 *           example: "User not found"
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создание нового пользователя
 *     description: Добавляет нового пользователя в систему
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя пользователя
 *                 example: "Анна Смирнова"
 *               age:
 *                 type: integer
 *                 description: Возраст пользователя
 *                 minimum: 0
 *                 maximum: 150
 *                 example: 22
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка в данных запроса
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/users", (req, res) => {
  const { name, age } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  
  const ageNum = Number(age);
  if (age === undefined || isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
    return res.status(400).json({ error: "Valid age (0-150) is required" });
  }

  const newUser = {
    id: nanoid(6),
    name: name.trim(),
    age: ageNum,
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Возвращает список всех пользователей
 *     description: Получает полный список пользователей из базы данных
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получает пользователя по ID
 *     description: Возвращает данные конкретного пользователя по его уникальному идентификатору
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор пользователя
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = findUserOr404(id, res);
  if (!user) return;
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Обновляет данные пользователя
 *     description: Частичное обновление информации о пользователе
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя для обновления
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
 *                 description: Новое имя пользователя
 *                 example: "Петр Иванов"
 *               age:
 *                 type: integer
 *                 description: Новый возраст
 *                 minimum: 0
 *                 maximum: 150
 *                 example: 26
 *     responses:
 *       200:
 *         description: Обновленные данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Нет данных для обновления или неверный формат
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.patch("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const user = findUserOr404(id, res);
  if (!user) return;

  if (req.body?.name === undefined && req.body?.age === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, age } = req.body;
  
  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    user.name = name.trim();
  }
  
  if (age !== undefined) {
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ error: "Age must be a number between 0 and 150" });
    }
    user.age = ageNum;
  }

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Удаляет пользователя
 *     description: Удаляет пользователя из системы по ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID пользователя для удаления
 *         example: "abc123"
 *     responses:
 *       204:
 *         description: Пользователь успешно удален (нет тела ответа)
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const exists = users.some((u) => u.id === id);
  
  if (!exists) {
    return res.status(404).json({ error: "User not found" });
  }

  users = users.filter((u) => u.id !== id);
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
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    usersCount: users.length 
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
  console.log(` Сервер запущен на http://localhost:${port}`);
  console.log(` Swagger документация: http://localhost:${port}/api-docs`);
  console.log(` JSON спецификация: http://localhost:${port}/api-docs.json`);
});