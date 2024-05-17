contract;

mod data_structures;
mod errors;
mod events;
mod interface;

use data_structures::{VaultInfo};
use errors::{CreateVaultErrors};
use events::{};
use interface::{Vault};
use std::{
    asset::transfer,
    auth::msg_sender,
    block::height,
    call_frames::msg_asset_id,
    context::msg_amount,
    hash::Hash,
};

storage {
    /// Mapping (ID => VaultInfo)
    vaults: StorageMap<u64, VaultInfo> = StorageMap {},
    /// Total number of created vaults
    /// Monotonically increasing nonce used to map vaults
    vault_count: u64 = 0,
}

impl Vault for Contract {
    #[payable]
    #[storage(read, write)]
    fn create_vault(
        asset: AssetId,
        unlock_time: u64,
    ) {
        // Checks - unlock time more than now
        require(
            unlock_time > height().as_u64(),
            CreateVaultErrors::InvalidUnlockTime,
        );
        require(
            msg_amount() > 0,
            CreateVaultErrors::InvalidAmount,
        );
        
        // Create new Vault Info struct

        // Update storage
    }

    #[storage(read, write)]
    fn withdraw(deposit_id: u64) {
        // Checks: 
        //    only depositer can withdraw
        //    time has elapsed
        //    is active

    }
}