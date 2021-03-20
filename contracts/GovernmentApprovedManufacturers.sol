pragma solidity ^0.5.0;

contract GovernmentApprovedManufacturers {

    struct ApprovedManufacturer {
        string manufacturer_pvt_id;
    }

    // Index of a medicine is its medcine_id.
    ApprovedManufacturer[] approved_manufacturers;


    // Add a dummy manufacturer
    constructor() public {
        ApprovedManufacturer memory approved_manufacturer = ApprovedManufacturer('nhtAqdsPyasdBBgsdj713ngsdJKSAD');
        if (approved_manufacturers.length < 1){
            approved_manufacturers.push(approved_manufacturer);
            
        }
    }

    // Register a Manufacturer
    function register_manufacturer(string memory manufacturer_pvt_id) public returns (bool) {

        ApprovedManufacturer memory approved_manufacturer = ApprovedManufacturer(manufacturer_pvt_id);
        approved_manufacturers.push(approved_manufacturer);

        return true;
    }

    // Register a Manufacturer
    function is_registered_manufacturer(string memory manufacturer_pvt_id) public view returns (bool) {

        for (uint i=0; i<approved_manufacturers.length; i++) {
            if (keccak256(abi.encodePacked(approved_manufacturers[i].manufacturer_pvt_id)) == keccak256(abi.encodePacked(manufacturer_pvt_id))) {
                return true;
            }     
        }

        return false;
    }
}