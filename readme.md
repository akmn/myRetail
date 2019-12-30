# myRetail RESTful service

This is a RESTful service that can retrieve product and price details by ID.

## Usage:

Get all products:

```
GET http://localhost:4000/api/products
```

Get single product:

```
GET localhost:4000/api/products/{productid}
```

Put single product:

```
PUT localhost:4000/api/products/{productid}
```

PUT request body sample:

```Javascript
{
    "current_price": {
        "value": 13.8,
        "currency_code": "USD"
    }
}
```

Note: only currency code USD is supported at this time.

Further examples and tests can be found by importing the Postman collection:

```
myRetail RESTful service.postman_collection.json
```

## Setup Instructions

### Prerequisites:

1. npm / node
2. mongo db installation

### Instructions:

1. Clone git repo
2. Run the following in a terminal window to start database:

```
mongod
```

3. Run the following in another terminal window (to seed local DB with records):

```
mongoimport --uri 'mongodb://localhost/myRetailProducts' --collection products /file:'products.json'
```

4. Run the following commands in order to start the service locally:

```
npm install
npm start
```
