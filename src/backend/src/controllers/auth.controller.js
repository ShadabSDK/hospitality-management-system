const authService = require('../services/auth.service');
const { catchAsync } = require('../utils/helpers');

class AuthController {
  register = catchAsync(async (req, res) => {
    const { email, password, tenantName, restaurantName } = req.body;

    const result = await authService.register(email, password, tenantName, restaurantName);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful',
    });
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  });

  refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
      message: 'Token refreshed successfully',
    });
  });

  getMe = catchAsync(async (req, res) => {
    res.json({
      success: true,
      data: {
        user: req.user,
        tenant: req.tenant,
      },
    });
  });
}

module.exports = new AuthController();

