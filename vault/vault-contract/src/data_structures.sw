library;

/// Vault Information
pub struct VaultInfo {
    /// Address identifying the depositer
    address: Identity,
    /// The asset deposited in the contract
    asset: AssetId,
    /// The amount deposited
    amount: u64,
    /// The block height after which the asset is able to be withdrawn
    unlock_time: u64,
    /// Boolean for whether the vault is active (i.e. holding assets)
    is_active: bool,
}

impl VaultInfo {
    /// Creates a new VaultInfo struct
    /// todo - fill in input vars and return later
    /// Always begins with nothing deposited and active
    pub fn new(
        address: Identity,
        asset: AssetId,
        unlock_time: u64,
    ) -> Self {
        Self {
            address: address,
            asset: asset,
            amount: 0,
            unlock_time: unlock_time,
            is_active: true,
        }
    }
}
