module 0xa8b10ab4bf87b830aa1d6cc7c3e40825f28c0a8eb44ba3b1b2ce64e7fd79eaff::Crowdfunding {
    //use aptos_framework::coin::{self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::signer;
    use aptos_framework::coin;
    use std::vector;

    /// A campaign with a goal, current amount raised, and an active status
    struct Campaign has store, key {
        goal_amount: u64,
        current_amount: u64,
        active: bool,
    }

    /// Resource that holds all campaigns
    struct Campaigns has key {
        campaigns: vector<Campaign>,
    }

    /// Initialize a campaign for an account
    public entry fun create_campaign(account: &signer, goal_amount: u64) acquires Campaigns {
        let addr = signer::address_of(account);
        
        // If Campaigns resource doesn't exist for the account, create it
        if (!exists<Campaigns>(addr)) {
            move_to(account, Campaigns {
                campaigns: vector::empty<Campaign>(),
            });
        };

        // Add a new campaign to the account
        let campaigns = borrow_global_mut<Campaigns>(addr);
        vector::push_back(&mut campaigns.campaigns, Campaign {
            goal_amount,
            current_amount: 0,
            active: true,
        });
    }

    /// View details of the first campaign of an account
    public fun view_campaign(addr: address): (u64, u64, bool) acquires Campaigns {
        if (!exists<Campaigns>(addr)) {
            return (0, 0, false); // No campaign found
        };

        let campaigns = borrow_global<Campaigns>(addr);
        let campaign = vector::borrow(&campaigns.campaigns, 0);
        (campaign.goal_amount, campaign.current_amount, campaign.active)
    }

    /// Contribute to a campaign
    public entry fun contribute(account: &signer, campaign_owner: address, amount: u64) acquires Campaigns {
        // Transfer the AptosCoins from the contributor's account to the campaign owner's account
        coin::transfer<AptosCoin>(account, campaign_owner, amount);

        // Ensure the campaign exists and is active
        if (!exists<Campaigns>(campaign_owner)) {
            abort 404; // Campaign does not exist
        };

        let campaigns = borrow_global_mut<Campaigns>(campaign_owner);
        let campaign = vector::borrow_mut(&mut campaigns.campaigns, 0); // Assuming only one campaign for simplicity
        assert!(campaign.active, 403); // Campaign must be active to contribute

        // Update the campaign's current amount
        campaign.current_amount = campaign.current_amount + amount;

        // Mark the campaign as inactive if the goal is met
        if (campaign.current_amount >= campaign.goal_amount) {
            campaign.active = false;
        };
    }
}
