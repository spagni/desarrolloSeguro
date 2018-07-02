/**
 * PatientController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    async setPatientData(req, res) {
        try {
            const data = req.body;

            if (!data.userId) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            const existsPatient = await Patient.findOne({ user: data.userId });
            //Si el paciente ya existe, actualizo los datos
            if (existsPatient) {
                newPatient = await Patient.update(existsPatient)
                                            .set({
                                                dni: data.dni,
                                                coverage: data.coverage,
                                                coverageNumber: data.coverageNumber
                                            })
                                            .fetch();
            }
            //Si no, creo un nuevo registro asociado al usuario
            else {
                newPatient = await Patient.create({
                    dni: data.dni,
                    coverage: data.coverage,
                    coverageNumber: data.coverageNumber,
                    user: data.userId
                }).fetch();

                await MedicalRecord.create({
                    patient: newPatient.id
                });
            }
            res.json(await Patient.find({user: data.userId}).populate('user'));
        }
        catch(err) {
            res.status(500).json(err);
        }
    },

    async getPatientData(req, res) {
        try {
            if (req.user.role === 'user') {
                patient = await Patient.findOne({user: req.user.sub});
                patientId = patient.id;
            }
            else {
                //Si lo llama un admin o secretaria, tiene que mandar el id de paciente
                patientId = req.body.patientId;
                patient = await Patient.findOne({id: patientId});
            }   
            res.json(patient);
        }
        catch(err) {
            res.status(500).json(err);
        }
        
    }
};

