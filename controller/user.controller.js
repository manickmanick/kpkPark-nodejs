// const db = require("../db")
// const bcrypt = require('bcrypt');

// module.exports = {
//     register:async(req,res)=>{
//         try {
//             let {email,password,referredBy} = req.body;
//             referredBy = email == "admin" ? null : referredBy;
//             const hashedPassword = await bcrypt.hash(password, 10);

//             if (!referredBy && email != "admin") {
//                 return res.status(400).json({ message: "ReferredBy required" });
//             }

//             if(email != "admin"){
//                 const referrer = db.query("SELECT id FROM users WHERE id = ?", [referred_by],function(obj){
//                     if(!obj.status) return res.json({status:0,message:"Internal server error"})
//                     if(obj.result == 0) return res.json({status:0,message:"Invalid referral ID"})
//                 });
//             }

//             const [result] = db.query(
//                 "INSERT INTO users (email, password_hash, referred_by) VALUES (?, ?, ?)",
//                 [email, hashedPassword, referredBy],function(obj){
//                     if(!obj.status) return res.json({status:0,message:"Internal server error"})
//                     if(email == "admin"){
//                         return res.json({status:1,message:"admin was inserted"});
//                     }
//                 }
//             );

//             const userId = result.insertId;
//             const rewardAmount = 100; 
//             const currencyId = 1;

//              // Insert into wallet_entry
//         await db.query(
//             "INSERT INTO wallet_entry (user_id, type, currency_id, amount) VALUES (?, 'reward', ?, ?)",
//             [userId, currencyId, rewardAmount]
//         );

//          // Initialize wallet with reward
//          const initialBalance = JSON.stringify({ [currencyId]: { amount: rewardAmount, bonus: 0 } });
//          await db.query("INSERT INTO wallet (user_id, balance) VALUES (?, ?)", [userId, initialBalance]);
 
//          res.json({ message: "User registered successfully", userId });

//         } catch (error) {
//             console.log(error);
            
//             return res.json({status:0,message:"Error registering user"})
//         }
//     }
// }
const bcrypt = require("bcrypt");
const db = require("../db");

const register = async (req, res) => {
    try {
        let { email, password, referredBy } = req.body;
        referredBy = email == "admin" ? null : referredBy;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!referredBy && email != "admin") {
            return res.status(400).json({ message: "ReferredBy required" });
        }

        // Check if the referrer exists
        if (email !== "admin") {
            db.query("SELECT id FROM users WHERE id = ?", [referredBy], function (referrerResult) {
                if (!referrerResult.status) {
                    return res.status(500).json({ status: 0, message: "Internal server error" });
                }
                if (referrerResult.result.length === 0) {
                    return res.status(400).json({ status: 0, message: "Invalid referral ID" });
                }

                // Insert user into the database
                db.query(
                    "INSERT INTO users (email, password_hash, referred_by) VALUES (?, ?, ?)",
                    [email, hashedPassword, referredBy],
                    function (insertResult) {
                        if (!insertResult.status) {
                            return res.status(500).json({ status: 0, message: "Internal server error" });
                        }
                        const userId = insertResult.result.insertId;
                        const rewardAmount = 100; 
                        const currencyId = 1;
            
                    // Insert into wallet_entry
                     db.query(
                        "INSERT INTO wallet_entry (user_id, type, currency_id, amount) VALUES (?, 'reward', ?, ?)",
                        [userId, currencyId, rewardAmount],
                        function(obj){
                            if (!obj.status) {
                                return res.status(500).json({ status: 0, message: "Internal server error" });
                            }
                        }
                    );
            
                    // Initialize wallet with reward
                    const initialBalance = JSON.stringify({ [currencyId]: { amount: rewardAmount, bonus: 0 } });
                    db.query("INSERT INTO wallet (user_id, balance) VALUES (?, ?)", [userId, initialBalance],
                        function(obj){
                            if (!obj.status) {
                                return res.status(500).json({ status: 0, message: "Internal server error" });
                            }
                        }
                    );
                        
                    return res.json({ status: 1, message: "User registered successfully" });
                    }
                );
            });
        } else {
            // If the user is an admin, insert without referral check
            db.query(
                "INSERT INTO users (email, password_hash, referred_by) VALUES (?, ?, ?)",
                [email, hashedPassword, null],
                function (insertResult) {
                    if (!insertResult.status) {
                        return res.status(500).json({ status: 0, message: "Internal server error" });
                    }

                    return res.json({ status: 1, message: "Admin was inserted" });
                }
            );
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 0, message: "Internal server error" });
    }
};

module.exports = { register };
