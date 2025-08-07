const { Router } = require("express");
const driverController = require("../controllers/driverController");

const router = Router();

router.get('/', driverController.getDrivers);
router.get('/featured', driverController.getFeaturedDriver);
router.get('/current', driverController.getCurrentDrivers);
router.get('/id/:id', driverController.getDriverById);

module.exports = router;