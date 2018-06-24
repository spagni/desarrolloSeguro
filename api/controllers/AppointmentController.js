/**
 * AppointmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    async newAppointment(req, res) {
        try {
            const data = req.body;

            const newAppointment = await Appointment.create({
                date: data.date,
                doctor: data.doctorId,
                patient: data.patientId
            }).fetch();
            
            newAppointment.doctor = await Doctor.findOne({id: data.doctorId});
            newAppointment.patient = await Patient.findOne({id: data.patientId});
            //Devuelvo el nuevo turno con paciente y doctor
            res.json(newAppointment);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },

    async getPatientAppointments(req, res) {
        try {
            const {patientId} = req.body;

            if (!patientId) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }
            
            const patientAppointments = await Appointment.find({ patient: patientId });

            //FALTA RECUPERAR DATOS DE DOCTOR Y PACIENTE
            //patientAppointments.doctor = await Doctor.findOne({id: data.doctorId});
            //patientAppointments.patient = await Patient.findOne({id: data.patientId});
            
            res.json(patientAppointments);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },

    async getDoctorAppointments(req, res) {
        try {
            const {doctorId} = req.body;

            if (!doctorId) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            const doctorAppointments = await Appointment.find({ doctor: doctorId });

            res.json(doctorAppointments);
        }
        catch(err) {
            res.status(500).json(err);
        }
    }

};

