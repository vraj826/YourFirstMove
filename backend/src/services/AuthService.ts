import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ProductivityStreak from '../models/ProductivityStreak';
import UserPreference from '../models/UserPreference';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(userData: RegisterDTO): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await User.query().findOne({ email: userData.email });
      if (existingUser) {
        const error = new Error('User with this email already exists') as any;
        error.statusCode = 400;
        error.code = 'USER_ALREADY_EXISTS';
        throw error;
      }

      // Hash password
      const passwordHash = await this.hashPassword(userData.password);

      // Create user
      const user = await User.query().insert({
        email: userData.email,
        password_hash: passwordHash,
        name: userData.name,
        phone_number: userData.phoneNumber,
      });

      // Create default productivity streak
      await ProductivityStreak.query().insert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
      });

      // Create default preferences
      await UserPreference.query().insert({
        user_id: user.id,
        theme: 'light',
        notification_enabled: true,
        notification_timing: 30,
      });

      logger.info(`User registered: ${user.email}`);
      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginDTO): Promise<{ user: User; token: string }> {
    try {
      // Find user by email
      const user = await User.query().findOne({ email: credentials.email });
      if (!user) {
        const error = new Error('Invalid credentials') as any;
        error.statusCode = 401;
        error.code = 'UNAUTHORIZED';
        throw error;
      }

      // Verify password
      const isValid = await this.comparePassword(credentials.password, user.password_hash);
      if (!isValid) {
        const error = new Error('Invalid credentials') as any;
        error.statusCode = 401;
        error.code = 'UNAUTHORIZED';
        throw error;
      }

      // Generate JWT token
      const token = this.generateToken(user.id);

      logger.info(`User logged in: ${user.email}`);
      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await User.query().findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Token validation error:', error);
      throw new Error('Invalid token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  async getUserById(userId: number): Promise<User | undefined> {
    return User.query().findById(userId);
  }
}

export default new AuthService();
