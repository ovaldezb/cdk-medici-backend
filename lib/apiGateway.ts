import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";


interface SwApiGatewaysProps{
  citasLambda: IFunction,
  medicosLambda: IFunction,
  pacientesLambda:IFunction,
  signosLambda: IFunction,
  perfilLambda: IFunction
}

export class SwApiGateway extends Construct{

  constructor(scope: Construct, id: string, props:SwApiGatewaysProps){
    super(scope,id);
    this.createApigCitas(props.citasLambda);
    this.createApigMedicos(props.medicosLambda);
    this.createApigPaciente(props.pacientesLambda);
    this.createApigSignos(props.signosLambda);
    this.createApigPerfil(props.perfilLambda);
  }

  private createApigCitas(citasLambda:IFunction){
    const apiGwCitas = new LambdaRestApi(this, 'CitasApiGw', {
      restApiName: 'Citas Service',
      handler: citasLambda,
      proxy: false,
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    const citas = apiGwCitas.root.addResource('cita');
    citas.addMethod('POST');
    const getCitaByFecha = citas.addResource('{parametro}');
    getCitaByFecha.addMethod('GET');
    getCitaByFecha.addMethod('PUT');
    getCitaByFecha.addMethod('DELETE');
    const getCitaByFechaAndMedico = getCitaByFecha.addResource('{idMedico}');
    getCitaByFechaAndMedico.addMethod('GET');
  }

  private createApigMedicos(medicosLambda:IFunction){
    const apiGwMedico = new LambdaRestApi(this, 'MedicoApiGw', {
      restApiName: 'Medico Service',
      handler: medicosLambda,
      proxy: false,
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    const medico = apiGwMedico.root.addResource('medico');
    medico.addMethod('POST');
    medico.addMethod('GET');
    const actionMedicoById = medico.addResource('{idMedico}');
    actionMedicoById.addMethod('GET');
    actionMedicoById.addMethod('PUT');
    actionMedicoById.addMethod('DELETE');
  }

  private createApigPaciente(pacienteLambda:IFunction){
    const apiGwPaciente = new LambdaRestApi(this, 'PacienteApiGw', {
      restApiName: 'Paciente Service',
      handler: pacienteLambda,
      proxy: false,
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    const paciente = apiGwPaciente.root.addResource('paciente');
    paciente.addMethod('POST');
    paciente.addMethod('GET');
    const pacienteNombre = paciente.addResource('nombre').addResource('{nombre}');
    pacienteNombre.addMethod('GET');
    const pacienteApellido = paciente.addResource('apellido').addResource('{apellido}');
    pacienteApellido.addResource('GET');
    const pacienteTelefono = paciente.addResource('telefono').addResource('{telefono}');
    pacienteTelefono.addMethod('GET');
    const pacienteById = paciente.addResource('{idPaciente}');
    pacienteById.addMethod('PUT');
    pacienteById.addMethod('DELETE');
    pacienteById.addMethod('GET');
  }

  private createApigSignos(signosLambda:IFunction){
    const apiGwSignos = new LambdaRestApi(this, 'SignosApiGw', {
      restApiName: 'Signos Service',
      handler: signosLambda,
      proxy: false,
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    const signos = apiGwSignos.root.addResource('signos');
    signos.addMethod('POST');
    const signosById = signos.addResource('{parametro}'); //en el put is el idSigno, en el get es idPaciente
    signosById.addMethod('PUT');
    signosById.addMethod('GET');
    //const signosByPaciente = signos.addResource('paciente').addResource('{idPaciente}')
    //signosByPaciente.addMethod('GET')
  }

  private createApigPerfil(perfilLambda:IFunction){
    const apiGwPerfil = new LambdaRestApi(this, 'PerfilApiGw', {
      restApiName: 'Perfil Service',
      handler: perfilLambda,
      proxy: false,
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });
    const perfil = apiGwPerfil.root.addResource('perfil');
    perfil.addMethod('GET');
    perfil.addMethod('POST');
    const perfilById = perfil.addResource('{idPerfil}');
    perfilById.addMethod('PUT');
    perfilById.addMethod('DELETE');
  }
}