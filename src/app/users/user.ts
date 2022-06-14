import { DataControl } from "@remult/angular/interfaces";
import { Allow, BackendMethod, Entity, Fields, IdEntity, isBackend, Validators } from "remult";
import { terms } from "../terms";
import { Roles } from './roles';

@Entity<User>("users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin,
    defaultOrderBy: {
        admin: "desc",
        manager: "desc",
        shluch: "desc",
        avrech: "desc",
        name: "asc"
    }
},
    (options, remult) => {
        options.allowApiCrud = false
        options.apiPrefilter = () => !remult.user.isAdmin ? { id: remult.user.id } : {};
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                    if (!user.password || user.password.trim().length === 0) {
                        await user.hashAndSetPassword(process.env['DEFAULT_PASSWORD']!);
                    }
                }
            }
        }
    }
)
export class User extends IdEntity {

    @DataControl<User, string>({ width: '118' })
    @Fields.string({
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend.withMessage('קיים')],
        caption: terms.username
    })
    name = '';

    @DataControl<User, string>({ width: '98' })
    @Fields.string({
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend.withMessage('קיים')],
        caption: terms.mobile
    })
    mobile = '';

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



    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.manager = false
                row.shluch = false
                row.avrech = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.shluch = false
                row.avrech = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.manager
    })
    manager = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.manager = false
                row.avrech = false
            }
        }
    })
    @Fields.boolean({
        allowApiUpdate: Roles.admin,
        caption: terms.shluch
    })
    shluch = false;

    @DataControl<User, boolean>({
        width: '88',
        valueChange: (row, col) => {
            if (col.value) {
                row.admin = false
                row.manager = false
                row.shluch = false
            }
        }
    })
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
