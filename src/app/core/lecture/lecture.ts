import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, isBackend, Validators } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";
import { CourseOrganizer } from "../course/courseOrganizer";
import { CourseType } from "../course/courseType";
import { Months } from "./months";
import { Years } from "./years";

@Entity<Lecture>('lectures', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
    options.saving = async row => {
        if (isBackend()) {
            if (row.isNew()) {
                row.created = new Date()
            }
        }
    }
})
export class Lecture extends IdEntity {

    @Field<Lecture, User>(() => User, {
        caption: 'שליח',
        validate: (row, col) => [Validators.required.withMessage(terms.requiredField)]
    })
    shluch!: User

    @DataControl<Lecture, CourseType>({ width: '118' })
    @Field<Lecture, CourseType>(() => CourseType, {
        validate: (row, col) => {
            if (!col?.value ?? false) {
                col.error = terms.requiredField
            }
        }, caption: 'שם נושא'
    })
    course!: CourseType;

    @DataControl<Lecture, string>({ width: '118' })
    @Fields.string<Lecture>({
        // validate: (row, col) => {
        //     if (!col?.value ?? false) {
        //         col.error = terms.requiredField
        //     }
        // }, 
        caption: 'קובץ ציונים',
        displayValue: (row, col) => row.$.courseGradesLink.value?.length
            ? col
            : 'לא הועלה'
    })
    courseGradesLink!: string;

    @DataControl<Lecture, CourseOrganizer>({ width: '118' })
    @Field<Lecture, CourseOrganizer>(() => CourseOrganizer,
        {
            validate: (row, col) => {
                if (!col?.value ?? false) {
                    col.error = terms.requiredField
                }
            },
            caption: 'היכן למדת?'
        })
    organizer!: CourseOrganizer;

    @DataControl<Lecture, Years>({ width: '118' })
    @Field<Lecture, Years>(() => Years, {
        validate: (row, col) => {
            if (!col.value ?? false) {
                col.error = terms.requiredField
            }
        },
        caption: 'שנה'
    })
    year!: Years

    @DataControl<Lecture, Months>({ width: '118' })
    @Field<Lecture, Months>(() => Months, {
        validate: (row, col) => {
            if (!col.value ?? false) {
                col.error = terms.requiredField
            }
        },
        caption: 'חודש'
    })
    month!: Months

    @Fields.date({ caption: 'נוצר ב' })
    created!: Date

    // @Field<Lecture,LectureMonth[]>(() => LectureMonth,(options, remult) => {
    //     options.serverExpression = async (l) =>
    //         await remult.repo(LectureMonth).find({
    //             where: { lecture: l, shluch: l.shluch },
    //             load: () => []
    //         })
    // })
    // lectures = [] as LectureMonth[]

}
