//login n register
Login: POST http://localhost:3000/api/login
Register: POST http://localhost:3000/api/register

user
    {
        "username": "user",
        "password": "user"
    }

admin
{
    "username": "admin",
    "password": "admin",
    "level": "admin"
}

//kategori
GET http://localhost:3000/api/categories
POST http://localhost:3000/api/categories
PUT http://localhost:3000/api/categories/:id
DELETE http://localhost:3000/api/categories/:id

{
    "name": "Electronics"
}

//produk
GET http://localhost:3000/api/products
POST http://localhost:3000/api/products
PUT http://localhost:3000/api/products/:id
DELETE http://localhost:3000/api/products/:id
{
    "category_id": 1,
    "name": "Product Name",
    "image": "product-image-url.jpg",
    "description": "Product description here",
    "price": 100000,
    "stock": 50
}

//rental
GET http://localhost:3000/api/rentals
POST http://localhost:3000/api/rentals
PUT http://localhost:3000/api/rentals/:id
DELETE http://localhost:3000/api/rentals/:id

{
    "product_id": 1,
    "customer_name": "John Doe",
    "rental_hours": 2
}

//pembayaran
GET http://localhost:3000/api/rentals/:id/payment
POST http://localhost:3000/api/rentals/:id/payment
PUT http://localhost:3000/api/rentals/:id/payment
DELETE http://localhost:3000/api/rentals/:id/payment
//simulasi
{
    "rental_id": 10,
    "payment_method": "simulation"
}
//midtrans
{
    "payment_method": "credit_card"
}