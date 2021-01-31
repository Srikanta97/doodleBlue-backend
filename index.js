const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
require("dotenv").config();
const Slot = require('./models/slots');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.REACT_APP_MONGODB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
        if (err) throw err;
        console.log('MONGODB connection established');
    }
);

app.post("/", async (req, res) => {
    try {
        const { specificDate, specificSlot } = req.body;

        if (!specificDate) {
            return res.status(400).json({
                msg: "Date not selected"
            });
        }
        if (!specificSlot) {
            return res.status(400).json({
                msg: "Select a time slot"
            });
        }
        const newSlot = new Slot({
           specificDate,
           specificSlot
        });
        const saveSlot = await newSlot.save();
        res.json({
            specificDate: saveSlot.specificDate,
            specificSlot: saveSlot.specificSlot,
        });
    }
    catch(err) {
        res.status(500).json({error: err.message});
    }
});

app.get("/", async (req, res) => {
    const slots = await Slot.find({});
    let sendBack = [];
    slots.forEach(slot => {
        sendBack.push({
            specificDate: slot.specificDate,
            specificSlot: slot.specificSlot
        });
    });
    res.json(sendBack);
});

app.put("/", async (req, res) => {
    const { specificDate, specificSlot } = req.body;
    const slot = Slot.find({ specificDate: specificDate, specificSlot: specificSlot });
    if (slot) {
        const returnSlot = await Slot.updateOne({
            specificDate, specificSlot, booked: true
        });
        res.json(returnSlot);
    }
    else {
        return res.status(400).json({
            error: "No such slot exists!"
        });
    }
});