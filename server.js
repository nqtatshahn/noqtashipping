const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const dataPath = "./data/shipments.json";

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]");
}

let shipments = JSON.parse(fs.readFileSync(dataPath));



/* =========================
   تسجيل الدخول
========================= */

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    return res.json({
      success: true,
      role: "admin"
    });
  }

  if (username === "employee" && password === "1234") {
    return res.json({
      success: true,
      role: "employee"
    });
  }

  res.json({
    success: false
  });

});



/* =========================
   إضافة شحنة
========================= */

app.post("/add-shipment", (req, res) => {

  try {

    const {

      senderName,
      senderPhone,
      senderCity,

      receiverName,
      receiverPhone,
      receiverCity,

      pieces,
      weight,
      price

    } = req.body;

    const shipmentNumber =
      "HB-2026-" +
      Math.floor(1000 + Math.random() * 9000);

    const newShipment = {

      shipmentNumber,

      senderName,
      senderPhone,
      senderCity,

      receiverName,
      receiverPhone,
      receiverCity,

      pieces,
      weight,
      price,

      status: "جديدة",

      date: new Date().toLocaleDateString("ar-SA"),
      time: new Date().toLocaleTimeString("ar-SA")

    };

    shipments.push(newShipment);

    fs.writeFileSync(
      dataPath,
      JSON.stringify(shipments, null, 2)
    );

    res.json({
      success: true,
      shipmentNumber
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false
    });

  }

});



/* =========================
   جلب الشحنات
========================= */

app.get("/shipments", (req, res) => {

  shipments = JSON.parse(fs.readFileSync(dataPath));

  res.json(shipments);

});



/* =========================
   تحديث الحالة
========================= */

app.post("/update-status", (req, res) => {

  const { shipmentNumber, status } = req.body;

  shipments = shipments.map(shipment => {

    if (shipment.shipmentNumber === shipmentNumber) {
      shipment.status = status;
    }

    return shipment;

  });

  fs.writeFileSync(
    dataPath,
    JSON.stringify(shipments, null, 2)
  );

  res.json({
    success: true
  });

});



/* =========================
   حذف شحنة
========================= */

app.post("/delete-shipment", (req, res) => {

  const { shipmentNumber } = req.body;

  shipments = shipments.filter(
    shipment => shipment.shipmentNumber !== shipmentNumber
  );

  fs.writeFileSync(
    dataPath,
    JSON.stringify(shipments, null, 2)
  );

  res.json({
    success: true
  });

});



/* =========================
   تشغيل السيرفر
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});