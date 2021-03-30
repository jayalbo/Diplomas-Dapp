// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

import "./NTCert.sol";

contract Diplomas is NTCert {
    
     mapping(address => mapping(string => certificate)) public diplomas;
     
     event certVoided(string  _certId, address _certAuth);
     address owner;
     
     constructor(){
         owner = msg.sender;
     }
    
    function voidCert(string memory _certId, string memory _reason) override public{
        require(diplomas[msg.sender][_certId].status == certStatus.ACTIVE);
        certificate storage cert = diplomas[msg.sender][_certId];
        cert.status = certStatus.VOID;
        cert.voidMemo = _reason;
        emit certVoided(_certId, msg.sender);
        
    }
    function createCert(string memory _certId, uint32 _expiresOn) override public{
        require(diplomas[msg.sender][_certId].status == certStatus.NONE);
        
        diplomas[msg.sender][_certId] = certificate(
                certStatus.ACTIVE, 
                block.timestamp, 
                0, 
               (_expiresOn > 0 ? block.timestamp + _expiresOn : 0),
                '', 
                "Test",
                "Jay Albo", 
                "Professor X", 
                ''
            );
    }
    
    function getCert(string memory _certId, address _certAuth) public view returns (certStatus){
        require(diplomas[_certAuth][_certId].status != certStatus.NONE, "Diploma does not exists");
        return diplomas[_certAuth][_certId].status;
        
    }
    
    
    function certValid(string memory _certId, address _certAuth) view override public returns(bool isValid){
        certificate memory cert = diplomas[_certAuth][_certId];
       if (cert.status != certStatus.ACTIVE) return false;
       if (cert.expiresOn != 0 && cert.expiresOn < block.timestamp) return false;
       return true;
    }
 }

/*
        certStatus status;
        uint256 createdOn;
        uint256 voidedOn;
        uint expiresOn;
        string voidMemo;
        string institution;
        string beneficiary;
        string signer;
        string PoEhash;
    }
*/ 
