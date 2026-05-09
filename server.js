const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));





/* =========================
   DATABASE
========================= */

const db = new sqlite3.Database("./noqtashipping.db", (err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("Database Connected ✅");

    }

});





/* =========================
   CREATE TABLES
========================= */

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS shipments (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            shipment_number TEXT,

            sender_name TEXT,
            sender_phone TEXT,

            receiver_name TEXT,
            receiver_phone TEXT,

            from_city TEXT,
            to_city TEXT,

            pieces INTEGER,
            price REAL,

            status TEXT,

            created_at TEXT

        )
    `);




    db.run(`
        CREATE TABLE IF NOT EXISTS employees (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            employee_number TEXT,
            name TEXT,
            username TEXT,
            password TEXT

        )
    `);




    db.run(`
        CREATE TABLE IF NOT EXISTS customers (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT,
            phone TEXT,
            city TEXT

        )
    `);




    db.run(`
        CREATE TABLE IF NOT EXISTS packaging (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            invoice_number TEXT,

            customer_name TEXT,
            customer_phone TEXT,

            package_type TEXT,

            pieces INTEGER,

            price REAL,

            created_at TEXT

        )
    `);




    db.run(`
        CREATE TABLE IF NOT EXISTS delivery (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            invoice_number TEXT,

            customer_name TEXT,
            customer_phone TEXT,

            service_type TEXT,

            price REAL,

            created_at TEXT

        )
    `);

});





/* =========================
   SHIPMENTS
========================= */

app.post("/add-shipment", (req, res) => {

    let data = req.body;

    let shipmentNumber =
        "NQ" + Math.floor(Math.random() * 999999);

    let date =
        new Date().toLocaleString();

    db.run(

        `
        INSERT INTO shipments (

            shipment_number,

            sender_name,
            sender_phone,

            receiver_name,
            receiver_phone,

            from_city,
            to_city,

            pieces,
            price,

            status,

            created_at

        )

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,

        [

            shipmentNumber,

            data.sender_name,
            data.sender_phone,

            data.receiver_name,
            data.receiver_phone,

            data.from_city,
            data.to_city,

            data.pieces,
            data.price,

            "تم الاستلام",

            date

        ],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true,
                    shipment_number: shipmentNumber
                });

            }

        }

    );

});





app.get("/shipments", (req, res) => {

    db.all(

        `
        SELECT * FROM shipments
        ORDER BY id DESC
        `,

        [],

        (err, rows) => {

            res.json(rows);

        }

    );

});





app.post("/update-status", (req, res) => {

    let shipment_number =
        req.body.shipment_number;

    let status =
        req.body.status;

    db.run(

        `
        UPDATE shipments
        SET status = ?
        WHERE shipment_number = ?
        `,

        [status, shipment_number],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});





app.get("/track/:number", (req, res) => {

    let number = req.params.number;

    db.get(

        `
        SELECT * FROM shipments
        WHERE shipment_number = ?
        `,

        [number],

        (err, row) => {

            if (row) {

                res.json(row);

            } else {

                res.json({
                    success: false
                });

            }

        }

    );

});





/* =========================
   EMPLOYEES
========================= */

app.post("/add-employee", (req, res) => {

    let data = req.body;

    db.run(

        `
        INSERT INTO employees (

            employee_number,
            name,
            username,
            password

        )

        VALUES (?, ?, ?, ?)
        `,

        [

            data.employee_number,
            data.name,
            data.username,
            data.password

        ],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});





app.get("/employees", (req, res) => {

    db.all(

        `
        SELECT * FROM employees
        ORDER BY id DESC
        `,

        [],

        (err, rows) => {

            res.json(rows);

        }

    );

});





/* =========================
   CUSTOMERS
========================= */

app.post("/add-customer", (req, res) => {

    let data = req.body;

    db.run(

        `
        INSERT INTO customers (

            name,
            phone,
            city

        )

        VALUES (?, ?, ?)
        `,

        [

            data.name,
            data.phone,
            data.city

        ],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true
                });

            }

        }

    );

});





