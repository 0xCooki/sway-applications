library;

//use ::data_structures::{VaultInfo};

/// todo - extensive documentation
abi Vault {
    #[storage(read, write)]
    fn create_vault(
        asset: AssetId,
        unlock_time: u64,
    ) -> u64;

    #[payable]
    #[storage(read, write)]
    fn deposit(vault_id: u64);

    #[storage(read, write)]
    fn withdraw(vault_id: u64);
}