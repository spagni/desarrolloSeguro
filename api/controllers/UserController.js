/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    async getAllUsers(req, res) {
        try {
            const users = User.find();
            res.json(users);
        }
        catch(err) {
            res.status(500).json(err);
        }
    } 

};

