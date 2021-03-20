var MedicineTransactionsContract = artifacts.require("MedicineTransactions");
var GovernmentApprovedManufacturers = artifacts.require("GovernmentApprovedManufacturers");
module.exports = function(deployer) {
  deployer.deploy(MedicineTransactionsContract);
  deployer.deploy(GovernmentApprovedManufacturers);
  };