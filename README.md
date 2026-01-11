# Tallie Backend Assessment

A simple REST API built with Express and TypeScript for a restaurant table reservation system using Node.js.
This project demonstrates common API patterns, error handling, and documentation best practices.

---

## 📦 Setup Instructions

### Prerequisites

* Node.js ≥ 18
* bun, npm or yarn

---

### Installation

```bash
git clone https://github.com/cakezero/tallie-assessment.git
cd tallie-assessment
bun install
```

---

### Environment Variables

Create a `.env` file prefilled with the variables with the command below:

* Linux/MacOs

```bash
cp .env.example .env
```

* Windows

```bash
copy .env.example .env
```

---

### Run the tests
```bash
bun run test
```

Then run the API server
### Run the API

```bash
bun run dev
```

The server will start at:

```
http://localhost:<port-set-in-.env-file>
```

---

## 📚 API Documentation

### Base URL

```
/api/v1
```

---
# RESTAURANT
## 🔹 GET /restaurants

Fetch all restaurants.

### Request

```
GET /api/v1/restaurants
```

### 200 OK

```json
{
  "restaurants": [{
    "id": number,
    "name": "string",
    "openingTime": "string",
    "closingTime": "string",
    "noOfTables": number
  }],
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 GET /restaurant/:id

Fetch a restaurant with available tables.

### Request

```
GET /api/v1/restaurant/4
```

### 200 OK

```json
{
  "restaurant": {
    "id": number,
    "name": "string",
    "openingTime": "string",
    "closingTime": "string",
    "noOfTables": number,
    "tables": [{
      "id": number,
      "tableNo": "string",
      "capacity": number,
      "status": "string",
    }]
  },
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 POST /restaurant/create

Create a new restaurant.

### Request

```json
{
  "name": "string",
  "openingTime": "string",
  "closingTime": "string",
  "noOfTables": number,
}
```

### 201 CREATED

```json
{
  "message": "string"
}
```

### 400 Bad Request

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```
___
## 🔹 GET /restaurant/time-slot

Get available time slot for restaurant.

### Request

```
GET /api/v1/restaurant/time-slot
```

```json
{
  "size": number,
  "date": "string",
  "restaurant_id": number,
}
```

### 200 OK

```json
{
  "timeSlots": Array of time strings strings with 30 mins interval,
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---
# TABLE
## 🔹 GET /tables

Fetch all tables.

### Request

```
GET /api/v1/tables?restaurant_id=9
```

### 200 OK

```json
{
  "tables": [{
    "id": number,
    "tableNo": "string",
    "capacity": number,
    "status": "string",
    "restaurantId": number,
  }],
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 GET /table/:id

Fetch a table.

### Request

```
GET /api/v1/table/1?restaurant_id=6
```

### 200 OK

```json
{
  "table": {
    "id": number,
    "tableNo": "string",
    "capacity": number,
    "status": "string",
    "restaurantId": number,
  },
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---
## 🔹 POST /table/create

Create a new table.

### Request

```json
{
  "tableNo": "string",
  "capacity": number,
  "restaurant_id": number,
}
```

### 201 CREATED

```json
{
  "message": "string"
}
```

### 400 Bad Request

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```
___
# RESERVATION
## 🔹 GET /reservations
Fetch all reservations.

### Request

```
GET /api/v1/reservations?restaurant_id=9&date=2026-01-11
```

### 200 OK

```json
{
  "reservations": [{
    "id": number,
    "tableNo": "string",
    "customerName": "string",
    "phoneNumber": "string",
    "date": "string",
    "email": "string",
    "reservationStarts": "string",
    "reservationEnds": "string",
    "size": number,
    "duration": number,
    "status": "string",
    "restaurantId": number,
    "tableId": number,
  }],
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 POST /reservation/waitlist

Add a reservation to waitlist.

### Request
```
POST /api/v1/reservation/waitlist
```

```json
{
  "tableNo": "string",
  "customerName": "string",
  "phoneNumber": "string",
  "date": "string",
  "email": "string",
  "time": "string",
  "size": number,
  "duration": number,
  "restaurantId": number,
  "tableId": number,
}
```

### 200 OK

```json
{
  "message": "string"
}

```
### 400 Bad Request

```json
{
  "error": "string",
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 POST /reservation/create

Create a new reservation.

### Request
```
POST /api/v1/reservation/create
```

```json
{
  "tableNo": "string",
  "customerName": "string",
  "phoneNumber": "string",
  "date": "string",
  "email": "string",
  "time": "string",
  "size": number,
  "duration": number,
  "restaurantId": number,
  "tableId": number,
}
```

### 201 CREATED

```json
{
  "message": "string"
}
```

### 400 Bad Request

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```

---

## 🔹 PUT /reservation/:id

Update an existing reservation.

### Request

```
PUT /api/v1/reservation/2
```

```json
{
  "tableNo": "string",
  "customerName": "string",
  "phoneNumber": "string",
  "date": "string",
  "email": "string",
  "time": "string",
  "size": number,
  "duration": number,
  "restaurantId": number,
  "tableId": number,
}
```

### 200 OK

```json
{
  "message": "string"
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```
---

## 🔹 PATCH /reservation/:id

Cancel a reservation.

### Request

```
PATCH /api/v1/reservation/2
```

### 200 OK

```json
{
  "message": "string"
}
```

### 404 Not Found

```json
{
  "error": "string",
}
```

### 500 Internal Server Error

```json
{
  "error": "string",
}
```
---

## 🧱 Error Response Format

All errors follow a consistent structure:

```json
{
  "error": "Human readable explanation"
}
```

Common error codes:

* `BAD_REQUEST`
* `NOT_FOUND`
* `INTERNAL_SERVER_ERROR`

---

## 🧠 Design Decisions & Assumptions

* TypeScript is used for type safety and maintainability
* Layered architecture (routes, controllers, tests and utils)
* Consistent response shape across all endpoints
* JSON-only REST API
* Stateless design

---

## ⚠️ Known Limitations

* No authentication or authorization
* No user associated with restaurant and reservation
* No pagination or filtering
* No rate limiting

---

## 🚀 What I Would Improve With More Time

* Add authentication and authorization
* Implement pagination and filtering
* Add Redis TTL caching
* Dockerize the application

---
