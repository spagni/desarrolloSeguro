/**
 * AppointmentDetailController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    //Creo un nuevo detalle de turno y es agregado a la historia clinica del paciente
    async newAppointmentDetail(req, res) {
        try{
            if (!req.body.patientId || !req.body.diagnosis || !req.body.appointmentId) {
                return res.status(400).json({ error: 'Missing required fields (Patient - Diagnosis - Appointment)' });
            }
            const medicalRecord = MedicalRecord.findOne({ patient: req.body.patientId });

            const newAppointmentDetail = AppointmentDetail.create({
                diagnosis: req.body.diagnosis,
                appointment: req.body.appointmentId,
                medicalRecord: medicalRecord.id
            }).fetch();

            res.json(newAppointmentDetail);
        }
        catch(err) {
            res.status(500).json(err);
        }
    }

};

