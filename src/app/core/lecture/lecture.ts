import { DataControl } from "@remult/angular/interfaces";
import { Allow, Entity, Field, Fields, IdEntity, Validators } from "remult";
import { User } from "../../users/user";
import { LectureMonth } from "./lectureMonth";

@Entity('lectures', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Lecture extends IdEntity {

    @Field(() => User, { caption: 'שליח' })
    shluch!: User

    @DataControl<Lecture, string>({ width: '118' })
    @Fields.string({
        validate: [Validators.required.withMessage('שדה חובה'), Validators.uniqueOnBackend.withMessage('קיים')],
        caption: 'שם נושא'
    })
    name = '';

    @DataControl<Lecture, number>({ width: '118' })
    @Fields.integer({
        validate: (row, col) => {
            if (!col || !col.value || col.value <= 0) {
                col.error = 'לפחות 3 חודשים'
            }
        },
        caption: 'מס.חודשים'
    })
    months = 0;

    @Fields.object<Lecture>((options, remult) => {
        options.serverExpression = async (l) =>
            await remult.repo(LectureMonth).find({
                where: { lecture: l, shluch: { $id: remult.user.id } },
                load: () => []
            })
    })
    lectures = [] as LectureMonth[]

}
