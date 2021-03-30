// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

abstract contract NTCert{
    
    enum certStatus { NONE, ACTIVE, VOID }
    
    struct certificate {
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
    
    
    
    /// @notice Void an existing token 
    /// @dev Throws if `msg.sender` is the not current owner
    /// @param _certId id of the certificate
    /// @param _reason - Optional string reason for voiding the cert
    function voidCert(string memory _certId, string memory _reason) virtual public;
    
    /// @notice Creates a new certificate (token)
    /// @dev Throws if certId of `msg.sender` already exists
    /// @param _certId id of the certificate
    function createCert(string memory _certId, uint32 _expiresOn) virtual public;
    
    function certValid(string memory _certId, address _authId) virtual public returns(bool isValid);
    

}

