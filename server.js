const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

let shipments = [];





app.post("/add-shipment", (req, res) => {

const data = req.body;

let shipment = {

id: shipments.length + 1,

sender_name:
data.sender_name,

sender_phone:
data.sender_phone,

receiver_name:
data.receiver_name,

receiver_phone:
data.receiver_phone,

from_city:
data.from_city,

to_city:
data.to_city,

weight:
data.weight,

pieces:
data.pieces,

price:
data.price,

payment_method:
data.payment_method,

employee_number:
data.employee_number,

status:"تم الاستلام"

};

shipments.push(shipment);

res.json({
success:true
});

});





app.get("/shipments", (req, res) => {

res.json(shipments);

});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log("Server Running 🚚");

});