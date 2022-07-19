import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, Validators } from "remult";
import { terms } from "../../terms";
import { User } from "../../users/user";
import { LectureMonth } from "./lectureMonth";

@Entity('lectures', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Lecture extends IdEntity {

    @Field<Lecture, User>(() => User, { caption: 'שליח' })
    shluch!: User

    @DataControl<Lecture, string>({ width: '118' })
    @Fields.string<Lecture>({
        validate: [Validators.required.withMessage(terms.requiredField), Validators.uniqueOnBackend.withMessage(terms.uniqueField)],
        caption: 'שם נושא'
    })
    name = '';

    @DataControl<Lecture, number>({ width: '118' })
    @Fields.integer<Lecture>({
        validate: (row, col) => {
            if (!col || !col.value || col.value <= 0) {
                col.error = 'לפחות 3 חודשים'
            }
        },
        caption: 'מס.חודשים'
    })
    months!: number

    @Fields.object<Lecture>((options, remult) => {
        options.serverExpression = async (l) =>
            await remult.repo(LectureMonth).find({
                where: { lecture: l, shluch: { $id: remult.user.id } },
                load: () => []
            })
    })
    lectures = [] as LectureMonth[]

}
