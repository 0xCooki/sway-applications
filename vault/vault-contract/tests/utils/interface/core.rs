use crate::utils::setup::{Vault};
use fuels::{
    prelude::*,
    programs::{call_response::FuelCallResponse},
};

pub(crate) async fn create_vault(contract: Vault<WalletUnlocked>, asset: AssetId, unlock_time: u64) -> FuelCallResponse<()> {
    contract
        .methods()
        .create_vault(
            asset,
            unlock_time
        )
        .call()
        .await
        .unwrap()
}