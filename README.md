# EcommerceShop Carts Microservice

Manages one shopping cart per user: read the cart, add items, update quantities and remove items.

This service is one of seven Express/MongoDB microservices (auth, users, products, categories, carts, orders, favorites) that together form the backend of the EcommerceShop MERN application. Each service owns its routes under `/api/carts`, connects to MongoDB through Mongoose and exposes Prometheus metrics, so it can be built, deployed, scaled and monitored independently on Kubernetes.

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/carts` | Get the cart of the authenticated user |
| POST | `/api/carts` | Add an item to the cart |
| PUT | `/api/carts/update` | Update the quantity of a cart item |
| DELETE | `/api/carts/remove` | Remove an item from the cart |
| GET | `/api/carts/metrics` | Prometheus metrics |

> Every route requires an `Authorization: Bearer <token>` header with a token issued by the auth service.

Data model: `Cart` (user, items with product, quantity, name, price, image; lastUpdated).

## Tech stack

- Node.js 22, Express 5 (ES modules)
- MongoDB with Mongoose
- prom-client (HTTP request duration histogram)
- jsonwebtoken (declared dependency)
- Docker (node:22-alpine, non-root user)

## Environment variables

Copy `.env.example` to `.env` and set your own values. Never commit `.env`.

| Variable | Description |
|---|---|
| `PORT` | HTTP port (defaults to 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret shared with the auth service to verify tokens |

## Run locally

```bash
npm install
cp .env.example .env   # then edit the values
npm start
```

The service listens on `http://localhost:5000` by default.

## Tests

Integration tests use Node's built-in test runner and Supertest against a real MongoDB:

```bash
docker run -d --name mongo -p 27017:27017 mongo:9.0
MONGO_URI=mongodb://127.0.0.1:27017 npm test
```

CI runs the same suite with a MongoDB service container on every push and pull request.

## Docker

```bash
docker build -t ecommerceshop-carts .
docker run --env-file .env -p 5000:5000 ecommerceshop-carts
```

## Related repositories

- [EcommerceShop-Frontend-K8S](https://github.com/tamim-hmizi/EcommerceShop-Frontend-K8S) - frontend for the microservice deployment
- [EcommerceShop-Frontend](https://github.com/tamim-hmizi/EcommerceShop-Frontend) - frontend for the monolithic backend
- [EcommerceShop-monolithic-backend](https://github.com/tamim-hmizi/EcommerceShop-monolithic-backend) - monolithic version of the backend
- [QuickOps-Frontend](https://github.com/tamim-hmizi/QuickOps-Frontend) - QuickOps platform used to deploy this application on AKS
- Other microservices: [auth](https://github.com/tamim-hmizi/EcommerceShop-microservice-auth), [users](https://github.com/tamim-hmizi/EcommerceShop-microservice-users), [products](https://github.com/tamim-hmizi/EcommerceShop-microservice-products), [categories](https://github.com/tamim-hmizi/EcommerceShop-microservice-categories), [orders](https://github.com/tamim-hmizi/EcommerceShop-microservice-orders), [favorites](https://github.com/tamim-hmizi/EcommerceShop-microservice-favorites)

## License

See [LICENSE](LICENSE).

---

Part of the MERN e-commerce use case for QuickOps, 2025, by Tamim Hmizi: https://tamim-hmizi.github.io/Portfolio/
