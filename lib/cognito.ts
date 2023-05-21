import { Construct } from "constructs";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RemovalPolicy } from "aws-cdk-lib";

export class SwCognito extends Construct{

  public userPool:cognito.UserPool;

  constructor(scope: Construct, id: string, cognitoLambda:NodejsFunction){
    super(scope,id);
   
    this.userPool = new cognito.UserPool(this,'UserPool',{
      userPoolName: 'clinicaUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      autoVerify:{
        email: true
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
      customAttributes: {
        country: new cognito.StringAttribute({mutable: true}),
        city: new cognito.StringAttribute({mutable: true}),
        isAdmin: new cognito.StringAttribute({mutable: true}),
      },
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY,
      /*lambdaTriggers:{
        postConfirmation:cognitoLambda
      }*/
    });

    this.userPool.addClient('Medici App',{
      supportedIdentityProviders:[]
    })

    new cognito.CfnUserPoolGroup(this,'Medico Group',{
      groupName:'medico',
      userPoolId:this.userPool.userPoolId
    });

    new cognito.CfnUserPoolGroup(this,'Enfermera Group',{
      groupName:'enfermera',
      userPoolId:this.userPool.userPoolId
    });

    new cognito.CfnUserPoolGroup(this,'Recepcion Group',{
      groupName:'recepcion',
      userPoolId:this.userPool.userPoolId
    });

    new cognito.CfnUserPoolGroup(this,'Administración Group',{
      groupName:'administracion',
      userPoolId:this.userPool.userPoolId
    });

    this.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION,cognitoLambda);
  }
}