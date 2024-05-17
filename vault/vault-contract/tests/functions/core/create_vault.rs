use crate::utils::{
    setup::{setup},
    interface::core::create_vault,
};

mod success {
    use super::*;

    #[tokio::test]
    async fn create_vault() {
        let (_vault, _assets, _wallets) = setup().await;


    }
}

mod revert {
    use super::*;

    #[tokio::test]
    #[should_panic(expected = "InvalidUnlockTime")]
    async fn invalid_unlock_time() {
        let (vault, assets, _wallets) = setup().await;

        create_vault(vault, assets[0].id, 0).await;
    }
}