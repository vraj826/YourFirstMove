export function validateEnvironment(): void {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (process.env.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  
  if (process.env.JWT_SECRET === 'your-secret-key' || 
      process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
    throw new Error('JWT_SECRET must not use the default example value');
  }
}
