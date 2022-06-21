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
    @Fields.string<User>({
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend.withMessage('קיים')],
        caption: terms.username
    })
    name = '';

    @DataControl<User, string>({ width: '118' })
    @Fields.string({
        validate: (row, col) => {
            if (row.shluch) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = 'שדה חובה'
                }
            }
        },
        caption: 'שם משפחה'
    })
    fname = ''

    @DataControl<User, string>({ width: '98' })
    @Fields.string({
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend.withMessage('קיים')],
        caption: terms.mobile
    })
    mobile = ''

    @Fields.string({
        caption: 'טלפון'//,
        // validate: Validators.required.withMessage('שדה חובה')
    })
    phone = ''

    @Fields.string<User>({
        caption: 'אימייל',
        validate: (row, col) => {
            if (row.shluch) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = 'שדה חובה'
                }
                else {
                    let v = col.value.trim().toLowerCase()
                    if (!v.includes('@')) {
                        col.error = 'פורמט שגוי'
                    }
                    else {
                        let split = v.split('@')
                        if (split[0].length < 3) {
                            col.error = 'לפחות 3 תווים בהתחלה'
                        }
                        else if (!split[1].includes('.')) {
                            col.error = 'פורמט שגוי'
                        }
                    }
                }
            }
        }
    })
    email = ''

    @Fields.dateOnly({
        caption: 'תאריך נישואין',
        validate: (row, col) => {
            if (row.shluch) {
                if (!col || !col.value || col.value.getFullYear() <= 1900) {
                    col.error = 'שדה חובה'
                }
            }
        }
    })
    marriageDate!: Date

    @Fields.string({
        caption: 'מיקום השליחות',
        validate: (row, col) => {
            if (row.shluch) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = 'שדה חובה'
                }
            }
        }
    })
    missionLocation = ''

    @Fields.dateOnly({
        caption: 'תאריך יציאה לשליחות',
        validate: (row, col) => {
            if (row.shluch) {
                if (!col || !col.value || col.value.getFullYear() <= 1900) {
                    col.error = 'שדה חובה'
                }
            }
        }
    })
    missionDate!: Date

    @Fields.string({ includeInApi: false })
    password = '';

    @Fields.string({ caption: 'הערות' })
    remarks = '';

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
