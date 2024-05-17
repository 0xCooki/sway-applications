library;

//use ::data_structures::{VaultInfo};

/// todo - extensive documentation
abi Vault {
    #[payable]
    #[storage(read, write)]
    fn create_vault(
        asset: AssetId,
        unlock_time: u64,
    );

    #[storage(read, write)]
    fn withdraw(deposit_id: u64);
}