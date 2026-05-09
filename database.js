const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./noqtashipping.db", (err) => {

if(err){

console.log("Database Error");

}else{

console.log("Database Connected ✅");

}

});

db.serialize(() => {

db.run(`

CREATE TABLE IF NOT EXISTS shipments (

id INTEGER PRIMARY KEY AUTOINCREMENT,

shipment_number TEXT,

sender_name TEXT,

sender_phone TEXT,

sender_address TEXT,

receiver_name TEXT,

receiver_phone TEXT,

receiver_address TEXT,

weight INTEGER,

pieces INTEGER,

payment_method TEXT,

price INTEGER,

status TEXT,

employee_number TEXT,

date TEXT,

time TEXT

)

`);

db.run(`

CREATE TABLE IF NOT EXISTS employees (

id INTEGER PRIMARY KEY AUTOINCREMENT,

employee_number TEXT,

name TEXT,

phone TEXT,

email TEXT,

national_id TEXT,

password TEXT

)

`);

db.run(`

CREATE TABLE IF NOT EXISTS customers (

id INTEGER PRIMARY KEY AUTOINCREMENT,

customer_number TEXT,

name TEXT,

phone TEXT,

phone2 TEXT,

email TEXT,

store_name TEXT,

products TEXT

)

`);

db.run(`

CREATE TABLE IF NOT EXISTS services (

id INTEGER PRIMARY KEY AUTOINCREMENT,

invoice_number TEXT,

service_type TEXT,

customer_name TEXT,

phone TEXT,

details TEXT,

price INTEGER,

employee_number TEXT,

date TEXT,
time TEXT

)

`);

});

module.exports = db;