pragma solidity ^0.5.0;

contract MedicineTransactions { 

    struct Medicine {
        string medcine_id;
    }

  // Index of a medicine is its medcine_id.
  Medicine[] medicines;

  
    // Add a dummy medicine
    constructor() public {
        Medicine memory medicine = Medicine('medPasdnhUUUn912ns');
        if (medicines.length < 1){
            medicines.push(medicine);
        }
    }

  function add_medicine(string memory medcine_id) public returns (bool){

        Medicine memory medicine = Medicine(medcine_id);
        medicines.push(medicine);

        return true;
  }

    // Register a Manufacturer
    function check_valid_medicine(string memory medcine_id) public view returns (bool) {

        for (uint i=0; i<medicines.length; i++) {
            if (keccak256(abi.encodePacked(medicines[i].medcine_id)) == keccak256(abi.encodePacked(medcine_id))) {
                return true;
            }     
        }

        return false;
    }
}