app.get("/customers", (req, res) => {

    db.all(

        `
        SELECT * FROM customers
        ORDER BY id DESC
        `,

        [],

        (err, rows) => {

            res.json(rows);

        }

    );

});





/* =========================
   PACKAGING
========================= */

app.post("/add-packaging", (req, res) => {

    let data = req.body;

    let invoiceNumber =
        "PKG" + Math.floor(Math.random() * 999999);

    let date =
        new Date().toLocaleString();

    db.run(

        `
        INSERT INTO packaging (

            invoice_number,

            customer_name,
            customer_phone,

            package_type,

            pieces,

            price,

            created_at

        )

        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,

        [

            invoiceNumber,

            data.customer_name,
            data.customer_phone,

            data.package_type,

            data.pieces,

            data.price,

            date

        ],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true,
                    invoice_number: invoiceNumber
                });

            }

        }

    );

});





app.get("/packaging", (req, res) => {

    db.all(

        `
        SELECT * FROM packaging
        ORDER BY id DESC
        `,

        [],

        (err, rows) => {

            res.json(rows);

        }

    );

});





/* =========================
   DELIVERY
========================= */

app.post("/add-delivery", (req, res) => {

    let data = req.body;

    let invoiceNumber =
        "DLV" + Math.floor(Math.random() * 999999);

    let date =
        new Date().toLocaleString();

    db.run(

        `
        INSERT INTO delivery (

            invoice_number,

            customer_name,
            customer_phone,

            service_type,

            price,

            created_at

        )

        VALUES (?, ?, ?, ?, ?, ?)
        `,

        [

            invoiceNumber,

            data.customer_name,
            data.customer_phone,

            data.service_type,

            data.price,

            date

        ],

        function (err) {

            if (err) {

                res.json({
                    success: false
                });

            } else {

                res.json({
                    success: true,
                    invoice_number: invoiceNumber
                });

            }

        }

    );

});





app.get("/delivery", (req, res) => {

    db.all(

        `
        SELECT * FROM delivery
        ORDER BY id DESC
        `,

        [],

        (err, rows) => {

            res.json(rows);

        }

    );

});





/* =========================
   STATS
========================= */

app.get("/stats", (req, res) => {

    let stats = {

        totalShipments: 0,

        shipmentProfit: 0,
        packagingProfit: 0,
        deliveryProfit: 0,
        storageProfit: 0,

        totalProfit: 0,

        delivered: 0

    };




    db.get(

        `
        SELECT COUNT(*) as total
        FROM shipments
        `,

        [],

        (err, row) => {

            stats.totalShipments = row.total;




            db.get(

                `
                SELECT SUM(price) as total
                FROM shipments
                `,

                [],

                (err, row2) => {

                    stats.shipmentProfit =
                        row2.total || 0;




                    db.get(

                        `
                        SELECT SUM(price) as total
                        FROM packaging
                        `,

                        [],

                        (err, row3) => {

                            stats.packagingProfit =
                                row3.total || 0;




                            db.get(

                                `
                                SELECT SUM(price) as total
                                FROM delivery
                                `,

                                [],

                                (err, row4) => {

                                    stats.deliveryProfit =
                                        row4.total || 0;

                                    stats.totalProfit =

                                        stats.shipmentProfit +
                                        stats.packagingProfit +
                                        stats.deliveryProfit;




                                    db.get(

                                        `
                                        SELECT COUNT(*) as total
                                        FROM shipments
                                        WHERE status = 'تم التسليم'
                                        `,

                                        [],

                                        (err, row5) => {

                                            stats.delivered =
                                                row5.total;

                                            res.json(stats);

                                        }

                                    );

                                }

                            );

                        }

                    );

                }

            );

        }

    );

});





/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Noqta Shipping Running 🚚");

});