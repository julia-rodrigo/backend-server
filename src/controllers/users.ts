import express from 'express';
import { deleteUserById, getUsers } from '../db/users';

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