const fs = require("fs");
const path = require("path");



/* =========================
   مجلد البيانات
========================= */

const dataFolder = path.join(
    __dirname,
    "data"
);



/* =========================
   ملف الشحنات
========================= */

const shipmentsFile = path.join(
    dataFolder,
    "shipments.json"
);



/* =========================
   إنشاء المجلد
========================= */

if(!fs.existsSync(dataFolder)){

    fs.mkdirSync(dataFolder);

}



/* =========================
   إنشاء ملف الشحنات
========================= */

if(!fs.existsSync(shipmentsFile)){

    fs.writeFileSync(
        shipmentsFile,
        "[]"
    );

}



/* =========================
   قراءة الشحنات
========================= */

function getShipments(){

    return JSON.parse(

        fs.readFileSync(
            shipmentsFile
        )

    );

}



/* =========================
   حفظ الشحنات
========================= */

function saveShipments(data){

    fs.writeFileSync(

        shipmentsFile,

        JSON.stringify(
            data,
            null,
            2
        )

    );

}



/* =========================
   إضافة شحنة
========================= */

function addShipment(shipment){

    const shipments =
    getShipments();

    shipments.push(shipment);

    saveShipments(shipments);

}



/* =========================
   حذف شحنة
========================= */

function deleteShipment(
shipmentNumber
){

    const shipments =
    getShipments();

    const filtered =
    shipments.filter(

        shipment =>

        shipment.shipmentNumber !==
        shipmentNumber

    );

    saveShipments(filtered);

}



/* =========================
   تحديث حالة شحنة
========================= */

function updateShipmentStatus(

    shipmentNumber,
    status

){

    const shipments =
    getShipments();

    shipments.forEach(shipment => {

        if(
        shipment.shipmentNumber ===
        shipmentNumber
        ){

            shipment.status =
            status;

        }

    });

    saveShipments(shipments);

}



/* =========================
   البحث عن شحنة
========================= */

function findShipment(
shipmentNumber
){

    const shipments =
    getShipments();

    return shipments.find(

        shipment =>

        shipment.shipmentNumber ===
        shipmentNumber

    );

}



/* =========================
   تصدير الدوال
========================= */

module.exports = {

    getShipments,

    saveShipments,

    addShipment,

    deleteShipment,

    updateShipmentStatus,

    findShipment

};