// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

abstract contract NTCert{
    
    enum certStatus { NONE, ACTIVE, VOID }
    
    struct certificate {
        certStatus status;
        uint256 createdOn;
        uint256 voidedOn;
        uint expiresOn;
        string title;
        string institution;
        string beneficiary;
        string details;
        string PoEhash;
    }
    
    //Events
     
     event certCreated(string  _certId, address _certAuth);
     event certVoided(string  _certId, address _certAuth);
    
    
    /// @notice Void an existing token 
    /// @dev Throws if `msg.sender` is the not current owner
    /// @param _certId id of the certificate
    function voidCert(string memory _certId) virtual public;
    
    /// @notice Creates a new certificate (token)
    /// @dev Throws if certId of `msg.sender` already exists
    /// @param _certId id of the certificate string
    /// @param _expiresOn lenght of certificate (in seconds) uint
    /// @param _institution string
    /// @param _beneficiary string
    /// @param _pofHash string
    
    function createCert(
        string calldata _certId,
        uint32 _expiresOn,
        string calldata _title,
        string calldata _institution,
        string calldata _beneficiary,   
        string calldata _details,   
        string calldata _pofHash
    ) virtual public;
    
    
    /// @notice Validates a certificate
    /// @dev Verifies if certificate is not voided, in case if being 
    /// active, it verifies if an expiration date was set, if so, 
    /// it verifies that the expiration date < current date
    /// @param _certId id of the certificate
    /// @param _certAuth address if cert authority
    /// @return isValid bool 
    function certValid(string memory _certId, address _certAuth) virtual public returns(bool isValid);
    
    /// @notice Returns a certificate
    /// @dev Verifies that the certificate status != NONE, also
    /// verifies if the same has an expiration date, in that case
    /// it verifies that the expiration date < current date
    /// @param _certId id of the certificate
    /// @param _certAuth address if cert authority
    /// @return createdOn uint
    /// @return voidedOn uint
    /// @return expiresOn uint
    /// @return title uint
    /// @return institution string
    /// @return beneficiary string
    /// @return details string
    /// @return PoEhash string
    function getCert(string calldata _certId, address _certAuth) virtual public view returns (
        uint createdOn, 
        uint voidedOn, 
        uint expiresOn, 
        string memory title, 
        string memory institution, 
        string memory beneficiary, 
        string memory details,   
        string memory PoEhash
    );
            

}