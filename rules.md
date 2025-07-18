# Uttranchal Tennis Association Website - MERN Stack Best Practices

## Overview

This document outlines recommended coding practices and guidelines for developing the Uttranchal Tennis Association website using the MERN (MongoDB, Express.js, React, Node.js) stack, especially when interacting with the Gemini CLI. Adhering to these practices ensures code quality, maintainability, scalability, and prevents unintended modifications by the CLI.

## Project Information

**Purpose:** Full-stack web application for the Uttranchal Tennis Association
**Stack:** MERN (MongoDB, Express.js, React, Node.js)
**Target Audience:** Players, organizers, administrators, and the general public

### Key Features

- Player registration and profiles
- Tournament creation and management
- Match scheduling and results tracking
- News and announcements
- User authentication (players, organizers, admins)

## Project Structure

```
uttranchal-tennis-association/
├── client/                     # React.js Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Top-level route components
│   │   ├── context/           # React Context API
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── services/          # API client/data fetching
│   │   ├── utils/             # Helper functions, constants
│   │   ├── assets/            # Images, fonts, CSS/SCSS
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── server/                     # Node.js/Express.js Backend
│   ├── config/                # Database connection, middleware
│   ├── controllers/           # Business logic, request handling
│   ├── models/                # Mongoose schemas/models
│   ├── routes/                # API endpoint definitions
│   ├── middleware/            # Custom Express middleware
│   ├── utils/                 # Helper functions, validation
│   ├── server.js              # Main entry point
│   └── package.json
├── .env                       # Environment variables
├── .gitignore
├── README.md
└── GEMINI.md                  # Project context for Gemini CLI
```

## 1. Project Setup and File Management

### Best Practices

#### Explicitly Define Project Root

- Always ensure your terminal's current working directory is the root of your MERN project when invoking the Gemini CLI
- This helps the CLI understand the full context across both frontend and backend

#### Target Specific Files/Directories

Be as specific as possible when asking the CLI to generate or modify code:

**Frontend Example:**

```bash
# Instead of: "add a new component"
# Use: "add a new PlayerCard component to client/src/components/players/PlayerCard.jsx"
```

**Backend Example:**

```bash
# Instead of: "create a new route"
# Use: "create a new route for GET /api/matches/:id in server/routes/matchRoutes.js"
```

#### Version Control (Git)

- **Non-negotiable:** Use Git for version control
- Commit changes frequently
- Review CLI changes before accepting

```bash
git status              # See modified files
git diff <file>         # See specific changes
git restore <file>      # Discard changes
git commit -m "message" # Save good changes
```

## 2. Security Best Practices

### 2.1 Environment Variables and Secrets

#### ✅ Do:

- Use `.env` files for sensitive information (MongoDB URI, JWT secret, API keys)
- Use `dotenv` package in Node.js to load environment variables
- Add `.env` to `.gitignore`
- Manage separate configurations for development, testing, and production

#### ❌ Don't:

- Never hardcode secrets in your code
- Never expose secrets in client-side code (React code is public)
- Never commit `.env` files to version control

### 2.2 Authentication and Authorization

#### ✅ Do:

- **Use JWT (JSON Web Tokens)** for stateless authentication
- Sign tokens with a strong, long secret key (stored in `.env`)
- Set appropriate expiration times for tokens
- Store JWTs securely (HTTP-only cookies preferred)
- Implement role-based access control (RBAC)
- Hash passwords using `bcrypt` before storing in MongoDB
- Validate and sanitize all user input on both client and server

#### ❌ Don't:

- Store plain text passwords
- Trust client-side validation alone
- Expose sensitive user data in JWT payloads

### 2.3 API Security (Express.js)

#### ✅ Do:

- Use HTTPS in production
- Configure CORS correctly
- Implement rate limiting (`express-rate-limit`)
- Sanitize user input (prevent NoSQL injection)
- Use security headers (`helmet.js`)
- Regularly update dependencies (`npm audit`)

## 3. Node.js (Express.js) Best Practices

### Architecture Patterns

- **Modular Routing:** Organize routes into separate files (`server/routes/`)
- **Controller-Service Pattern:** Separate business logic from route handling
- **Centralized Error Handling:** Global error handling middleware

### Code Quality

- **Use async/await** for all asynchronous operations
- **Implement logging** with Winston or Morgan
- **Validate data** at Mongoose schema level
- **Use database indexing** for frequently queried fields
- **Implement connection pooling** (Mongoose handles this by default)

### Example Controller Structure

```javascript
// server/controllers/playerController.js
const Player = require("../models/Player");

exports.getPlayers = async (req, res, next) => {
  try {
    const players = await Player.find({ isActive: true });
    res.json(players);
  } catch (error) {
    next(error);
  }
};
```

