import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMediciBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeJSProps: NodejsFunctionProps ={
      bundling: {
        externalModules: [
          'aws-sdk'
        ]
      },
      environment: {
        MONGODB_URI: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      },
      runtime: Runtime.NODEJS_16_X
    }

    const citasFunction = new NodejsFunction(this, 'CitasFunction', {
      functionName: 'CitasFunction',
      entry: join(__dirname, '/../functions/citasHandler.ts'),
      ...nodeJSProps
    });

    const medicosFunction = new NodejsFunction(this, 'MedicosFunction', {
      functionName: 'MedicosFunction',
      entry: join(__dirname, '/../functions/medicoHandler.ts'),
      ...nodeJSProps
    });

    const pacienteFunction = new NodejsFunction(this, 'PacientesFunction', {
      functionName: 'PacientesFunction',
      entry: join(__dirname, '/../functions/pacienteHandler.ts'),
      ...nodeJSProps
    });

    const signosFunction = new NodejsFunction(this, 'SignosFunction', {
      functionName: 'SignosFunction',
      entry: join(__dirname, '/../functions/signosHandler.ts'),
      ...nodeJSProps
    });

    const apiGwCitas = new LambdaRestApi(this, 'CitasApiGw', {
      restApiName: 'Recepcion Service',
      handler: citasFunction,
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
    getCitaByFecha.addResource('PUT');
    getCitaByFecha.addResource('DELETE');
    const getCitaByFechaAndMedico = getCitaByFecha.addResource('{idMedico}');
    getCitaByFechaAndMedico.addMethod('GET');
    

    const apiGwMedico = new LambdaRestApi(this, 'MedicoApiGw', {
      restApiName: 'Medico Service',
      handler: medicosFunction,
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

    const apiGwPaciente = new LambdaRestApi(this, 'PacienteApiGw', {
      restApiName: 'Paciente Service',
      handler: pacienteFunction,
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

    const apiGwSignos = new LambdaRestApi(this, 'SignosApiGw', {
      restApiName: 'Signos Service',
      handler: signosFunction,
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
    const signosById = signos.addResource('{idCita}');
    signosById.addMethod('PUT');
    const signosByPaciente = signos.addResource('paciente').addResource('{idPaciente}')
    signosByPaciente.addMethod('GET')
  }
}
