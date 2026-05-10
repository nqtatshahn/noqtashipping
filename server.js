const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));



/* =========================
   ملف البيانات
========================= */

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

if (!fs.existsSync("./data/shipments.json")) {
  fs.writeFileSync("./data/shipments.json", "[]");
}



/* =========================
   قراءة البيانات
========================= */

function getShipments() {

  return JSON.parse(
    fs.readFileSync("./data/shipments.json")
  );

}



/* =========================
   حفظ البيانات
========================= */

function saveShipments(data) {

  fs.writeFileSync(
    "./data/shipments.json",
    JSON.stringify(data, null, 2)
  );

}



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

    const shipments = getShipments();

    const shipmentNumber =
      "HB-2026-" +
      Math.floor(1000 + Math.random() * 9000);

    const newShipment = {

      shipmentNumber:

      shipmentNumber,



      senderName:

      req.body.senderName,



      senderPhone:

      req.body.senderPhone,



      senderCity:

      req.body.senderCity,



      receiverName:

      req.body.receiverName,



      receiverPhone:

      req.body.receiverPhone,



      receiverCity:

      req.body.receiverCity,



      pieces:

      req.body.pieces,



      weight:

      req.body.weight,



      price:

      req.body.price,



      packaging:

      req.body.packaging,



      deliveryType:

      req.body.deliveryType,



      status:

      "جديدة",



      date:

      new Date().toLocaleDateString("ar-SA"),



      time:

      new Date().toLocaleTimeString("ar-SA")

    };



    shipments.push(newShipment);

    saveShipments(shipments);

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

  res.json(getShipments());

});



/* =========================
   تحديث الحالة
========================= */

app.post("/update-status", (req, res) => {

  const shipments = getShipments();

  const updated = shipments.map(shipment => {

    if (
      shipment.shipmentNumber ===
      req.body.shipmentNumber
    ) {

      shipment.status = req.body.status;

    }

    return shipment;

  });

  saveShipments(updated);

  res.json({
    success: true
  });

});



/* =========================
   حذف شحنة
========================= */

app.post("/delete-shipment", (req, res) => {

  const shipments = getShipments();

  const filtered = shipments.filter(

    shipment =>

    shipment.shipmentNumber !==
    req.body.shipmentNumber

  );

  saveShipments(filtered);

  res.json({
    success: true
  });

});



/* =========================
   تشغيل السيرفر
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server running on port " + PORT
  );

});