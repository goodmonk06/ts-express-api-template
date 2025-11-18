import { Response } from 'express';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger.config';
import { CreateUserDto, LoginDto, UpdateUserDto } from '../validators/user.validator';

export class UserController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data: CreateUserDto = req.body;

      const existingUser = await userService.findUserByEmail(data.email);
      if (existingUser) {
        res.status(400).json({
          status: 'error',
          message: 'User with this email already exists',
        });
        return;
      }

      const user = await userService.createUser(data);
      const token = authService.generateToken(user.id);

      res.status(201).json({
        status: 'success',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to register user',
      });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      const user = await userService.validateUser(email, password);

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid email or password',
        });
        return;
      }

      const token = authService.generateToken(user.id);

      res.json({
        status: 'success',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      logger.error(`Login error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to login',
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }

      const user = await userService.findUserById(req.userId);

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
        return;
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      logger.error(`Get profile error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get profile',
      });
    }
  }

  async getAllUsers(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();

      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      logger.error(`Get all users error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get users',
      });
    }
  }

  async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userService.findUserById(id);

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
        return;
      }

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      logger.error(`Get user by ID error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get user',
      });
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }

      const data: UpdateUserDto = req.body;

      const user = await userService.updateUser(req.userId, data);

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      logger.error(`Update user error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update user',
      });
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
        return;
      }

      await userService.deleteUser(req.userId);

      res.json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error(`Delete user error: ${error}`);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete user',
      });
    }
  }
}

export const userController = new UserController();
