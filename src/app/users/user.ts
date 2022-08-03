import { DataControl } from "@remult/angular/interfaces";
import { Allow, BackendMethod, Entity, Field, Fields, IdEntity, isBackend, Validators } from "remult";
import { mobileFromDb, mobileToDb } from "../common/utils";
import { terms } from "../terms";
import { Roles } from './roles';
import { UserStatus } from "./userStatus";

@Entity<User>("users",
    (options, remult) => {
        options.allowApiRead = Allow.authenticated
        options.allowApiUpdate = Allow.authenticated
        options.allowApiDelete = Roles.admin
        options.allowApiInsert = true // ifAllowRegistering // [Roles.admin, Roles.manager]
        options.defaultOrderBy = {
            admin: "desc",
            manager: "desc",
            shluch: "desc",
            avrech: "desc",
            name: "asc"
        }
        options.backendPrefilter = () => // if removing this line? '()=>', call only once? every refresh?
            remult.user.isAdmin
                ? {}
                : remult.user.isManager
                    ? { $or: [{ id: remult.user.id }, { shluch: true }, { avrech: true }] }
                    : { id: remult.user.id }// need id$ ? whats diff ?
        options.saving = async (user) => {
            if (isBackend()) {
                console.log('remult.user.roles.length', remult.user.roles.length)
                if (!(user.admin || user.manager || user.shluch || user.avrech)) {
                    user.$.shluch.error = terms.UserRoleNOTSET
                    user.$.admin.error = terms.UserRoleNOTSET
                    user.$.manager.error = terms.UserRoleNOTSET
                    user.$.avrech.error = terms.UserRoleNOTSET
                }
                else if (user._.isNew()) {
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

    @Field<User>(() => UserStatus, { caption: 'סטטוס' })
    status!: UserStatus

    @DataControl<User, string>({ width: '118' })
    @Fields.string<User>({
        validate: [Validators.required.withMessage(terms.requiredField), Validators.uniqueOnBackend.withMessage(terms.uniqueField)],
        caption: terms.username
    })
    name = '';

    @DataControl<User, string>({ width: '118' })
    @Fields.string<User>((options, remult) => {
        options.validate = (row, col) => {
            if ((row.shluch || row.avrech) && !remult.user.isAdmin) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = terms.requiredField
                }
            }
        }
        options.caption = 'שם משפחה'
    })
    fname = ''

    @DataControl<User, string>({ width: '108' })
    @Fields.string<User>((options, remult) => {
        options.validate = [Validators.required.withMessage(terms.requiredField), Validators.uniqueOnBackend.withMessage('קיים')]
        options.caption = terms.mobile
        options.valueConverter = {
            fromDb: col => mobileFromDb(mobileToDb(col) as string),
            toDb: col => mobileToDb(col) as string
        }
    })
    mobile = ''

    @Fields.string<User>((options, remult) => {
        options.caption = 'טלפון'
        // validate = Validators.required.withMessage(terms.requiredField)
    })
    phone = ''

    @Fields.string<User>((options, remult) => {
        options.caption = 'אימייל'
        options.validate = (row, col) => {
            if ((row.shluch || row.avrech) && !remult.user.isAdmin) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = terms.requiredField
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

    @Fields.dateOnly<User>((options, remult) => {
        // options.allowApiUpdate = Roles.admin || Roles.manager || Roles.shluch
        options.caption = 'תאריך נישואין'
        options.validate = (row, col) => {
            // if (isBackend()) {
            console.log('marriageDate.value', col.value)
            console.log('marriageDate.value.year', col.value?.getFullYear() ?? 'NULL')
            // }
            // console.log(row,col)
            if (row.shluch && !remult.user.isAdmin) {
                let minYear = new Date().getFullYear() - 120 + 18/*marry*///=102=2022-102=1920
                console.log(2, 'marriageDate.year', row?.$.marriageDate?.value?.getFullYear() ?? 'NULL')
                if (row.$.marriageDate?.value?.getFullYear() >= minYear) {
                }
                else {
                    row.$.marriageDate.error = terms.requiredField
                }
            }
        }
    })
    marriageDate!: Date

    @Fields.string<User>((options, remult) => {
        // options.allowApiUpdate = Roles.admin || Roles.manager || Roles.shluch
        options.caption = 'מיקום השליחות'
        options.validate = (row, col) => {
            if (row.shluch && !remult.user.isAdmin) {
                if (row.missionLocation?.trim().length > 0) {
                }
                else {
                    col.error = terms.requiredField
                }
            }
        }
    })
    missionLocation = ''

    @Fields.dateOnly<User>((options, remult) => {
        // options.allowApiUpdate = Roles.admin || Roles.manager || Roles.shluch
        options.caption = 'תאריך יציאה לשליחות'
        options.validate = (row, col) => {
            // if (isBackend()) {
            console.log('missionDate.value', col.value)
            console.log('missionDate.value.year', col.value?.getFullYear() ?? 'NULL')
            // }
            // console.log(row,col)
            if (row.shluch && !remult.user.isAdmin) {
                let minYear = new Date().getFullYear() - 120 + 18/*marry*///=102=2022-102=1920
                console.log(2, 'missionDate.year', row?.$.missionDate?.value?.getFullYear() ?? 'NULL')
                if (row.$.missionDate?.value?.getFullYear() >= minYear) {
                }
                else {
                    row.$.missionDate.error = terms.requiredField
                }
            }
        }
    })
    missionDate!: Date

    @DataControl<User, string>({ width: '118' })
    @Fields.string<User>((options, remult) => {
        options.allowApiUpdate = Roles.admin || Roles.manager || Roles.avrech
        options.caption = 'שם ישיבה'
        options.validate = (row, col) => {
            if (row.avrech && !remult.user.isAdmin) {
                if (!col || !col.value || col.value.trim().length === 0) {
                    col.error = terms.requiredField
                }
            }
        }
    })
    yeshiva = ''

    @Fields.string<User>({ includeInApi: false })
    password = '';

    @Fields.string<User>({ caption: 'הערות' })
    remarks = '';

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
    @Fields.boolean<User>({
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
    @Fields.boolean<User>({
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
    @Fields.boolean<User>({
        // allowApiUpdate: [Roles.admin, Roles.manager],
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
    @Fields.boolean<User>({
        allowApiUpdate: [Roles.admin, Roles.manager],
        caption: terms.avrech
    })
    avrech = false;

    @Fields.date<User>({
        allowApiUpdate: false
    })
    createDate = new Date();

    @DataControl<User, boolean>({
        width: '88'
    })
    @Fields.boolean<User>({
        // allowApiUpdate: false
        allowApiUpdate: [Roles.admin, Roles.manager],
        caption: 'מאושר להתחיל'
    })
    allowToStart = false

    @DataControl<User, Date>({
        width: '88'
    })
    @Fields.date<User>({
        // allowApiUpdate: false
        allowApiUpdate: [Roles.admin, Roles.manager],
        caption: 'התחיל ב'
    })
    started = new Date();

    @DataControl<User, boolean>({
        width: '88'
    })
    @Fields.boolean<User>({
        allowApiUpdate: [Roles.admin, Roles.manager],
        caption: 'מאושר לתוכנית'
    })
    approved = false;// add when(date)

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
