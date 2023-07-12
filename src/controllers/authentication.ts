import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

require('dotenv').config();
const COOKIE = process.env.COOKIE;

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                    directory: "src/controllers/authentication.ts",
                    message: "no user found with this email or password"
                });
        }

        const user = await getUserByEmail(email)
                        .select("+authentication.salt +authentication.password")

        if (!user) {
            return res.status(400).json({
                    directory: "src/controllers/authentication.ts",
                    message: "no user found with this credentials"
                });
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password != expectedHash) {
            return res.status(403).json({
                    directory: "src/controllers/authentication.ts",
                    message: "the password not equal to expected hash, rejected"
                });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie(COOKIE, 
            user.authentication.sessionToken, 
            { domain: 'localhost', path: '/' }
        )

        return res.status(200).json({ login_user: user});

    } catch (error) {
        console.log(error);
        return res.status(400).json({
                directory: "src/controllers/authentication.ts",
                message: "login error emitted"
            });
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {

        // return res.json({ message: "this is tendo maya"})

        const { email, password, username } = req.body;
    
        if (!email || !password || !username) {
            return res.status(400).json({
                    directory: "src/controllers/authentication.ts",
                    message: "no user with this email or password or username found"
                });
        }

        const existingUser = await getUserByEmail (email);

        if (existingUser) {
            return res.status(400).json({
                    directory: "src/controllers/authentication.ts",
                    message: "This user already exists"
                });
        }

        const salt = random();

        const user = await createUser({
            email, 
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json({ created_user: user}).end();

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            directory: "src/controllers/authentication.ts",
            message: "register error emitted"
        });
    }
}