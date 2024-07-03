# E-commerce REST API written in Node JS

## Clone Project and run the command below

``` bash
npm install
```

## Create .env file

```.env
PORT=
MONGO_URI=
JWT_ACCESS_KEY=
JWT_REFRESH_KEY=
STRIPE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Functionality

1. Authentication (registration, login, refresh access token)
2. User management
3. Product management
4. Order management
5. Payment

## Order

Product -> Cart -> Payment (Stripe || Paypal) -> Webhook to notify server of transaction status. -> Update Order

Open new terminal

```bash
stripe listen --forward-to localhost:{PORT_NUMBER}/webhook
```
