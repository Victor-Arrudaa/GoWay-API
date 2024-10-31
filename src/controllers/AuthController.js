import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { email, password, name, role, phone } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  const user = await User.create({
    email,
    password,
    name,
    role,
    phone
  });

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '7d'
  });

  res.status(201).json({ user, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '7d'
  });

  res.json({ user, token });
};