# icmern

A production-ready MERN starter template with batteries included: authentication (JWT + cookies), email verification with OTP, validation, error handling, pagination utilities, and a developer-friendly CLI to scaffold resources and bootstrap new projects quickly.

## Features

- Authentication with JWT (HTTP-only cookie in production)
- Email verification via OTP codes (Nodemailer + templated emails)
- Request validation using Joi and centralized validator middleware
- Centralized error handler with consistent API responses
- RESTful User CRUD (secured)
- Pagination utilities
- Security middleware (Helmet, CORS, Cookie Parser)
- MongoDB via Mongoose
- Developer CLI:
  - `init` to scaffold a fresh project from this template
  - `make:controller`, `make:model`, `make:route`, `make:middleware`, `make:factory`
- EJS view engine for server-rendered pages (configurable `view/` directory)

## Quick Start

```bash
# 1) Scaffold a new project (clean app package.json)
npx icmern init my-app
cd my-app

# 2) Install dependencies
npm install

# 3) Configure environment variables
cp .env.example .env   # (create .env and fill values)

# 4) Run development server
npm run dev
```

## Scripts

- `npm run dev`: Run with Nodemon on `server.js`
- `npm start`: Run with Node

## Environment Variables

Create a `.env` file in the project root with:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/icmern

# JWT
JWT_SECRET=your_jwt_secret_here

# HMAC (for OTP hashing if needed)
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret_here

# SMTP (email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@email
SMTP_PASS=your_password
```

## Project Structure

```
server.js                # Entry; loads app and starts HTTP server
app.js                   # Express app configuration
src/
  config/
    db.js                # MongoDB connection (Mongoose)
  controllers/
    authController.js    # register/login/logout, email verification
    userController.js    # CRUD for users (secured)
  middleware/
    authMiddleware.js    # Checks Authorization (JWT from header/cookie)
    errorHandler.js      # Central error handler
    validatorMiddleware.js # Joi schema validation
    uploadMiddleware.js  # (placeholder)
  models/
    User.js              # User schema with verification fields
  routes/
    api/
      authRouter.js      # /api/auth/* endpoints
      userRouter.js      # /api/users/* endpoints
    router.js            # example root router (welcome)
    web/
      index.js           # web router rendering EJS views
  templates/
    emailTemplates.js    # Nodemailer HTML templates
  utils/
    apiResponse.js       # success/error response helpers
    Cookies.js           # send/clear cookie helpers
    email.js             # nodemailer transporter + sendMail
    generateOTP.js       # numeric OTP generator
    hashing.js           # bcrypt password hashing
    jwt.js               # sign/verify JWT
    pagination.js        # pagination helper
view/
  index.ejs              # sample EJS page rendered at '/'
```

## API Overview

Base URL: `/api`

### Auth

- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Creates a user; returns created user (without password)

- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Verifies credentials, returns `{ token }` and sets cookie `Authorization` (Bearer token in production-safe mode)

- `POST /api/auth/logout`
  - Clears `Authorization` cookie

- `PATCH /api/auth/send-verification-code` (auth required)
  - Sends a 6-digit code to the user’s email and stores it with a 10-minute expiry

- `PATCH /api/auth/verify-verification-code` (auth required)
  - Body: `{ code }`
  - Marks user as `verified` when the code matches and is not expired

### Users (auth required)

- `GET /api/users` → Paginated users
  - Query: `page`, `limit`
- `GET /api/users/:id` → Single user
- `POST /api/users` → Create user (validated like register)
- `PUT /api/users/:id` → Update user
- `DELETE /api/users/:id` → Delete user

## Views (EJS)

EJS is configured in `app.js`:

```js
app.set('view engine', 'ejs');
app.set('views', 'view'); // use the 'view/' directory
```

- Web router at `src/routes/web/index.js` renders `view/index.ejs`:

```js
router.get('/', (req, res) => {
	return res.render('index', { title: 'Home', message: 'Welcome to EJS Home' });
});
```

- Render nested templates by placing files under `view/` and calling `res.render('folder/name', data)`.
- You can use partials with EJS includes: `<%- include('partials/header') %>`.

## Authentication Flow

- On login:
  - Password checked with `bcryptjs`
  - JWT created via `signToken(payload, '2h')`
  - Cookie `Authorization` is set to `Bearer <token>`
    - `httpOnly` and `secure` are enabled in production
- On protected routes:
  - `authMiddleware` extracts token from `Authorization` header or cookie
  - Verifies token using `verifyToken`
  - Attaches decoded payload to `req.user`

## Validation & Error Handling

- Validation middleware (`validate(schema)`) ensures request bodies match Joi schemas and aggregates errors per-field
- Central error handler returns a consistent JSON:

```json
{
  "status": "error",
  "message": "...",
  "stack": null
}
```

- Success helper returns:

```json
{
  "status": "success",
  "message": "...",
  "data": { }
}
```

## Email Delivery

- Configured via Nodemailer transporter using SMTP values from `.env`
- Templates live in `src/templates/emailTemplates.js`
- Use `sendMail({ to, subject, templateName, templateData })`

## CLI (Generators)

The `icmern` CLI provides handy generators and a project initializer.

- Initialize a new project (clean `package.json`):

```bash
npx icmern init my-app
```

- Generators (run inside a project):

```bash
icmern make:controller Posts
icmern make:model User
icmern make:route Users
icmern make:middleware Auth
icmern make:factory User
```

The generators create files in `src/` with sensible naming conventions and placeholder content.

## CORS & Security

- `helmet()` enabled for common security headers
- `cors()` is enabled with default configuration (adjust as needed)
- Cookies are set with production-safe flags

## Pagination

- `getPagination(query, defaultPage)` helper used by `userController.index`
- Returns `{ page, limit, skip }`; response includes `total` and `totalPages`

## Conventions

- RESTful controllers: `index`, `store`, `show`, `update`, `destroy`
- Consistent error objects: `{ statusCode, message }` (thrown and caught by error handler)

## Development Notes

- This template assumes ESM (`"type": "module"`)
- Requires Node.js 18+

## Publish to npm

1. Bump the version (choose one):
   - Patch: `npm version patch`
   - Minor: `npm version minor`
   - Major: `npm version major`
2. Ensure `files` in `package.json` includes all directories you want to publish (e.g. `src/`, `view/`, `server.js`, `app.js`).
3. Test tarball locally:
   - `npm pack`
   - Install in another project: `npm i ../path/to/icmern-<version>.tgz`
4. Login and publish:
   - `npm login`
   - `npm publish` (or `npm publish --access public` for first-time public scoped packages)

## License

ISC © Isam Chajia 