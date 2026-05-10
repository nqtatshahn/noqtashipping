const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;



/* =========================
   الإعدادات
========================= */

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));



/* =========================
   إنشاء مجلد البيانات
========================= */

const dataFolder = path.join(__dirname, "data");

const shipmentsFile = path.join(
  dataFolder,
  "shipments.json"
);

if (!fs.existsSync(dataFolder)) {

  fs.mkdirSync(dataFolder);

}

if (!fs.existsSync(shipmentsFile)) {

  fs.writeFileSync(
    shipmentsFile,
    "[]"
  );

}



/* =========================
   قراءة البيانات
========================= */

function getShipments() {

  return JSON.parse(
    fs.readFileSync(shipmentsFile)
  );

}



/* =========================
   حفظ البيانات
========================= */

function saveShipments(data) {

  fs.writeFileSync(
    shipmentsFile,
    JSON.stringify(data, null, 2)
  );

}



/* =========================
   الصفحة الرئيسية
========================= */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname,
    "public",
    "index.html")
  );

});



/* =========================
   تسجيل الدخول
========================= */

app.post("/login", (req, res) => {

  const { username, password } = req.body;



  /* المدير */

  if (
    username === "admin" &&
    password === "1234"
  ) {

    return res.json({
      success: true,
      role: "admin"
    });

  }



  /* الموظف */

  if (
    username === "employee" &&
    password === "1234"
  ) {

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

      String(shipments.length + 1)
      .padStart(4, "0");



    const newShipment = {

      shipmentNumber:



      shipmentNumber,



      senderName:

      req.body.senderName || "",



      senderPhone:

      req.body.senderPhone || "",



      senderCity:

      req.body.senderCity || "",



      receiverName:

      req.body.receiverName || "",



      receiverPhone:

      req.body.receiverPhone || "",



      receiverCity:

      req.body.receiverCity || "",



      pieces:

      req.body.pieces || 0,



      weight:

      req.body.weight || 0,



      price:

      req.body.price || 0,



      packaging:

      req.body.packaging || "بدون",



      deliveryType:

      req.body.deliveryType || "توصيل",



      status:

      "جديدة",



      date:

      new Date()
      .toLocaleDateString("ar-SA"),



      time:

      new Date()
      .toLocaleTimeString("ar-SA")

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

  res.json(
    getShipments()
  );

});



/* =========================
   تحديث حالة الشحنة
========================= */

app.post("/update-status", (req, res) => {

  const shipments = getShipments();

  shipments.forEach(shipment => {

    if (

      shipment.shipmentNumber ===
      req.body.shipmentNumber

    ) {

      shipment.status =
      req.body.status;

    }

  });

  saveShipments(shipments);

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

app.listen(PORT, () => {

  console.log(
    "Server running on port " + PORT
  );

});