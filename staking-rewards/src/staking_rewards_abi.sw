library staking_rewards_abi;

use std::{contract_id::ContractId, identity::Identity};

abi StakingRewards {
    #[storage(read)]fn balance_of(account: Identity) -> u64;
    #[storage(read, write)]fn constructor(owner: Identity, rewards_distribution: Identity);
    #[storage(read)]fn earned(account: Identity, test_timestamp: u64) -> u64;
    #[storage(read, write)]fn exit(test_timestamp: u64);
    #[storage(read, write)]fn get_reward(test_timestamp: u64);
    #[storage(read)]fn get_reward_for_duration() -> u64;
    #[storage(read)]fn last_time_reward_applicable(test_timestamp: u64) -> u64;
    #[storage(read)]fn last_update_time() -> u64;
    #[storage(read, write)]fn notify_reward_amount(reward: u64, test_timestamp: u64);
    #[storage(read)]fn owner() -> Identity;
    #[storage(read)]fn period_finish() -> u64;
    #[storage(read, write)]fn recover_tokens(token_address: ContractId, token_amount: u64);
    #[storage(read)]fn reward_per_token(test_timestamp: u64) -> u64;
    #[storage(read)]fn reward_per_token_stored() -> u64;
    #[storage(read)]fn reward_per_token_paid(account: Identity) -> u64;
    #[storage(read)]fn reward_rate() -> u64;
    #[storage(read)]fn rewards(account: Identity) -> u64;
    #[storage(read)]fn rewards_distribution() -> Identity;
    #[storage(read)]fn rewards_duration() -> u64;
    #[storage(read)]fn rewards_token() -> ContractId;
    #[storage(read, write)]fn set_rewards_duration(rewards_duration: u64, test_timestamp: u64);
    #[storage(read, write)]fn stake(test_timestamp: u64);
    #[storage(read)]fn staking_token() -> ContractId;
    #[storage(read)]fn total_supply() -> u64;
    #[storage(read, write)]fn withdraw(amount: u64, test_timestamp: u64);
}