// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

import "./NTCert.sol";

contract Diplomas is NTCert {
    
     mapping(address => mapping(string => certificate)) private diplomas;
     
     modifier onlyOwner {
         require(owner == msg.sender, "You're not my dad!");
         _;
     }
     
     address private owner;
     
     constructor(){
         owner = msg.sender;
     }
    
    
    function voidCert(string memory _certId) override public{
        require(diplomas[msg.sender][_certId].status == certStatus.ACTIVE);
        diplomas[msg.sender][_certId].status = certStatus.VOID;
        emit certVoided(_certId, msg.sender);
        
    }
    function createCert(
        string calldata _certId, 
        uint32 _expiresOn,
        string calldata _title,
        string calldata _institution,
        string calldata _beneficiary,     
        string calldata _details,     
        string calldata _pofHash
    ) override public{
    
        require(diplomas[msg.sender][_certId].status == certStatus.NONE, "Diploma Id in use");
        
        diplomas[msg.sender][_certId] = certificate(
                certStatus.ACTIVE, 
                block.timestamp, 
                0, 
                (_expiresOn > 0 ? block.timestamp + _expiresOn : 0),
                _title, 
                _institution,
                _beneficiary, 
                _details,
                _pofHash
            );
        emit certVoided(_certId, msg.sender);
    }
    
    function getCert(string calldata _certId, address _certAuth) public override view returns (
        uint createdOn, 
        uint voidedOn, 
        uint expiresOn, 
        string memory title, 
        string memory institution, 
        string memory beneficiary, 
        string memory details, 
        string memory PoEhash){
            
        require(diplomas[_certAuth][_certId].status != certStatus.NONE, "Diploma does not exists");
        
        // Determine if diploma has a set expiration, if so, verifies if the diploma is not expired
        if (diplomas[_certAuth][_certId].expiresOn > 0)
        {
            require(diplomas[_certAuth][_certId].expiresOn > block.timestamp, "Diploma has expired");
        }
        
        certificate memory currentDiploma = diplomas[_certAuth][_certId];
        
        
        return (
            currentDiploma.createdOn, 
            currentDiploma.voidedOn, 
            currentDiploma.expiresOn, 
            currentDiploma.title, 
            currentDiploma.institution, 
            currentDiploma.beneficiary, 
            currentDiploma.details, 
            currentDiploma.PoEhash
        );
        
    }
    
    
    function certValid(string memory _certId, address _certAuth) view override public returns(bool isValid){
        certificate memory cert = diplomas[_certAuth][_certId];
       if (cert.status != certStatus.ACTIVE) return false;
       if (cert.expiresOn != 0 && cert.expiresOn < block.timestamp) return false;
       return true;
    }

 
    function proofOfExistence(string calldata _certId, address _certAuth, string calldata _pofHash) view public returns(bool isValid){
         require(diplomas[_certAuth][_certId].status == certStatus.ACTIVE);
         require(bytes(diplomas[_certAuth][_certId].PoEhash).length > 0);
         return keccak256(abi.encodePacked(diplomas[_certAuth][_certId].PoEhash)) == keccak256(abi.encodePacked(_pofHash));
        
    }
    
    function destroyContract() public onlyOwner{
        selfdestruct(msg.sender);
    }
 }
 
 