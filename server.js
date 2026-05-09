const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const QRCode = require("qrcode");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));





/* =========================
DATABASE
========================= */

const db = new sqlite3.Database("./noqtashipping.db", (err) => {

if(err){

console.log(err);

}else{

console.log("Database Connected ✅");

}

});





/* =========================
TABLES
========================= */

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





/* =========================
QR
========================= */

app.post("/generate-qr", async (req, res) => {

let shipmentNumber = req.body.shipment_number;

let trackingUrl =

`https://noqtashipping.onrender.com/tracking.html?shipment=${shipmentNumber}`;

try{

let qrImage = await QRCode.toDataURL(trackingUrl);

res.json({
success:true,
qr:qrImage
});

}catch{

res.json({
success:false
});

}

});





/* =========================
SHIPMENTS
========================= */

app.post("/add-shipment", (req, res) => {

const data = req.body;

db.run(

`INSERT INTO shipments (

shipment_number,

sender_name,
sender_phone,
sender_address,

receiver_name,
receiver_phone,
receiver_address,

weight,
pieces,

payment_method,

price,

status,

employee_number,

date,
time

)

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

[
data.shipment_number,

data.sender_name,
data.sender_phone,
data.sender_address,

data.receiver_name,
data.receiver_phone,
data.receiver_address,

data.weight,
data.pieces,

data.payment_method,

data.price,

data.status,

data.employee_number,

data.date,
data.time
],

function(err){

if(err){

console.log(err);

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





app.get("/shipments", (req, res) => {

db.all(

"SELECT * FROM shipments ORDER BY id DESC",

[],

(err, rows) => {

if(err){

res.json([]);

}else{

res.json(rows);

}

}

);

});





app.delete("/delete-shipment/:id", (req, res) => {

let id = req.params.id;

db.run(

"DELETE FROM shipments WHERE id = ?",

[id],

function(err){

if(err){

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





app.put("/update-status/:id", (req, res) => {

let id = req.params.id;

let status = req.body.status;

db.run(

"UPDATE shipments SET status = ? WHERE id = ?",

[status, id],

function(err){

if(err){

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





/* =========================
SERVICES
========================= */

app.post("/add-service", (req, res) => {

const data = req.body;

db.run(

`INSERT INTO services (

invoice_number,
service_type,
customer_name,
phone,
details,
price,
employee_number,
date,
time

)

VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,

[
data.invoice_number,
data.service_type,
data.customer_name,
data.phone,
data.details,
data.price,
data.employee_number,
data.date,
data.time
],

function(err){

if(err){

console.log(err);

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





app.get("/services", (req, res) => {

db.all(

"SELECT * FROM services ORDER BY id DESC",

[],

(err, rows) => {

if(err){

res.json([]);

}else{

res.json(rows);

}

}

);

});





/* =========================
EMPLOYEES
========================= */

app.post("/add-employee", (req, res) => {

const data = req.body;

db.run(

`INSERT INTO employees (

employee_number,
name,
phone,
email,
national_id,
password

)

VALUES (?, ?, ?, ?, ?, ?)`,

[
data.employee_number,
data.name,
data.phone,
data.email,
data.national_id,
data.password
],

function(err){

if(err){

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





app.get("/employees", (req, res) => {

db.all(

"SELECT * FROM employees ORDER BY id DESC",

[],

(err, rows) => {

if(err){

res.json([]);

}else{

res.json(rows);

}

}

);

});





/* =========================
CUSTOMERS
========================= */

app.post("/add-customer", (req, res) => {

const data = req.body;

db.run(

`INSERT INTO customers (

customer_number,
name,
phone,
phone2,
email,
store_name,
products

)

VALUES (?, ?, ?, ?, ?, ?, ?)`,

[
data.customer_number,
data.name,
data.phone,
data.phone2,
data.email,
data.store_name,
data.products
],

function(err){

if(err){

res.json({
success:false
});

}else{

res.json({
success:true
});

}

}

);

});





app.get("/customers", (req, res) => {

db.all(

"SELECT * FROM customers ORDER BY id DESC",

[],

(err, rows) => {

if(err){

res.json([]);

}else{

res.json(rows);

}

}

);

});





/* =========================
STATS
========================= */

app.get("/stats", (req, res) => {

db.all("SELECT * FROM shipments", [], (err, shipments) => {

db.all("SELECT * FROM services", [], (err2, services) => {

if(err || err2){

res.json({});

}else{

let totalShipments = shipments.length;

let shipmentProfit = 0;

let delivered = 0;

shipments.forEach(shipment => {

shipmentProfit += shipment.price;

if(shipment.status === "تم التسليم"){

delivered++;

}

});

let packagingProfit = 0;

let deliveryProfit = 0;

let storageProfit = 0;

services.forEach(service => {

if(service.service_type === "تغليف"){

packagingProfit += service.price;

}

if(

service.service_type === "جلب + توصيل"

||

service.service_type === "توصيل فقط"

){

deliveryProfit += service.price;

}

if(service.service_type === "احتفاظ بالشحنة"){

storageProfit += service.price;

}

});

let totalProfit =

shipmentProfit
+
packagingProfit
+
deliveryProfit
+
storageProfit;

res.json({

totalShipments,

shipmentProfit,

packagingProfit,

deliveryProfit,

storageProfit,

totalProfit,

delivered

});

}

});

});

});





/* =========================
ROOT
========================= */

app.get("/", (req, res) => {

res.sendFile(path.join(__dirname, "public", "index.html"));

});





/* =========================
SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("Noqta Shipping Running 🚚");

});