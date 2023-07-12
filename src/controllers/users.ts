import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();
        return res.status(200).json({ all_users_found: users});

    } catch (error) {
        console.log(error)
        return res.status(400).json({ 
                directory: "src/controllers/users.ts",
                message: "cannot get all users @getUsers()"
            })
    }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);

        return res.json({ user_deleted: deletedUser })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
                directory: "src/controllers/users.ts",
                message: "deleting error emitted"
            })
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                directory: "src/controllers/users.ts",
                message: "No username submitted for changes"
            })
        }

        const user = await getUserById(id);

        user.username = username;

        await user.save();

        return res.status(200).json({
                updated_user: user
            }).end()
            
    } catch (error) {
        console.log(error);
        return res.status(400).json({
                directory: "src/controllers/users.ts",
                message: "updating error emitted"
            })
    }
}