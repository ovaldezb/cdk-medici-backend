import * as cdk from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { SwCognito } from './cognito';
import { SwLambdaFunctions } from './lambdaFunctions';
import { SwApiGateway } from './apiGateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkMediciBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunctions = new SwLambdaFunctions(this,'LambdaFUnctions');

    new SwApiGateway(this,'ApiGW',{
      citasLambda:    lambdaFunctions.citasLambda,
      medicosLambda:  lambdaFunctions.medicosLambda,
      pacientesLambda:lambdaFunctions.pacientesLambda,
      signosLambda:   lambdaFunctions.signosLambda
    });

    const cognitoPool = new SwCognito(this,'ClinicaCognitoPool',lambdaFunctions.cognitoLambda);
    
  }
}
