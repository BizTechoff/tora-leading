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
    constructor(public caption = '') { this.id = caption }
    static smachot = new CourseType('שמחות')
    static mikvaot = new CourseType('מקוואות')
    static pesachYomtovVeCholamoed = new CourseType('פסח ויו"ט וחוה"מ')
    static rabanimZvaiim = new CourseType('רבנים צבאיים')
    static israelMitzvot = new CourseType('מצוות התלויות בארץ')
    static milaVegerut = new CourseType('מילה וגירות')
    static holidays = new CourseType('חגים')
    static psakDin = new CourseType('ניסוח פסק דין')
    static prayVebrachot = new CourseType('תפילה וברכות')
    static kashrut = new CourseType('השגחת כשרות')
    static sviit = new CourseType('שביעית')
    static shovim = new CourseType('שובי"ם')
    static tfutzot = new CourseType('רבני תפוצות א`+ב`')
    static nisuin = new CourseType('רשם נישואין')
    id!: string
    static getOptions(exclude = [] as CourseType[], allRabanut = false) {
        let options = [] as CourseType[]
        if (!exclude.includes(CourseType.shabat)) {
            options.push(CourseType.shabat)
        }
        if (!exclude.includes(CourseType.isurAndEter)) {
            options.push(CourseType.isurAndEter)
        }
        if (!exclude.includes(CourseType.nida)) {
            options.push(CourseType.nida)
        }
        if (!exclude.includes(CourseType.hupaAndKidushin)) {
            options.push(CourseType.hupaAndKidushin)
        }
        if (!exclude.includes(CourseType.avelut)) {
            options.push(CourseType.avelut)
        }
        if (!exclude.includes(CourseType.eruvin)) {
            options.push(CourseType.eruvin)
        }
        if (!exclude.includes(CourseType.chosenA)) {
            options.push(CourseType.chosenA)
        }
        if (!exclude.includes(CourseType.chosenB)) {
            options.push(CourseType.chosenB)
        }
        if (!exclude.includes(CourseType.chosenC)) {
            options.push(CourseType.chosenC)
        }
        if (!exclude.includes(CourseType.evenAezer)) {
            options.push(CourseType.evenAezer)
        }
        if(allRabanut){
         
        if (!exclude.includes(CourseType.milaVegerut)) {
            options.push(CourseType.milaVegerut)
        }
        if (!exclude.includes(CourseType.prayVebrachot)) {
            options.push(CourseType.prayVebrachot)
        }   
        }

        return options
    }
}
