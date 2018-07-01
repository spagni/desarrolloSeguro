/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  //Authentication Routes
  'POST /auth/signUp': 'AuthController.signUp',
  'POST /auth/signUpWithRole': 'AuthController.signUpWithRole',
  'POST /auth/login': 'AuthController.login',
  //Patient Routes
  'POST /patient': 'PatientController.setPatientData',
  //Appointment Routes
  'POST /appointment': 'AppointmentController.newAppointment',
  'POST /patientAppointments': 'AppointmentController.getPatientAppointments',
  'POST /doctorAppointments': 'AppointmentController.getDoctorAppointments',
  'POST /appointmetByDate': 'AppointmentController.getAppointmentsByDate',
  'POST /deleteAppointment': 'AppointmentController.deleteAppointment',
  //Doctor routes
  'POST /doctors': 'DoctorController.getAvailableDoctors',
  'POST /doctor': 'DoctorController.getDoctor',
  //AppointmentDetail routes
  'POST /appointmentDetails': 'AppointmentDetailController.newAppointmentDetail'


};
