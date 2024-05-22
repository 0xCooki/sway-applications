contract;

mod data_structures;
mod errors;
mod events;
mod interface;

use data_structures::{VaultInfo};
use errors::{
    CreateVaultErrors,
    DepositErrors,
    WithdrawErrors
};
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
    #[storage(read, write)]
    fn create_vault(
        asset: AssetId,
        unlock_time: u64,
    ) -> u64 {
        // Checks - unlock time is in the future
        require(
            unlock_time > height().as_u64(),
            CreateVaultErrors::InvalidUnlockTime,
        );
        
        // Create new Vault Info struct
        let new_vault_info = VaultInfo::new(
            msg_sender().unwrap(),
            asset,
            unlock_time,
        );

        // Get the next index
        let new_vault_id = storage.vault_count.read() + 1;

        // Update storage
        storage.vaults.insert(new_vault_id, new_vault_info);

        return new_vault_id;
    }

    #[payable]
    #[storage(read, write)]
    fn deposit(vault_id: u64) {
        require(
            msg_amount() > 0,
            DepositErrors::InvalidAmount,
        );
    }

    #[storage(read, write)]
    fn withdraw(vault_id: u64) {
        // Checks: 
        //    only depositer can withdraw
        //    time has elapsed
        //    is active
    }
}