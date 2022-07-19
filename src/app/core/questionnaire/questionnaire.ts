import { Allow, Entity, Field, Fields, IdEntity, Validators } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";
import { CourseOrganizer } from "../course/courseOrganizer";
import { CourseType } from "../course/courseType";

@Entity('questionnaires', (options, remult) => {
    options.allowApiCrud = Allow.authenticated,
    options.apiPrefilter = () => !remult.user.isAdmin ? { shluch: remult.user.id } : {};
})
export class Questionnaire extends IdEntity {

    @Field(() => User, { caption: 'שליח' })
    shluch!: User

    @Fields.string({
        caption: 'מיקום השליחות',
        validate: Validators.required.withMessage(terms.requiredField)
    })
    missionLocation = ''

    @Fields.dateOnly({
        caption: 'תאריך השליחות'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    missionDate!: Date

    @Fields.boolean<Questionnaire>({
        defaultValue: (row) => true,// BUG
        caption: 'אם בעבר נבחנת במבחני רבנות?'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    firstTime: boolean = true
 
    @Fields.string({
        caption: 'תיק אישי ברבנות'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    caseLink = ''

    @Field(() => CourseType, { caption: 'נושא הלימוד שבחרת ללמוד בתקופה הקרובה' })
    course!: CourseType

    @Field(() => CourseOrganizer, { caption: 'באיזו מסגרת אתה לומד' })
    courseOrganizer!: CourseOrganizer

    @Fields.string({
        caption: 'באם נרשמת ללימוד דרך מכון, צרף אישור הרשמה'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    courseOrganizerLink = ''

    @Fields.string({
        caption: 'מדוע הנך מעונין להצטרף לתכנית תורת השליחות?'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    whyUHere = ''

    @Fields.string({
        caption: 'הערות'//,
        // validate: Validators.required.withMessage(terms.requiredField)
    })
    remarks = ''

}