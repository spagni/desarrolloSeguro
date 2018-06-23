/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../keys');

module.exports = {

    async login(req, res) {
        const data = req.body;

        if (!data.email || !data.password) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const user = await User.findOne({ email: data.email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ error: 'Resource does not exist.' });
        }

        if (!await bcrypt.compare(data.password, user.password)){
            return res.status(401).json({ error: 'Access Denied' });
        }

        const userToken = jwt.sign({email: user.email, role: user.role}, keys.jwtSecret);
        res.json({ token: userToken });
    },

    async signUp(req, res) {
        try{
            const user = req.body;
            user.password = bcrypt.hashSync(req.body.password, 10);
            const newUser = await User.create({
                email: user.email.toLowerCase().trim(),
                fullName: user.fullName,
                password: user.password,
                role: user.role
            }).fetch();

            res.json(newUser);
        }
        catch(err){
            res.status(500).json(err);
        }
    }
};

