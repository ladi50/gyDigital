const router = require("express").Router();
const domainController = require("../controllers/domain");

router.post("/", domainController.saveFakeDomains);

router.delete("/domains/:domain", domainController.deleteDomain);

router.delete("/domains", domainController.deleteDomains);

module.exports = router;