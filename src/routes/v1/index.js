const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/flight-controller')

const FlightController = new flightController();

router.get('/info', (req, res) => {
    res.status(200).json({
        message: 'inside booking service'
    });
})
router.post('/booking', FlightController.create);
// router.post('/publish', FlightController.sendMessageToQueue);

module.exports = router;