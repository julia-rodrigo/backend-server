import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

require('dotenv').config() 
const COOKIE = process.env.COOKIE;

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;

        if (!currentUserId) {
            return res.status(403).json({
                directory: "src/middlewares/index.ts",
                message: "This user ID doesnt exists"
            })
        }

        if (currentUserId.toString() != id) {
            return res.status(403).json({
                directory: "src/middlewares/index.ts",
                message: "Only the owner can make changes to this account"
            })
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            directory: "src/middlewares/index.ts",
            message: "Owner error emitted"
        })
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        // return res.json({ message: "duck duck goose!"});
        const sessionToken = req.cookies[COOKIE];

        if (!sessionToken) {
            return res.status(403).json({
                    directory: "src/middlewares/index.ts",
                    message: "Session token not found"
                })
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            return res.status(403).json({
                    directory: "src/middlewares/index.ts",
                    message: "You dont have a session token. Log in with your account to receive one and retrieve your request."
                })
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
                directory: "src/middlewares/index.ts",
                message: "isAuthenticated error emitted"
            })
    }
} 