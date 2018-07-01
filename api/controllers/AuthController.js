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

        const userToken = jwt.sign({email: user.email, sub: user.id, role: user.role}, keys.jwtSecret);
        res.json({ token: userToken, role: user.role });
    },

    async signUp(req, res) {
        try{
            const user = req.body;

            if (!user.email || !user.password || !user.fullName) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            user.password = bcrypt.hashSync(req.body.password, 10);
            const newUser = await User.create({
                email: user.email.toLowerCase().trim(),
                fullName: user.fullName,
                password: user.password,
                role: 'user'
            }).fetch();

            res.json(newUser);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    async signUpWithRole(req, res) {
        try{
            const user = req.body;

            if (!user.email || !user.password || !user.fullName || !user.role) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            if (user.role !== 'admin' && user.role !== 'user' && user.role !== 'doctor' && user.role !== 'assistant') {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            if (user.role === 'doctor' && !user.registrationId) {
                return res.status(400).json({ error: 'Missing doctor registration ID.' });
            }

            user.password = bcrypt.hashSync(req.body.password, 10);
            const newUser = await User.create({
                email: user.email.toLowerCase().trim(),
                fullName: user.fullName,
                password: user.password,
                role: user.role
            }).fetch();

            if (user.role === 'doctor') {
                
                const newDoctor = await Doctor.create({
                    user: newUser.id,
                    registrationId: user.registrationId
                }).fetch();
                //Devuelvo el doctor con el usuario adentro
                return res.json(await Doctor.find({ id: newDoctor.id }).populate('user'));
            }

            return res.json(newUser);
        }
        catch(err){
            res.status(500).json(err);
        }
    },

    async currentUser(req, res) {
        if (req.headers['access-token']) {
            jwt.verify(req.headers['access-token'], keys.jwtSecret, (err, decoded) => {
              if (err) {
                return res.json(null);
              }
              else {
                req.user = decoded;
                const user = await User.findOne({ id: req.user.sub });

                res.json(user);
              }
            });
        }
        else {
            return res.json(null);
        }
    }
};

