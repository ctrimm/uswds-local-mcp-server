/**
 * Authentication Types
 */

import { type User } from '../../services/dynamodb-service.js';

export interface AuthResult {
  authenticated: boolean;
  user?: User;
  apiKey?: string;
  error?: string;
}
