import { config } from 'dotenv';
import { createPostgresConnection } from 'remult/postgres';
import { remultExpress } from 'remult/remult-express';
import { Course } from '../app/core/course/course';
import { Lecture } from '../app/core/lecture/lecture';
import { LectureMonth } from '../app/core/lecture/lectureMonth';
import { Questionnaire } from '../app/core/questionnaire/questionnaire';
import { GlobalParam } from '../app/globals';
import { SignInController } from '../app/users/SignInController';
import { SignUpController } from '../app/users/SignUpController';
import { UpdatePasswordController } from '../app/users/UpdatePasswordController';
import { User } from '../app/users/user';

config()

export const api = remultExpress({
    entities: [User, Questionnaire, Course, Lecture, LectureMonth],
    controllers: [SignInController, SignUpController, UpdatePasswordController],
    dataProvider: async () => {
        // if (process.env['NODE_ENV'] === "production")
        return createPostgresConnection({ configuration: "heroku", sslInDev: process.env['DEV_MODE'] === 'PROD' })
        // return undefined;
    },
    initRequest: async remult => {
        let u = await remult.repo(User).findId(remult.user.id)
        if (!u) {
            throw 'User NOT FOUND'
        }
        GlobalParam.allowToStart = u.allowToStart ?? false
        console.log('GlobalParam.allowToStart = ', GlobalParam.allowToStart)
    }
});
