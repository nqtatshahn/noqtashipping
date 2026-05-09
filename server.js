const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const DB_FILE = './shipments.json';

let shipments = [];

if (fs.existsSync(DB_FILE)) {
    shipments = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveShipments() {
    fs.writeFileSync(DB_FILE, JSON.stringify(shipments, null, 2));
}

app.get('/api/shipments', (req, res) => {
    res.json(shipments);
});

app.get('/api/shipments/:id', (req, res) => {

    const shipment = shipments.find(
        s => s.shipmentNumber == req.params.id
    );

    if (!shipment) {
        return res.status(404).json({
            success: false,
            message: 'الشحنة غير موجودة'
        });
    }

    res.json(shipment);
});

app.post('/api/shipments', (req, res) => {

    try {

        const shipmentNumber =
            'HB-2026-' +
            String(shipments.length + 1).padStart(4, '0');

        const shipment = {

            id: Date.now(),

            shipmentNumber,

            senderName: req.body.senderName || '',
            senderPhone: req.body.senderPhone || '',
            senderCity: req.body.senderCity || '',

            receiverName: req.body.receiverName || '',
            receiverPhone: req.body.receiverPhone || '',
            receiverCity: req.body.receiverCity || '',

            pieces: req.body.pieces || 1,
            weight: req.body.weight || 1,
            price: req.body.price || 0,

            status: 'جديدة',

            createdAt: new Date().toLocaleString('ar-SA')
        };

        shipments.push(shipment);

        saveShipments();

        res.json({
            success: true,
            shipment
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: 'حدث خطأ'
        });
    }
});

app.put('/api/shipments/:id/status', (req, res) => {

    const shipment = shipments.find(
        s => s.shipmentNumber == req.params.id
    );

    if (!shipment) {
        return res.status(404).json({
            success: false
        });
    }

    shipment.status = req.body.status;

    saveShipments();

    res.json({
        success: true
    });
});

app.get('/shipment/:id', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'public', 'shipment.html')
    );
});

app.get('*', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});