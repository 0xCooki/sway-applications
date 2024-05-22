use crate::utils::{
    setup::{setup},
    interface::core::create_vault,
};

mod success {
    use super::*;

    #[tokio::test]
    async fn create_vault_test() {
        let (vault, assets, wallets, provider) = setup().await;

        let block_height = provider.latest_block_height().await.unwrap();
        let expire = block_height + 1;

        let expire_time: u64 = 0;
        // Testing the blockheight is broken somewhere here
        create_vault(vault, assets[0].id, expire_time);


    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "InvalidUnlockTime")]
    async fn invalid_unlock_time_test() {
        let (vault, assets, _wallets, provider) = setup().await;

        let expire_time: u64 = 0;

        create_vault(vault, assets[0].id, expire_time).await;
    }
}