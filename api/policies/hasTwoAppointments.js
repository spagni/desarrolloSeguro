/***************************************************************************
* Policy que valida que el usuario no tenga mas de dos turnos reservados   *
* en una misma semana segun las ISO WEEKS.                                 *
* Para ello usamos momentJs que nos facilita el trabajo con fechas         *
***************************************************************************/
const moment = require('moment');

module.exports = async function (req, res, proceed) {
    //admin o secretaria pueden crear turnos libremente
    if (req.user && (req.user.role === 'admin' || req.user.role === 'assistant')) {
        proceed();
    }
    //usuario solo puede tener dos turnos por semana
    else if (req.user.role === 'user') {
        
        if (!req.body.date) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        //Busco el id del paciente para el usuario que hace el request y lo inserto en el body
        const patient = await Patient.findOne({user: req.user.sub});
        req.body.patientId = patient.id;

        const date = moment(req.body.date);
        
        const appointments = await Appointment.find({
            patient: req.body.patientId
        });

        const weekAppointments = appointments.filter(x => {
            const xDate = moment([x.year,x.month-1,x.day]);
            
            if (date.isoWeek() === xDate.isoWeek()) {
                return x;
            }
        });
        
        if (weekAppointments.length >= 2) {
            return res.status(400).json({ error: 'Can not book more than two appointments in one week' });
        }
        proceed();
    }  
  };