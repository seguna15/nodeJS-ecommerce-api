# E-commerce REST API written in Node JS

## Clone Project and run the command below

``` bash
npm install
```

## Create .env file

```.env
PORT=7000
MONGO_URI=mongo db url from local mongoDB or Atlas
JWT_ACCESS_KEY= random string
JWT_REFRESH_KEY= random string
```

## Functionality

1. Authentication (registration, login, refresh access token)
2. User management
3. Product management
4. Order management
5. Payment

## Order

Product -> Cart -> Payment (Stripe || Paypal) -> Webhook to notify server of transaction status. -> Update Order
