import { BackendMethod, Controller, ControllerBase, Fields, Validators } from "remult";
import { terms } from "../terms";
import { User } from "./user";

@Controller('signIn')
export class SignUpController extends ControllerBase {

    @Fields.string({
        caption: terms.username,
        validate: Validators.required
    })
    user = '';

    @Fields.string({
        caption: terms.mobile,
        validate: Validators.required//,
        // inputType: 'password'
    })
    mobile = '';

    @BackendMethod({ allowed: true })
    async signUp() {
        const u = this.remult.repo(User).create()
        u.mobile = this.mobile
        u.name = this.user
        return await u.save();
        // throw new Error(terms.invalidSignUp);
    }
}

export function getJwtSecret() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return process.env['JWT_SECRET']!;
    // return "my secret key";
}
