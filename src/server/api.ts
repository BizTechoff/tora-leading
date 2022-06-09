import { createPostgresConnection } from 'remult/postgres';
import { remultExpress } from 'remult/remult-express';
import { Questionnaire } from '../app/core/questionnaire/questionnaire';
import { SignInController } from '../app/users/SignInController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { User } from '../app/users/user';

export const api = remultExpress({
    entities: [User, Questionnaire],
    controllers: [SignInController, UpdatePasswordController],
    dataProvider: async () => {
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", sslInDev: process.env['DEV_MODE'] === 'PROD' })
        // return undefined;
    }
});
