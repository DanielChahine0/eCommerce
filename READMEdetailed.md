# E-Commerce Website - Detailed Documentation

## Stack Used
- Frontend: ReactJS
- Backend: Java Spring Boot
- Database: MySQL

## Docker Setup
To install the docker environment, run:
```bash
docker-compose up -d
```

then to get into the database container, run:
```
docker-compose exec -it postgresql-spring-boot bash

psql -U daniel
```

After that, I had to create a database using:
```sql
create database ecom
```


## SQL Schema
```sql
// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table users {
  id integer [primary key]
  username varchar 
  role varchar
  address integer [not null, ref: > address.id]
  email varchar [unique]
}

Table address{ 
  id integer [primary key]
  zip varchar [not null]
  country varchar [not null]
  street varchar [not null]
  province varchar [not null]
}


Table Orders{
  id integer [primary key]
  user_id integer [not null, ref: > users.id]
  status order_status [not null, default: 'pending']
  address_id integer [not null, ref: > address.id] // one-to-one
  basket_id integer [not null, ref: > basket.id] //many-to-one
  total decimal (10, 2)
  time_created timestamp [not null, default: 'now()']
}

Enum order_status {
  pending
  paid
  shipped
  cancelled
}


Table products{
  name varchar
  quantity integer
  id integer [primary key]
  description varchar
  image varchar 
  brand_id integer [not null, ref: > brand.id]
  category integer [not null, ref: > category.id]
}

Table books {
  id    int     [pk, ref: > products.id] 
  genre varchar
}

Table clothes {
  id    int     [pk, ref: > products.id]  
  size  varchar
  color varchar
}

Table jewelry {
  id int [pk, ref: > products.id]    
  color varchar     
}

Table sports {
  id int [pk, ref: > products.id]        
}

Table techo {
  id int [pk, ref: > products.id]        
}


Table category{
  id integer [primary key]
  name varchar
}

Table brand{
  id integer [primary key]
  name varchar
}


Table basket {
  id integer  [pk]
  product_id integer [ref: > products.id]

}
```