import jwt from 'jsonwebtoken';
import { BackendMethod, Controller, ControllerBase, Fields, UserInfo, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from "./roles";
import { User } from "./user";

@Controller('signIn')
export class SignInController extends ControllerBase {
    @Fields.string({
        caption: terms.username,
        validate: Validators.required
    })
    user = '';
    @Fields.string({
        caption: terms.password,
        validate: Validators.required,
        inputType: 'password'
    })
    password = '';

    @Fields.boolean({
        caption: terms.rememberOnThisDevice,
    })
    rememberOnThisDevice = true;

    // isAllowedRegister = () => {
    //     if (isBackend()) {
    //         return process.env['IS_ALLOWED_REGISTER'] === 'true'
    //     }
    //     return false
    // }

    @BackendMethod({ allowed: true })
    async signIn() {
        let result: UserInfo;
        const userRepo = this.remult.repo(User);
        let u = await userRepo.findFirst({ name: this.user });
        if (!u) {
            let count = await userRepo.count()
            if (count === 0) { //first ever user is the admin
                u = await userRepo.insert({
                    name: this.user,
                    admin: true,
                    mobile: process.env['ADMIN_MOBILE'],
                    allowToStart: true
                })
                await u.hashAndSetPassword(this.password)
                await u.save()
            }
        }
        if (u) {
            if (!u.password) { // if the user has no password defined, the first password they use is their password
                await u.hashAndSetPassword(this.password);
                await u.save();
            }

            if (await u.passwordMatches(this.password)) {
                result = {
                    id: u.id,
                    roles: [],
                    name: u.name,
                    isAdmin: false,
                    isManager: false,
                    isShluch: false,
                    isAvrech: false
                };
                if (u.admin) {
                    result.isAdmin = true
                    result.roles.push(Roles.admin);
                }
                else if (u.manager) {
                    result.isManager = true
                    result.roles.push(Roles.manager);
                }
                else if (u.shluch) {
                    result.isShluch = true
                    result.roles.push(Roles.shluch);
                }
                else if (u.avrech) {
                    result.isAvrech = true
                    result.roles.push(Roles.avrech);
                }
            }
        }

        if (result!) {
            return (jwt.sign(result, getJwtSecret()));
        }
        throw new Error(terms.invalidSignIn);
    }
}

export function getJwtSecret() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return process.env['JWT_SECRET']!;
    // return "my secret key";
}
