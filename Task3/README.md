# Task 3 - User Management REST API

## Overview

A user management REST API built with **Node.js**, **Express**, **SQLite**, and **bcrypt** for a Backend Development Intern technical assessment. It supports creating, reading, updating, and deleting users (CRUD), with records stored in a local SQLite database.

## Features

- Create users, list users, retrieve one user, update users, and delete users.
- Required-field validation for name, email, and password on create and update.
- A unique email constraint enforced by SQLite.
- bcrypt password hashing with 10 salt rounds.
- JSON success responses and explicit route error responses with HTTP status codes.
- SQLite persistence across server restarts.
- GET responses contain only ID, name, and email; passwords and hashes are not returned.
- Parameterized SQL queries for operations that accept user input.

## Requirements

Node.js and npm must be installed. Check them with:

```sh
node --version
npm --version
```

The examples below use PowerShell. See **Limitations** for the existing filename-casing issue on case-sensitive systems.

## Installation

After cloning the repository, open a terminal in the repository root:

```sh
cd Task3
npm install
```

`npm install` installs the dependencies declared in `package.json`, using `package-lock.json` to resolve locked versions. The declared dependencies are:

| Package | Version range | Purpose |
| --- | --- | --- |
| `express` | `^5.2.1` | HTTP server and routing |
| `sqlite3` | `^6.0.1` | SQLite database access |
| `bcrypt` | `^6.0.0` | Password hashing |
| `express-validator` | `^7.3.2` | Installed, but not used by the current routes |

Required-field validation is implemented directly in the route handlers.

## Running the Server

From the `Task3` directory, run:

```sh
node server.js
```

The project also defines a `start` script for the same command:

```sh
npm start
```

Server address: `http://localhost:3000`

On a successful startup, the terminal displays these messages (their order may vary):

```text
Server running on http://localhost:3000
Connected to database
```

Keep this terminal open while testing. Use a second terminal for requests, and press `Ctrl+C` in the server terminal to stop the application. Port `3000` is set directly in `server.js`; no environment-variable configuration is required.

## Test the Base Route

Open `http://localhost:3000` in a browser, or run:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
```

Expected JSON (`200 OK`):

```json
{
  "message": "User Management API is running"
}
```

PowerShell normally displays parsed JSON as objects or tables. Pipe a successful request to `ConvertTo-Json` if you want to see JSON text.

## API Endpoints

| Method | Endpoint | Purpose | Success Status |
| --- | --- | --- | --- |
| POST | `/api/users` | Create a user | `201 Created` |
| GET | `/api/users` | List users | `200 OK` |
| GET | `/api/users/:id` | Get a single user | `200 OK` |
| PUT | `/api/users/:id` | Update a user | `200 OK` |
| DELETE | `/api/users/:id` | Delete a user | `200 OK` |

For POST and PUT, send a JSON body with `Content-Type: application/json`. IDs in the following examples are illustrative: replace `1` with the ID returned when you create a user. Use email addresses that are not already stored.

## Create User

```text
POST http://localhost:3000/api/users
```

Request body:

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "password": "123456"
}
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Ali","email":"ali@example.com","password":"123456"}'
```

Example response (`201 Created`):

```json
{
  "message": "User created successfully",
  "id": 1,
  "name": "Ali",
  "email": "ali@example.com"
}
```

The ID is generated automatically. The password is hashed with bcrypt before it is saved; neither the password nor its hash is included in the response.

## Get All Users

```text
GET http://localhost:3000/api/users
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET
```

Example response (`200 OK`):

```json
[
  {
    "id": 1,
    "name": "Ali",
    "email": "ali@example.com"
  }
]
```

The response is an array; an empty database returns `[]`. Passwords and password hashes are not returned.

## Get User By ID

```text
GET http://localhost:3000/api/users/1
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method GET
```

Example response (`200 OK`):

```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@example.com"
}
```

If the ID does not exist, the API returns `404 Not Found`. PowerShell's `Invoke-RestMethod` treats non-2xx responses as exceptions. Use `try`/`catch` to inspect the error body:

```powershell
# Use an ID that does not exist in your database.
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users/999999" -Method GET
}
catch {
    $_.ErrorDetails.Message
}
```

Expected error for a missing user:

```json
{
  "error": "User not found"
}
```

## Update User

```text
PUT http://localhost:3000/api/users/1
```

All three fields are required, including the password. This endpoint does not support partial updates. The new password is hashed before storage.

Request body:

```json
{
  "name": "Ali Khan",
  "email": "alikhan@example.com",
  "password": "654321"
}
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method PUT -ContentType "application/json" -Body '{"name":"Ali Khan","email":"alikhan@example.com","password":"654321"}'
```

Example response (`200 OK`):

```json
{
  "message": "User updated successfully",
  "id": 1,
  "name": "Ali Khan",
  "email": "alikhan@example.com"
}
```

A valid update request for a missing user returns `404` with `{"error":"User not found"}`. Database errors during an update, including a duplicate email, return `400` with `{"error":"User could not be updated"}`.

## Delete User

```text
DELETE http://localhost:3000/api/users/1
```

PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method DELETE
```

Response (`200 OK`):

```json
{
  "message": "User deleted successfully"
}
```

Repeat the request after deleting that user to test the missing-user response:

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method DELETE
}
catch {
    $_.ErrorDetails.Message
}
```

Expected response (`404 Not Found`):

```json
{
  "error": "User not found"
}
```

## Validation Testing

