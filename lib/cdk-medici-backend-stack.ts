import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SwCognito } from './cognito';
import { SwLambdaFunctions } from './lambdaFunctions';
import { SwApiGateway } from './apiGateway';
import { SwUsuarioLambdaFunction } from './usuarioLambdaFunction';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMediciBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);    
    const lambdaFunctions = new SwLambdaFunctions(this,'LambdaFUnctions');
    const cognitoPool = new SwCognito(this,'ClinicaCognitoPool',lambdaFunctions.cognitoLambda);
    const usuarioLambda = new SwUsuarioLambdaFunction(this,'UsuarioLambdaFnction',cognitoPool.userPool.userPoolId);
    new SwApiGateway(this,'ApiGW',{
      citasLambda:    lambdaFunctions.citasLambda,
      medicosLambda:  lambdaFunctions.medicosLambda,
      pacientesLambda:lambdaFunctions.pacientesLambda,
      signosLambda:   lambdaFunctions.signosLambda,
      perfilLambda: lambdaFunctions.perfilLambda,
      usuarioLambda: usuarioLambda.usuariosLambda
    });
  }
}
