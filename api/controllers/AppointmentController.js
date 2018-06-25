/**
 * AppointmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    async getAppointmentsByDate(req, res) {
        try {
            if (!req.body.date) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            const dateParam = new Date(req.body.date);

            const appointments = await Appointment.find({
                year: dateParam.getFullYear(),
                month: dateParam.getMonth()+1,
                day: dateParam.getDate()
            });
            
            const appointmentsTimeSlots = appointments.map(x => x.timeSlot);
            res.json(appointmentsTimeSlots);

        }
        catch(err) {
            res.status(500).json(err);
        }
    },

    async newAppointment(req, res) {
        try {
            const data = req.body;
            const dateParam = new Date(data.date);

            const existsAppointment = await Appointment.findOne({
                year: dateParam.getFullYear(),
                month: dateParam.getMonth()+1,
                day: dateParam.getDate(),
                timeSlot: data.timeSlot,
                doctor: data.doctorId
            });

            if (existsAppointment) {
                return res.status(409).json({ error: 'TimeSlot unavailabe' });
            }
            
            const newAppointment = await Appointment.create({
                year: dateParam.getFullYear(),
                month: dateParam.getMonth()+1,
                day: dateParam.getDate(),
                timeSlot: data.timeSlot,
                doctor: data.doctorId,
                patient: data.patientId
            }).fetch();
            
            newAppointment.doctor = await Doctor.findOne({id: data.doctorId}).populate('user');
            newAppointment.patient = await Patient.findOne({id: data.patientId}).populate('user');
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
