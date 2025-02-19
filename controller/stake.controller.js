const db = require("../db")

module.exports = {
   
    addStake: async (req, res) => {
        try {
            let { userId, amount, currencyId } = req.body;

            // 1️ Get user wallet balance
            const [wallet] = await db.promiseQuery("SELECT balance FROM wallet WHERE user_id = ?", [userId]);
            if (!wallet) return res.status(400).json({ status: 0, message: "Wallet not found" });

            let balance = JSON.parse(wallet.balance);

            // Check if user has enough balance
            if (!balance[currencyId] || balance[currencyId].amount < amount) {
                return res.status(400).json({ status: 0, message: "Insufficient balance" });
            }

            // 2️ Deduct staking amount
            balance[currencyId].amount -= amount;
            await db.promiseQuery("UPDATE wallet SET balance = ? WHERE user_id = ?", [JSON.stringify(balance), userId]);
            console.log("Deducted the balance from wallet table");

            // 3️ Insert into staking history
            await db.promiseQuery("INSERT INTO stake_history (user_id, currency_id, amount) VALUES (?, ?, ?)", [userId, currencyId, amount]);
            console.log("Inserted staking history");

            // 4️ Handle level bonuses (Referral-based)
            let referrer = await db.promiseQuery("SELECT referred_by,email FROM users WHERE id = ?", [userId]);
            let level = 1;
            let bonus = 5; // 5% for level 1, 4% for level 2, etc.

            while (referrer.length && level <= 5 && referrer[0].email !== "admin") {
                let referrerId = referrer[0].referred_by;
                if (!referrerId || referrerId == 4) break;

                let bonusAmount = amount * (`0.0${bonus}`);

                // 5️ Insert bonus into level history
                await db.promiseQuery(
                    "INSERT INTO level_history (from_user_id, to_user_id, level, currency_id, amount) VALUES (?, ?, ?, ?, ?)",
                    [userId, referrerId, level, currencyId, bonusAmount]
                );
                console.log(`✅ Level ${level} bonus added: ${bonusAmount} to user ${referrerId}`);

                // 6️ Update referrer’s wallet balance (Add bonus)
                let [refWallet] = await db.promiseQuery("SELECT balance FROM wallet WHERE user_id = ?", [referrerId]);
                let refBalance = JSON.parse(refWallet.balance);

                // Initialize if missing
                if (!refBalance[currencyId]) refBalance[currencyId] = { amount: 0, bonus: 0 };

                // Add bonus amount
                refBalance[currencyId].bonus += bonusAmount;
                await db.promiseQuery("UPDATE wallet SET balance = ? WHERE user_id = ?", [JSON.stringify(refBalance), referrerId]);
                console.log(`✅ Updated wallet balance for referrer ${referrerId}`);

                // Move to next referrer
                referrer = await db.promiseQuery("SELECT referred_by,email FROM users WHERE id = ?", [referrerId]);
                level++;
                bonus--; // Reduce bonus for next levels
            }

            return res.json({ status: 1, message: "Staking successful", amount });

        } catch (error) {
            console.error("Error in staking:", error);
            return res.status(500).json({ status: 0, message: "Internal server error" });
        }
    }
}

