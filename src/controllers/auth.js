import {
  registerUserService,
  loginUserService,
  logoutUserService,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const userData = await registerUserService(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken } = await loginUserService(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(204);
  }

  await logoutUserService(refreshToken);

  // Очищаємо кукі з рефреш токеном
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.sendStatus(204);
};
