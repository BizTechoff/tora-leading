import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity } from "remult";
import { User } from "../../users/user";
import { Lecture } from "./lecture";
import { Months } from "./months";

@Entity('lectureMonths', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class LectureMonth extends IdEntity {

    @Field(() => User, { caption: 'שליח' })
    shluch!: User

    @Field(() => Lecture, { caption: 'נושא' })
    lecture!: Lecture

    @DataControl<LectureMonth, Months>({
        width: '88',
        click: (row, col) => { }
    })
    @Field(() => Months, {
        caption: 'חודש',
        validate: (row, col) => {
            if (!col || !col.value) {
                col.error = 'שדה חובה'
            }
        }
    })
    month!: Months

    @DataControl({
        width: '88'
    })
    @Fields.boolean({ caption: 'בוצע' })
    done = false

    @DataControl({
        width: '88'
    })
    @Fields.boolean({ caption: 'שולם' })
    payed = false

    @DataControl({
        width: '88'
    })
    @Fields.string({ caption: 'תעודה' })
    certificate = ''

}
