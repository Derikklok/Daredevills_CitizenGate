# Clerk Setup Guide

## Environment Variables

Create a `.env` file in the server root directory with the following variables:

```env
# Clerk Configuration
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Node Environment
NODE_ENV=development
```

## Getting Your Clerk Keys

1. **Sign up/Login to Clerk**: Go to [clerk.com](https://clerk.com) and create an account
2. **Create a new application**: Set up a new application in your Clerk dashboard
3. **Get your keys**:
   - Go to the "API Keys" section in your Clerk dashboard
   - Copy your "Secret Key" (starts with `sk_test_` or `sk_live_`)
   - Copy your "Publishable Key" (starts with `pk_test_` or `pk_live_`)

## Security Notes

- **Never commit your `.env` file** to version control
- **Use test keys** for development and **live keys** for production
- **Keep your secret key secure** - it has full access to your Clerk account

## Testing the Integration

Once you've set up your environment variables, you can test the auth system:

1. **Start the server**: `pnpm start:dev`
2. **Make a request** to any protected endpoint with a valid Clerk JWT token
3. **Check the logs** to see if authentication is working

## Example Request

```bash
curl -X GET http://localhost:3000/api-management/profile \
  -H "Authorization: Bearer YOUR_CLERK_JWT_TOKEN"
```

## Troubleshooting

- **"CLERK_SECRET_KEY environment variable is required"**: Make sure your `.env` file is in the server root directory
- **"Invalid token"**: Ensure you're using a valid Clerk JWT token
- **"User not authenticated"**: Check that your token is properly formatted and not expired
