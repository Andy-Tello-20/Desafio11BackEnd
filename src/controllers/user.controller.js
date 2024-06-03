import UserMongoDAO from "../dao/userMongoDAO.js";
import { Logger } from "winston";

export default class UserController {

    static getUser = async (req, res, next) => {
        try {
            const users = await UserMongoDAO.getUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }


    static getUserById = async (req, res, next) => {
        try {
            const { params: { uid } } = req;
            const user = await UserMongoDAO.findUserById(uid);
            if (!user) {
                return res.status(401).json({ message: `User id ${uid} not found 😨.` });
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }


    static createNewUser = async (req, res, next) => {
        try {
            const { body } = req;

            logger.debug(`Datos ingresados futuro usuario ${body}`)
            
            const user = await UserMongoDAO.createUser(body);

            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    static updateUser = async (req, res, next) => {
        try {
            const { body, params: { uid } } = req;
            await UserMongoDAO.updateUser( uid, body);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }

    static deleteUser = async (req, res, next) => {
        try {
            const { params: { uid } } = req;
            await UserMongoDAO.deleteUser( uid );
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    }
}