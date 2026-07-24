# LeadDesk Mini

LeadDesk Mini is a full-stack MERN application that allows visitors to submit leads through a public landing page while providing an authenticated admin dashboard to manage those leads.

## Tech Stack

- React.js (Vite)
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Tailwind CSS
- React Hook Form
- Zod

---

# Features

## Public

- Responsive landing page
- Lead capture form
- Client-side validation
- Server-side validation
- Stores leads in MongoDB

## Admin

- Secure login
- Protected dashboard
- Search leads
- Update lead status
- Responsive interface

---

# Data Model

## Lead

```javascript
{
  name: String,
  email: String,
  budget: String,
  message: String,
  status: {
    type: String,
    enum: ["New", "Contacted", "Closed"],
    default: "New"
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Field Description

| Field | Description |
|--------|-------------|
| name | Lead's full name |
| email | Lead's email address |
| budget | Selected budget range |
| message | User inquiry |
| status | Current lead status |
| createdAt | Submission timestamp |
| updatedAt | Last update timestamp |

---

## Admin

```javascript
{
  name: String,
  email: String,
  password: String
}
```

The password is securely hashed before being stored in MongoDB.

---

# Authentication Approach

Authentication is implemented using **JWT (JSON Web Tokens)** and **bcryptjs**.

### Login Flow

1. Admin enters email and password.
2. Server checks whether the email exists.
3. Password is verified using bcrypt.
4. If valid, the server generates a JWT.
5. The token is stored in an HttpOnly cookie (or Authorization header, depending on implementation).
6. Protected routes verify the token before granting access.

### Security

- Passwords are hashed using bcrypt.
- JWT is signed with a secret key stored in environment variables.
- Protected middleware prevents unauthorized access.
- Sensitive credentials are never stored in plain text.

---

# Project Structure

```
client/
server/
controllers/
models/
routes/
middleware/
config/
```

---

Live Project Link : https://leaddesk-cyan.vercel.app/


# Credits

Built for **Digital Heroes Training Task**

https://digitalheroesco.com
