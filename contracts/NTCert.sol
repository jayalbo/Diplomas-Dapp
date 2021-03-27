// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.7.0;

abstract contract NTCert{
    
    enum certStatus { ACTIVE, VOID }
    
    struct cert {
        certStatus status;
        address certAuthority;
        uint256 createdOn;
        uint256 voidedOn;
        string voidMemo;
        string institution;
        string beneficiary;
        string signer;
        string PoEhash;
    }
    
    
    
}
