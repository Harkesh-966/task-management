import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { HttpApi, CorsHttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

export class CdkSetupStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const apiFn = new NodejsFunction(this, 'ExpressHandler', {
            entry: path.resolve(__dirname, '..', 'lambda', 'src', 'index.ts'),
            handler: 'handler',
            runtime: Runtime.NODEJS_18_X,
            memorySize: 256,
            timeout: Duration.seconds(10),
            bundling: {
                externalModules: ['aws-sdk'],
            },
            environment: {
                PORT: '4000',
                NODE_ENV: 'production',
                CORS_ORIGIN: 'http://localhost:4200',
                MONGODB_URI: 'mongodb+srv://harkeshsaini108:YS1xQWbKkWeNBk9l@cluster0.og9mayv.mongodb.net/task_manager_db?retryWrites=true&w=majority&appName=Cluster0s',
                JWT_ACCESS_SECRET: 'c7a8005b741e9c85cd5401bd367cde3ef0d49374aa896b313efaaa7f52958fe9',
                JWT_REFRESH_SECRET: '065ab8734386730ac26feafa734f688ad2450b8c3670608400e7c28c9ae0b631',
                ACCESS_TOKEN_TTL: '7d',
                REFRESH_TOKEN_TTL: '7d',
                RATE_LIMIT_WINDOW_MS: '60000',
                RATE_LIMIT_MAX: '100',
            },
        });

        const httpApi = new HttpApi(this, 'HttpApi', {
            corsPreflight: {
                allowOrigins: [
                    'https://lucent-naiad-5a58ba.netlify.app',
                    'http://localhost:4200',
                ],
                allowHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Requested-With',
                    'Accept',
                    'Origin'
                ],
                allowMethods: [
                    CorsHttpMethod.GET,
                    CorsHttpMethod.POST,
                    CorsHttpMethod.PUT,
                    CorsHttpMethod.PATCH,
                    CorsHttpMethod.DELETE,
                    CorsHttpMethod.OPTIONS
                ],
                allowCredentials: true,
            },
        });

        const integration = new HttpLambdaIntegration('ExpressIntegration', apiFn);
        httpApi.addRoutes({ path: '/{proxy+}', integration });
        new cdk.CfnOutput(this, 'HttpApiEndpoint', {
            value: httpApi.apiEndpoint,
        });
    }
}
