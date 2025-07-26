import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/user.js';
import { SessionsCollection } from '../db/session.js';
import jwt from 'jsonwebtoken';

export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    name,
    email,
    password: hashedPassword,
  });

  // Видаляємо пароль з об'єкта перед поверненням
  const userToReturn = {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };

  return userToReturn;
};

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

export const loginUserService = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Видаляємо попередню сесію
  await SessionsCollection.findOneAndDelete({ userId: user._id });

  // Генерація токенів
  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

  // Визначаємо час дії токенів
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хвилин
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ); // 30 днів

  // Створюємо нову сесію
  await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const logoutUserService = async (refreshToken) => {
  await SessionsCollection.findOneAndDelete({ refreshToken });
};
