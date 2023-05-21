import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class SwLambdaFunctions extends Construct{

  public readonly citasLambda: NodejsFunction;
  public readonly medicosLambda:NodejsFunction;
  public readonly pacientesLambda:NodejsFunction;
  public readonly signosLambda:NodejsFunction;
  public readonly cognitoLambda:NodejsFunction;

  constructor(scope: Construct, id: string){
    super(scope, id);

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

    this.citasLambda = this.createCitasLambda(nodeJSProps);
    this.medicosLambda = this.createMedicosLambda(nodeJSProps);
    this.pacientesLambda = this.createPacientesLambda(nodeJSProps);
    this.signosLambda = this.createSignosLambda(nodeJSProps);
    this.cognitoLambda = this.createCognitoLambda(nodeJSProps);
  }

  private createCitasLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const citasFunction = new NodejsFunction(this, 'CitasFunction', {
      functionName: 'CitasFunction',
      entry: join(__dirname, '/../functions/citasHandler.ts'),
      ...nodeJsProps
    });
    return citasFunction;
  }

  private createMedicosLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const medicosFunction = new NodejsFunction(this, 'MedicosFunction', {
      functionName: 'MedicosFunction',
      entry: join(__dirname, '/../functions/medicoHandler.ts'),
      ...nodeJsProps
    });
    return medicosFunction;
  }

  private createPacientesLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const pacienteFunction = new NodejsFunction(this, 'PacientesFunction', {
      functionName: 'PacientesFunction',
      entry: join(__dirname, '/../functions/pacienteHandler.ts'),
      ...nodeJsProps
    });
    return pacienteFunction;
  }

  private createSignosLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const signosFunction = new NodejsFunction(this, 'SignosFunction', {
      functionName: 'SignosFunction',
      entry: join(__dirname, '/../functions/signosHandler.ts'),
      ...nodeJsProps
    });
    return signosFunction;
  }

  private createCognitoLambda(nodeJsProps:NodejsFunctionProps):NodejsFunction{
    const cognitoFunction = new NodejsFunction(this,'CognitoFunction',{
      functionName:'CognitoFunction',
      entry:join(__dirname,'/../functions/cognitoHandler.ts'),
      ...nodeJsProps
    });
    return cognitoFunction;
  }
  
}