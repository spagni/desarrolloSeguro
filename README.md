# Sistema de gestión de turnos para Consultorio - Desarrollo Seguro

  

Sebastian Pagni - Pablo Rozek - Sebastian Soplan

  
  

### Endpoints

  

+ /auth/signUp

		parametros => { email: string, fullName: string, password: string}
	Devuelve Nuevo usuario

+  /auth/signUpWithRole
		Requiere Token.	Solo usuarios admistrador.
		Devuelve Nuevo usuario
		
		parametros => { email: string, fullName: string, password: string, role: string}

+  /auth/login'
	
		parametros => {email: string, password: string}
	Devuelve token

+  /patient
	Set de los datos de paciente
	
		parameters => {dni: number, coverage: string, coverageNumber: number, userId: string}
	Devuelve nuevo paciente