/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    async getDoctor(req, res) {
        if (!req.body.doctorId) {
            return res.status(400).json({ error: 'Missing doctor Id' });
        }
        try {
            const doctor = await Doctor.findOne({id: req.body.doctorId}).populate('user');
            const result = {
                'fullName': doctor.user.fullName,
                'userId': doctor.user.id,
                'doctorId': doctor.id,
                'registrationId': doctor.registrationId
            };
            res.json(result);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },
  
    async getAvailableDoctors(req, res) {
        try {
            const doctors = await Doctor.find().populate('user');
            const result = doctors.map(x => {
                return {
                    'fullName': x.user.fullName,
                    'userId': x.user.id,
                    'doctorId': x.id,
                    'registrationId': x.registrationId
                };
            });
            res.json(result);
        }
        catch(err) {
            res.status(500).json(err);
        }
    }

};

