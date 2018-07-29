/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': ['logger','verifyToken'],
  AuthController: {
    '*': 'logger',
    'signUpWithRole': ['logger','verifyToken','isAdmin']
  },
  PatientController: {
    'setPatientData': ['logger','verifyToken','canUpdatePatientData']
  },
  AppointmentController: {
    'newAppointment': ['logger','verifyToken','hasTwoAppointments'],
    'getPatientAppointments': ['logger','verifyToken'],
    'getAppointmentsByDate': ['logger','verifyToken'],
    'deleteAppointment': ['logger','verifyToken'],
    'getDoctorAppointments': ['logger','verifyToken','canGetDoctorAppointments']
  },
  AppointmentDetailController: {
    'newAppointmentDetail': ['logger','verifyToken', 'isDoctor']
  }

};
