import { ValueListFieldType } from "remult"

@ValueListFieldType({ caption: 'מכוני לימוד' })
export class CourseOrganizer {
    static benoini = new CourseOrganizer('הבינוני', "מכון 'הבינוני'")
    static lemaanIlmodu = new CourseOrganizer('למען ילמדו', "מכון 'למען ילמדו'")
    static alone = new CourseOrganizer('עצמאי', 'לימוד עצמאי')
    constructor(public id = '', public caption = '') { }
}
