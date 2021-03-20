App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('GovernmentApprovedManufacturers.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var GovernmentApprovedManufacturersArtifact = data;
      App.contracts.GovernmentApprovedManufacturers = TruffleContract(GovernmentApprovedManufacturersArtifact);
    
      // Set the provider for our contract
      App.contracts.GovernmentApprovedManufacturers.setProvider(App.web3Provider);
    });

    $.getJSON('MedicineTransactions.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var MedicineTransactionsArtifact = data;
      App.contracts.MedicineTransactions = TruffleContract(MedicineTransactionsArtifact);
    
      // Set the provider for our contract
      App.contracts.MedicineTransactions.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-register-manufacturer', App.handleRegisterManufacturer);
    $(document).on('click', '.btn-add-medicine-entry', App.handleMedicineEntry);
    $(document).on('click', '.btn-verify-medicine', App.handleverifyMedicine);
  },

  registered_alert: function() {
    alert("Successfully registered!");
  },

  added_medicine_alert: function() {
    alert("Successfully added medicine!");
  },

  unregistered_manufacturer: function() {
    alert("The manufacturer is invalid and not registered with the Government.");
  },

  medicine_is_valid: function() {
    alert("Medicine is valid");
  },

  medicine_is_not_valid: function() {
    alert("WARNING! MEDICINE IS NOT IN RECORDS");
  },

  handleRegisterManufacturer: function(event) {
    event.preventDefault();

    var manufacturer_pvt_id = document.forms["govt_registry_form"]["manufacturer_secret_key"].value;
    
    console.log(manufacturer_pvt_id)
    

    var gamInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GovernmentApprovedManufacturers.deployed().then(function(instance) {
        gamInstance = instance;

        // Execute adopt as a transaction by sending account
        return gamInstance.register_manufacturer(manufacturer_pvt_id, {from: account});
      }).then(function(result) {
        App.registered_alert();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleCheckManufacturer: function(event, manufacturer_pvt_id) {
    event.preventDefault();

    console.log(manufacturer_pvt_id);
    

    var gamInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GovernmentApprovedManufacturers.deployed().then(function(instance) {
        gamInstance = instance;

        // Execute adopt as a transaction by sending account
        return gamInstance.is_registered_manufacturer(manufacturer_pvt_id, {from: account});
      }).then(function(result) {
        console.log("got instance: ", result);
        if(result){
          console.log('medicine is valid');
        }
        
        return result;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleverifyMedicine: function(event) {
    event.preventDefault();

    var medicine_id = document.forms["customer_verification_form"]["medicine_id"].value;
    
 
    var mtInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.MedicineTransactions.deployed().then(function(instance) {
        mtInstance = instance;

        // Execute adopt as a transaction by sending account
        return mtInstance.check_valid_medicine(medicine_id, {from: account});
      }).then(function(result) {
        if(result){
          console.log('medicine is valid');
          App.medicine_is_valid();
        }
        else{
          console.log('medicine is not valid');
          App.medicine_is_not_valid();
        }
        
      }).catch(function(err) {
        console.log(err.message);
      });
    });

    
  },

  handleMedicineEntry: function(event) {
    event.preventDefault();

    var manufaturer_name = document.forms["manufacturer_entry_form"]["manufaturer_name"].value;
    var manufacturer_pvt_id = document.forms["manufacturer_entry_form"]["manufacturer_secret_key"].value;
    var medicine_id = document.forms["manufacturer_entry_form"]["medicine_id"].value;
    var mfg_dt = document.forms["manufacturer_entry_form"]["mfg_dt"].value;
    var expiry_dt = document.forms["manufacturer_entry_form"]["expiry_dt"].value;
    
    console.log(manufacturer_pvt_id);
    console.log(medicine_id);


    var gamInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.GovernmentApprovedManufacturers.deployed().then(function(instance) {
        gamInstance = instance;

        // Execute adopt as a transaction by sending account
        return gamInstance.is_registered_manufacturer(manufacturer_pvt_id, {from: account});
      }).then(function(result) {
        console.log(result);
        if(result){
          console.log('manufacturer is valid! Adding medicine.');

    var mtInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.MedicineTransactions.deployed().then(function(instance) {
        mtInstance = instance;

        // Execute adopt as a transaction by sending account
        return mtInstance.add_medicine(medicine_id, {from: account});
      }).then(function(result) {
        console.log('is valid');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
        }
        else{
          App.unregistered_manufacturer();
        }
        
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