## 4. React.js Best Practices

### Component Architecture

#### ✅ Do:

- **Decompose into small, reusable components**
- **Use Functional Components with Hooks**
- **Avoid excessive prop drilling** (use Context API or Redux)
- **Use PascalCase for components** (e.g., `PlayerForm`, `MatchListItem`)
- **Use camelCase for props and functions**

### State Management

- **Choose appropriate state management:**
  - `useState` + `useContext` for simple state
  - Redux Toolkit for complex global state
- **Lift state up only when necessary**

### Performance Optimization

#### ✅ Do:

- **Memoization:** Use `React.memo`, `useCallback`, `useMemo`
- **Lazy Loading:** Use `React.lazy` and `Suspense`
- **Optimize API Calls:** Use React Query or SWR
- **Virtualization:** Use `react-window` for long lists

### Forms and Validation

- Use controlled components for forms
- Implement client-side validation with Formik + Yup
- Remember: server-side validation is still mandatory

### Accessibility (A11y)

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Use ARIA attributes where necessary

## 5. Documentation and Gemini CLI Interaction

### GEMINI.md File

Maintain a `GEMINI.md` file at the project root:

```markdown
# Uttranchal Tennis Association Website (MERN Stack)

This project is a full-stack web application for the Uttranchal Tennis Association.

**Stack:** MERN (MongoDB, Express.js, React, Node.js)
**Frontend (`client/`):** React with Functional Components and Hooks
**Backend (`server/`):** Node.js with Express.js, MongoDB with Mongoose
**Authentication:** JWT-based authentication with role-based access control

**Key Areas:**

- User Authentication & Authorization (Player, Organizer, Admin roles)
- CRUD operations for Players, Tournaments, Matches
- Responsive UI for desktop and mobile

**Code Style:** Follows standard JavaScript/React/Node.js best practices
```

### Effective CLI Prompts

#### ✅ Good Examples:

```bash
# Frontend Component
"In client/src/components/forms/PlayerRegistrationForm.jsx, create a React functional component for player registration. It should use useState for form fields: name, email, password. Include basic client-side validation for email format. When submitted, it should call an API endpoint /api/auth/register with POST request."

# Backend Model
"In server/models/Player.js, define a Mongoose schema for a Player. Include fields: name (String, required), email (String, unique, required), password (String, required), rank (Number, default 0), isActive (Boolean, default true). Ensure password is hashed before saving."
```

### CLI Best Practices

- **Be explicit in prompts** with context, technology, file path, and desired outcome
- **Use iterative development** for small, focused tasks
- **Test after generation** to ensure functionality
- **Provide feedback** if CLI output isn't suitable
- **Review changes carefully** before accepting

### Leverage CLI Features

- `--model`: Specify Gemini model for different task types
- `read-file <path>`: Load specific file content into CLI context
- `edit <path>`: Apply proposed changes (review diff first)

## 6. Development Workflow

### Before Starting Development

1. Set up proper project structure
2. Configure environment variables
3. Set up Git repository
4. Create `GEMINI.md` file
5. Install and configure linting tools

### During Development

1. Make small, focused commits
2. Review all CLI-generated code
3. Run tests after incorporating changes
4. Use meaningful commit messages
5. Keep dependencies updated

### Code Review Checklist

- [ ] Security: No hardcoded secrets, proper validation
- [ ] Performance: Optimized queries, memoization where needed
- [ ] Accessibility: Semantic HTML, ARIA attributes
- [ ] Testing: Unit tests pass, integration tests work
- [ ] Documentation: Code is self-documenting, complex logic explained

## 7. Technologies and Libraries

### Frontend (React)

- **State Management:** React Context API / Redux Toolkit
- **Forms:** Formik + Yup
- **HTTP Client:** Axios
- **Styling:** CSS Modules / Styled Components / Tailwind CSS
- **Testing:** Jest + React Testing Library

### Backend (Node.js)

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator / Joi
- **Security:** helmet, cors, express-rate-limit
- **Logging:** Winston / Morgan

### Development Tools

- **Linting:** ESLint + Prettier
- **Testing:** Jest + Supertest
- **API Documentation:** Swagger/OpenAPI
- **Environment Management:** dotenv

## 8. Deployment Considerations

### Environment Setup

- Separate configurations for development, staging, and production
- Use environment variables for all configuration
- Implement proper logging and monitoring

### Security in Production

- Enable HTTPS
- Configure security headers
- Implement rate limiting
- Regular security audits
- Keep dependencies updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards outlined in this document
4. Write tests for new features
5. Submit a pull request with a clear description

## License

[Add your license information here]

---

**Note:** This document should be kept up-to-date as the project evolves. Regular reviews and updates ensure continued adherence to best practices and compatibility with new technologies.
