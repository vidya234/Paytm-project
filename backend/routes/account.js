const express = require('express');
const accountRouter = express.Router();
const { Account, User } = require('../db');
const authMiddleware = require('../middlewares/Authmiddleware');
const zod = require('zod');
const { Jwt_secret } = require('../config.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


// get balance
accountRouter.get('/balance', authMiddleware, async (req, res) => {
    try {const userId = req.userid;
    const account = await Account.findOne({ userId: userId });
    if (!account) {
        return res.status(404).json({
            message: 'Account not found'
        });
    }
    res.json({
        balance: account.balance
    });}
    catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

const transferZod = zod.object({
    to: zod.string(),
    amount: zod.number().positive()
});

// transfer money
accountRouter.post('/transfer', authMiddleware, async (req, res) => {
    try {

        const session = await mongoose.startSession();

        session.startTransaction();
       
        const parsed = transferZod.safeParse(req.body);
        console.log(parsed.data);
        if (!parsed.success || !parsed.data) {
            await session.abortTransaction();
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }
        console.log(parsed.data);
        const {to, amount} = parsed.data;
        const userId = req.userid;
        const account = await Account.findOne({ userId: userId }).session(session);
        if (!account) {
            await session.abortTransaction();
            return res.status(404).json({
                message: 'Account not found'
            });
        }
        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: 'Insufficient balance'
            });
        }
        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(404).json({
                message: 'Recipient account not found'
            });
        }

        // Perform the transfer by decrementing the balance of the sender's account and incrementing the balance of the recipient's account
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({
        message: 'Transfer successful'

        });

    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = accountRouter;