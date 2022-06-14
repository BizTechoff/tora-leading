import { Allow, Entity, Field, IdEntity } from "remult";
import { CourseOrganizer } from "./courseOrganizer";
import { CourseType } from "./courseType";

@Entity('courses', (options, remult) => {
    options.allowApiCrud = Allow.authenticated
})
export class Course extends IdEntity {

    @Field(() => CourseType)
    type!: CourseType

    @Field(() => CourseOrganizer)
    organizer!: CourseOrganizer

}
