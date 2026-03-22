import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { hashPassword, comparePassword } from './components/hash.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://to-do-list-rho-sable-68.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.set('trust proxy', 1);

app.use(
  session({
    name: 'todo_sid',
    secret: process.env.SESSION_SECRET || 'secure-session-key-2026', 
    resave: false, 
    saveUninitialized: false,
    proxy: true, 
    cookie: {
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge: 24 * 60 * 60 * 1000 
    }
  })
);

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.status(401).json({ error: "Unauthorized access. Please login." });
};

// --- AUTH ROUTES ---

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      'INSERT INTO user_accounts (username, password) VALUES ($1, $2) RETURNING user_id, username',
      [username, hashedPassword]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, error: "Username already exists." });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM user_accounts WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, message: "User not found." });
    
    const user = result.rows[0];
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Wrong credentials." });
    
    req.session.user = { id: user.user_id, username: user.username };
    req.session.save((err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true, user: { username: user.username } });
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false });
    res.clearCookie('todo_sid', { 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' 
    });
    res.json({ success: true });
  });
});

// --- LIST API ---

app.get('/api/list', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list WHERE user_id = $1 ORDER BY list_id ASC', [req.session.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/list', isAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO list (user_id, title) VALUES ($1, $2) RETURNING *', [req.session.user.id, title]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/list/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await pool.query('UPDATE list SET title = $1 WHERE list_id = $2 AND user_id = $3', [title, id, req.session.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/list/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM list WHERE list_id = $1 AND user_id = $2', [id, req.session.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- ITEMS API ---

app.get('/api/items/:list_id', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items WHERE list_id = $1 ORDER BY item_id ASC', [req.params.list_id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/items', isAuthenticated, async (req, res) => {
  try {
    const { list_id, description } = req.body;
    const result = await pool.query('INSERT INTO items (list_id, description, is_completed) VALUES ($1, $2, $3) RETURNING *', [list_id, description, false]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/items/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_completed, description } = req.body;
    if (is_completed !== undefined) await pool.query('UPDATE items SET is_completed = $1 WHERE item_id = $2', [is_completed, id]);
    if (description !== undefined) await pool.query('UPDATE items SET description = $1 WHERE item_id = $2', [description, id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/items/:id', isAuthenticated, async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE item_id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));