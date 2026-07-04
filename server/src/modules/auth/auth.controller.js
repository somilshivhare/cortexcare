import * as authService from './auth.service.js';

// Cookie helper configuration options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

/**
 * Handle POST /register
 */
export const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, specialty } = req.body;

    const result = await authService.registerUser({
      email,
      password,
      role,
      firstName,
      lastName,
      specialty,
    });

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    // Attach refresh token in HttpOnly secure cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    return res.status(201).json({
      message: 'Registration successful.',
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    console.error('Registration controller crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    if (!result.success) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    // Attach refresh token in HttpOnly secure cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      message: 'Login successful.',
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (err) {
    console.error('Login controller crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /refresh
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is missing.' });
    }

    let payload;
    try {
      payload = authService.verifyRefreshToken(refreshToken);
    } catch (jwtErr) {
      console.warn('Refresh token verification failed:', jwtErr.message);
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    // Check if user profile is still valid and active in database
    const userResult = await authService.getUserProfile(payload.id);
    if (!userResult.success) {
      return res.status(401).json({ error: 'User session no longer valid.' });
    }

    // Issue a new short-lived access token
    const newAccessToken = authService.generateAccessToken(userResult.user);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error('Token refresh controller crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle POST /logout
 */
export const logout = async (req, res) => {
  try {
    // Clear cookie values
    res.clearCookie('refreshToken', {
      ...COOKIE_OPTIONS,
      maxAge: 0, // Expire instantly
    });

    return res.status(200).json({
      message: 'Logged out successfully.',
    });
  } catch (err) {
    console.error('Logout controller crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Handle GET /me
 */
export const getMe = async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user.id);

    if (!result.success) {
      return res.status(result.status || 404).json({ error: result.error });
    }

    return res.status(200).json({
      user: result.user,
    });
  } catch (err) {
    console.error('Get profile controller crash:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