Both POST and PUT check that `name`, `email`, and `password` have truthy values. Missing fields and empty strings fail this check. For example, send only a name:

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Ali"}'
}
catch {
    $_.ErrorDetails.Message
}
```

Expected response (`400 Bad Request`):

```json
{
  "error": "All fields are required"
}
```

This checks field presence, not email format or password strength. Whitespace-only strings are not rejected by this check.

## Duplicate Email Testing

The `email` column has a SQLite `UNIQUE` constraint. First create a user, then attempt to create another with the same email. Use an email that is not already present for the first request:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"First User","email":"duplicate@example.com","password":"123456"}'

try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Second User","email":"duplicate@example.com","password":"123456"}'
}
catch {
    $_.ErrorDetails.Message
}
```

The first request returns `201 Created`. The second returns `400 Bad Request` with:

```json
{
  "error": "Email already exists"
}
```

The first user remains in the database. On PUT, duplicate-email errors use the different message `User could not be updated`, also with status `400`.

## HTTP Status Codes

| Status | Meaning in this API |
| --- | --- |
| `200 OK` | Successful base-route, read, update, or delete request |
| `201 Created` | User created successfully |
| `400 Bad Request` | Missing required fields, duplicate email on create, or database error on update |
| `404 Not Found` | Requested user does not exist |
| `500 Internal Server Error` | Other handled database or server failures |

Handled database failures use these messages: `User could not be created`, `Could not get users`, `Could not get user`, and `User could not be deleted`. Exceptions caught during creation or update return `Server error`. These messages are returned in an `error` property.

## Database

The API uses SQLite. `database.js` opens or creates `users.db` and creates the `users` table automatically if it does not exist. No separate database server is required.

The path is `./users.db`, relative to the directory where Node is started. Run the server from `Task3` to use the database in that folder.

| Column | Type | Constraints / stored value |
| --- | --- | --- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `name` | `TEXT` | `NOT NULL` |
| `email` | `TEXT` | `NOT NULL UNIQUE` |
| `password` | `TEXT` | `NOT NULL`; stores the bcrypt hash |

## Database Persistence

Users remain stored after restarting the Node server, assuming the same `users.db` file is used. To verify this manually, create a user and note its returned ID, stop the server with `Ctrl+C`, restart it from `Task3`, and retrieve the user by that ID. Perform this check before deleting the user.

## Project Structure

```text
Task3/
|-- Routes/
|   `-- Users.js       # User CRUD routes
|-- node_modules/      # Installed dependencies
|-- database.js        # SQLite connection and table creation
|-- server.js          # Express setup and server startup
|-- package.json       # Dependencies and npm scripts
|-- package-lock.json  # Locked dependency versions
|-- users.db           # Local SQLite database
`-- README.md          # Setup and API documentation
```

These names reflect the actual project casing. If `users.db` is absent, it is generated automatically when the application runs.

## .gitignore

There is currently no `Task3/.gitignore` or repository-root `.gitignore`. Neither `users.db` nor `node_modules/` is currently ignored by Git. Installing dependencies generates `node_modules/`; this directory should not be committed.

## Testing the API from a Second PowerShell Terminal

In the first terminal, open the `Task3` directory and start the server:

```powershell
node server.js
```

Keep this server terminal running. Open a **second PowerShell terminal** to execute the manual API requests below.

Copy only the commands inside the code blocks. PowerShell automatically displays a `>>` continuation prompt when a command continues onto another line; it is not part of the command and should not be typed or copied. The requests below use one-line commands where possible.

### Create a User

Use an email that is not already stored:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Ali","email":"ali@example.com","password":"123456"}'
```

This returns `201 Created`, the created user's details, and a generated ID. For example:

```json
{"message":"User created successfully","id":1,"name":"Ali","email":"ali@example.com"}
```

Use the returned ID in subsequent requests. To test duplicate email rejection using the example below, run that test immediately after creation, before updating or deleting this user.

### Get All Users

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method GET
```

Returns `200 OK` with an array of users containing `id`, `name`, and `email`. Passwords and hashes are omitted.

### Get a Single User

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method GET
```

Replace `1` with the ID of the user you created. A matching user returns `200 OK` with its `id`, `name`, and `email`.

### Update a User

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method PUT -ContentType "application/json" -Body '{"name":"Ali Khan","email":"alikhan@example.com","password":"654321"}'
```

Replace `1` with the created user's ID and ensure the new email is not used by another user. All three fields are required, and the new password is hashed. Example response (`200 OK`):

```json
{"message":"User updated successfully","id":1,"name":"Ali Khan","email":"alikhan@example.com"}
```

### Delete a User

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/users/1" -Method DELETE
```

Replace `1` with the created user's ID. A successful deletion returns `200 OK`:

```json
{"message":"User deleted successfully"}
```

### Test a User That Does Not Exist

`Invoke-RestMethod` treats non-2xx responses as exceptions. Use `try`/`catch` to display the error body. Choose an ID that does not exist; this example assumes `99` is absent:

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users/99" -Method GET
}
catch {
    $_.ErrorDetails.Message
}
```

Expected response (`404 Not Found`):

```json
{"error":"User not found"}
```

### Test Missing Required Fields

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Ali"}'
}
catch {
    $_.ErrorDetails.Message
}
```

Expected response (`400 Bad Request`):

```json
{"error":"All fields are required"}
```

### Test a Duplicate Email

Run this while a user with `ali@example.com` still exists, before the update or deletion above. If you have already updated or deleted that user, run **Create a User** again first to restore that email in the database.

```powershell
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method POST -ContentType "application/json" -Body '{"name":"Test","email":"ali@example.com","password":"123456"}'
}
catch {
    $_.ErrorDetails.Message
}
```

Expected response (`400 Bad Request`):

```json
{"error":"Email already exists"}
```

The first terminal must remain running throughout these tests.

