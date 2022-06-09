import { ValueListFieldType } from "remult"

@ValueListFieldType({ caption: 'מכוני לימוד' })
export class CourseOrganizer {
    static benoini = new CourseOrganizer("מכון 'הבינוני'")
    static lemaanIlmodu = new CourseOrganizer("מכון 'למען ילמדו'")
    static alone = new CourseOrganizer('לימוד עצמאי')
    constructor(public caption = '') { }
}
