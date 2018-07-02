/**
 * AppointmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    async getAppointmentsByDate(req, res) {
        try {
            if (!req.body.date || !req.body.doctorId) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            const dateParam = new Date(req.body.date);
            //Devuelvo los turnos ocupados para un día específico y para un doctor en particular
            const appointments = await Appointment.find({
                year: dateParam.getUTCFullYear(),
                month: dateParam.getUTCMonth()+1,
                day: dateParam.getUTCDate(),
                doctor: req.body.doctorId
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
            //Verifico si existe un turno para el doctor en ese TimeSlot
            const existsAppointment = await Appointment.findOne({
                year: dateParam.getUTCFullYear(),
                month: dateParam.getUTCMonth()+1,
                day: dateParam.getUTCDate(),
                timeSlot: data.timeSlot,
                doctor: data.doctorId
            });

            if (existsAppointment) {
                return res.status(409).json({ error: 'TimeSlot unavailabe' });
            }
            
            //Creo el turno
            const newAppointment = await Appointment.create({
                year: dateParam.getUTCFullYear(),
                month: dateParam.getUTCMonth()+1,
                day: dateParam.getUTCDate(),
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
            if (req.user.role === 'user') {
                const patient = await Patient.findOne({user: req.user.sub});
                patientId = patient.id;
            }
            else {
                //Si lo llama un admin o secretaria, tiene que mandar el id de paciente
                patientId = req.body.patientId;
            }

            if (!patientId) {
                return res.status(400).json({ error: 'Missing patient Id' });
            }
            
            const patientAppointments = await Appointment.find({ patient: patientId }).populate('doctor');
            
            res.json(patientAppointments.map(async x => {
                const doctor = await User.findOne({id: x.doctor.user});
                return {
                    year: x.year,
                    month: x.month,
                    day: x.day,
                    timeSlot: x.timeSlot,
                    doctor: doctor.fullName,
                    doctorRegistration: x.doctor.registrationId
                } 
            }));
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

            const doctorAppointments = await Appointment.find({ doctor: doctorId }).populate('patient');

            res.json(doctorAppointments);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },

    async deleteAppointment(req, res) {
        try {
            if (req.user.role === 'user') {
                const patient = await Patient.findOne({user: req.user.sub});
                patientId = patient.id;
            }
            else {
                patientId = req.body.patientId;
            }

            if (!patientId) {
                return res.status(400).json({ error: 'Missing patient Id' });
            }

            await Appointment.destroy({
                id: req.body.appointmentId,
                patient: patientId
            });
            res.status(200).send('Appointment removed');
        }
        catch(err) {
            res.status(500).json(err);
        }
    }

};

