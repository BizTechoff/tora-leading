import { ValueListFieldType } from "remult"

@ValueListFieldType({ caption: 'נושאי לימוד' })
export class CourseType {
    static shabat = new CourseType('שבת')
    static isurAndEter = new CourseType('איסור והתר')
    static nida = new CourseType('נידה')
    static hupaAndKidushin = new CourseType('חופה וקידושין')
    static avelut = new CourseType('אבילות')
    static eruvin = new CourseType('עירובין')
    static chosenA = new CourseType('חושן משפט א')
    static chosenB = new CourseType('חושן משפט ב')
    static chosenC = new CourseType('חושן משפט ג')
    static evenAezer = new CourseType('אבן העזר')
    constructor(public caption = '') { }
}
