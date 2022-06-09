import { Allow, BackendMethod, Entity, Fields, IdEntity, isBackend, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from './roles';

@Entity<User>("Users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin
},
    (options, remult) => {
        options.apiPrefilter = () => !remult.user.isAdmin ? { id: remult.user.id } : {};
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                }
            }
        }
    }
)
export class User extends IdEntity {

    @Fields.string({
        validate: [Validators.required],
        caption: terms.username
    })
    name = '';

    @Fields.string({
        caption: 'סלולרי',
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend]
    })
    mobile = ''

    @Fields.string({
        caption: 'טלפון'//,
        // validate: Validators.required.withMessage('שדה חובה')
    })
    phone = ''

    @Fields.string({
        caption: 'אימייל'//,
        // validate: Validators.required.withMessage('שדה חובה')
    })
    email = ''

    @Fields.string({ includeInApi: false })
    password = '';

    @Fields.date({
        allowApiUpdate: false
    })
    createDate = new Date();

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin = false;

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.manager
    })
    manager = false;

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.shluch
    })
    shluch = false;

    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.avrech
    })
    avrech = false;

    async hashAndSetPassword(password: string) {
        this.password = (await import('password-hash')).generate(password);
    }

    async passwordMatches(password: string) {
        return !this.password || (await import('password-hash')).verify(password, this.password);
    }

    @BackendMethod({ allowed: Roles.admin })
    async resetPassword() {
        await this.hashAndSetPassword(process.env['DEFAULT_PASSWORD']!);
        await this.save();
    }

}
