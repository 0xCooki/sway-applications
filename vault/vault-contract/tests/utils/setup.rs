use fuels::{
    prelude::*
};

abigen!(Contract(
    name = "Vault",
    abi = "./out/debug/vault-contract-abi.json"
),);


pub(crate) async fn setup() -> (Vault<WalletUnlocked>, Vec<AssetConfig>, Vec<WalletUnlocked>, Provider) {
    let number_of_coins = 1;
    let coin_amount = 1_000_000;
    let number_of_wallets = 3;

    // Assets
    let base_asset = AssetConfig {
        id: BASE_ASSET_ID,
        num_coins: number_of_coins,
        coin_amount,
    };
    let asset_id = AssetId::new([1; 32]);
    let asset = AssetConfig {
        id: asset_id,
        num_coins: number_of_coins,
        coin_amount,
    };
    let other_asset_id = AssetId::new([2; 32]);
    let other_asset = AssetConfig {
        id: other_asset_id,
        num_coins: number_of_coins,
        coin_amount,
    };
    let assets = vec![base_asset, asset, other_asset];

    // Wallets
    let wallet_config = WalletsConfig::new_multiple_assets(number_of_wallets, assets.clone());

    let mut wallets = launch_custom_provider_and_get_wallets(wallet_config, None, None)
        .await
        .unwrap();
    
    let wallet_a = wallets.pop().unwrap();
    let _wallet_b = wallets.pop().unwrap();
    let _wallet_c = wallets.pop().unwrap();

    //let provider = wallet_a.try_provider();

    let provider = wallet_a.try_provider().unwrap();

    //let height = provider.latest_block_height();

    //let provider = wallet_a.provider().latest_block_height();
 
    //assert_eq!(provider.latest_block_height().await, 0u32);

    let wallets_list = vec![wallet_a.clone(), _wallet_b.clone(), _wallet_c.clone()];

    // Vault
    let id = Contract::load_from(
        "./out/debug/vault-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&wallet_a, TxPolicies::default())
    .await
    .unwrap();

    let instance = Vault::new(id.clone(), wallet_a.clone());

    (instance, assets, wallets_list, provider.clone())
}