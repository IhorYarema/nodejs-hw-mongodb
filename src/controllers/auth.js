import {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshUsersSession,
} from '../services/auth.js';

import { THIRTY_DAY } from '../constants/index.js';

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
  const { accessToken, refreshToken, sessionId } = await loginUserService(
    req.body,
  );

  // Встановлення refreshToken
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: THIRTY_DAY,
  });

  // Встановлення sessionId
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: THIRTY_DAY,
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

  // Очищаємо куки
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.sendStatus(204);
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + THIRTY_DAY),
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
