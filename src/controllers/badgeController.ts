import { Request, Response } from 'express';
import { connectDB } from '../config/db';
import { log } from '../utils/logger';

/**
 * Adds a badge (role) to a user.
 * @param {Request} req - The request object containing the user's username and the role to add.
 * @param {Response} res - The response object used to send the updated user object.
 * @returns {void}
 */
export const addBadgeToUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const { role } = req.body;

    if (!role) {
        res.status(400).json({ message: "Role is required." });
        return;
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (!user.roles) {
            user.roles = [];
        }
        if (!user.roles.includes(role)) {
            user.roles.push(role);
            await usersCollection.updateOne({ username }, { $set: { roles: user.roles } });
        }

        res.status(200).json({ message: `Role '${role}' added to user.`, user });
    } catch (error) {
        log("error", `Error adding role to user: ${error}`);
        res.status(500).json({ message: "Error adding role to user." });
    }
};



/**
 * Removes a badge (role) from a user.
 * @param {Request} req - The request object containing the user's username and the role to remove.
 * @param {Response} res - The response object used to send the updated user object.
 * @returns {Promise<void>} A promise indicating the completion of the operation.
 */
export const removeBadgeFromUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const { role } = req.body;

    if (!role) {
        res.status(400).json({ message: "Role is required." });
        return;
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.roles && user.roles.includes(role)) {
            user.roles = user.roles.filter((r: string) => r !== role);
            await usersCollection.updateOne({ username }, { $set: { roles: user.roles } });
        }

        res.status(200).json({ message: `Role '${role}' removed from user.`, user });
    } catch (error) {
        log("error", `Error removing role from user: ${error}`);
        res.status(500).json({ message: "Error removing role from user." });
    }
};

/**
 * Retrieves all badges (roles) for a user.
 * @param {Request} req - The request object containing the user's username.
 * @param {Response} res - The response object used to send the user's roles.
 * @returns {Promise<void>} A promise indicating the completion of the operation.
 */
export const getBadgesFromUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        res.status(200).json({ roles: user.roles || [] });
    } catch (error) {
        log("error", `Error retrieving badges for user: ${error}`);
        res.status(500).json({ message: "Error retrieving badges for user." });
    }
};
