mod utils;

use fuels::prelude::*;
use utils::{
    balance_of, earned, exit, get_balance, get_reward, get_reward_for_duration, notify_reward_amount, owner,
    last_time_reward_applicable, period_finish, reward_duration, reward_per_token, reward_rate, last_update_time,
    setup, stake, stakingrewards_mod::Identity, total_supply, ONE, REWARDS_ASSET, STAKING_ASSET,
};

// Until timestamp supported in Sway, timestamps of each action must be specified. Contract is deployed at t=0
const INITIAL_STAKE: u64 = 10 * ONE;
const INITIAL_TIMESTAMP: u64 = 0;

const TIMESTAMP: u64 = 123;

#[tokio::test]
async fn constructed() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;
    let wallet_identity = Identity::Address(Address::from(wallet.address()));

    let owner_identity = staking_contract.owner().call().await.unwrap().value;
    assert_eq!(wallet_identity, owner_identity);
}

#[tokio::test]
async fn stake_tokens() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    // User balance has updated
    let wallet_identity = Identity::Address(Address::from(wallet.address()));
    let user_balance = balance_of(&staking_contract, &wallet_identity).await;
    assert_eq!(user_balance, INITIAL_STAKE);

    // Total_supply has updated
    let total_supply = total_supply(&staking_contract).await;
    assert_eq!(total_supply, INITIAL_STAKE);
}

#[tokio::test]
async fn can_get_balance_of() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    // User balance has updated
    let wallet_identity = Identity::Address(Address::from(wallet.address()));
    let user_balance = balance_of(&staking_contract, &wallet_identity).await;
    assert_eq!(user_balance, INITIAL_STAKE);

    // User balance updates again
    stake(&staking_contract, TIMESTAMP, 50000).await;
    let user_balance = balance_of(&staking_contract, &wallet_identity).await;
    assert_eq!(user_balance, INITIAL_STAKE + 50000);
}

#[tokio::test]
async fn calculate_earned_tokens() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    // Total accrued per token is time_elapsed * rate / total_supply
    let expected_reward_per_token: u64 =
        ((TIMESTAMP - INITIAL_TIMESTAMP) * 42 * ONE) / INITIAL_STAKE;
    let reward_per_token = reward_per_token(&staking_contract, TIMESTAMP).await;

    assert_eq!(reward_per_token, expected_reward_per_token);

    let wallet_identity = Identity::Address(Address::from(wallet.address()));
    let expected_reward = expected_reward_per_token * INITIAL_STAKE / ONE;

    let earned = earned(&staking_contract, wallet_identity, TIMESTAMP).await;
    assert_eq!(earned, expected_reward);
}

#[tokio::test]
async fn claim_reward() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    let balance_before = get_balance(&wallet, REWARDS_ASSET).await;

    let expected_reward_per_token: u64 =
        ((TIMESTAMP - INITIAL_TIMESTAMP) * 42 * ONE) / INITIAL_STAKE;
    let expected_reward = expected_reward_per_token * INITIAL_STAKE / ONE;

    let _receipts = get_reward(&staking_contract, TIMESTAMP).await;

    let balance_after = get_balance(&wallet, REWARDS_ASSET).await;
    assert_eq!(balance_after - balance_before, expected_reward);
}

#[tokio::test]
async fn exit_with_reward() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    let expected_reward_per_token: u64 =
        ((TIMESTAMP - INITIAL_TIMESTAMP) * 42 * ONE) / INITIAL_STAKE;
    let expected_reward = expected_reward_per_token * INITIAL_STAKE / ONE;

    let staking_balance_before = get_balance(&wallet, STAKING_ASSET).await;
    let rewards_balance_before = get_balance(&wallet, REWARDS_ASSET).await;

    let _receipts = exit(&staking_contract, TIMESTAMP).await;

    let staking_balance_after = get_balance(&wallet, STAKING_ASSET).await;
    let rewards_balance_after = get_balance(&wallet, REWARDS_ASSET).await;

    assert_eq!(
        rewards_balance_after - rewards_balance_before,
        expected_reward
    );
    assert_eq!(
        staking_balance_after - staking_balance_before,
        INITIAL_STAKE
    );
}

#[tokio::test]
async fn can_get_reward_for_duration() {
    let (staking_contract, _id, _wallet, _wallet2) = setup().await;

    let reward_rate = reward_rate(&staking_contract).await;
    let reward_duration = reward_duration(&staking_contract).await;

    let expected_reward = reward_rate * reward_duration;
    let actual_reward = get_reward_for_duration(&staking_contract).await;

    assert_eq!(expected_reward, actual_reward);
}

#[tokio::test]
async fn can_get_last_time_reward_applicable() {
    let (staking_contract, _id, _wallet, _wallet2) = setup().await;

    let period_finish = period_finish(&staking_contract).await;
    let expected = std::cmp::min(TIMESTAMP, period_finish);
    let actual = last_time_reward_applicable(&staking_contract, TIMESTAMP).await;

    assert_eq!(actual, expected);
}

#[tokio::test]
async fn can_get_last_updated() {
    let (staking_contract, _id, _wallet, _wallet2) = setup().await;

    notify_reward_amount(&staking_contract, 5000, TIMESTAMP).await;
    let last_updated = last_update_time(&staking_contract).await;

    assert_eq!(last_updated, TIMESTAMP);
}

#[tokio::test]
async fn can_notify_reward_amount() {
    let (staking_contract, _id, _wallet, _wallet2) = setup().await;

    let rewardbefore = get_reward_for_duration(&staking_contract).await;
    notify_reward_amount(&staking_contract, 5000, TIMESTAMP).await;
    let rewardafter = get_reward_for_duration(&staking_contract).await;

    assert_eq!(rewardbefore, 42000);
    assert_eq!(rewardafter, 41000);
}

#[tokio::test]
async fn can_get_owner() {
    let (staking_contract, _id, wallet, _wallet2) = setup().await;

    let actualowner = owner(&staking_contract).await;
    let expectedowner = Identity::Address(Address::from(wallet.address()));

    assert_eq!(actualowner, expectedowner);
}