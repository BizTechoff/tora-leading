import { ValueListFieldType } from "remult"

@ValueListFieldType()
export class Months {
    static tishrei = new Months('תשרי')
    static cheshvan = new Months('חשון')
    static kislev = new Months('כסליו')
    static tevet = new Months('טבת')
    static shvat = new Months('שבט')
    static adar = new Months('אדר')
    static adarB = new Months('אדר ב')
    static nissan = new Months('ניסן')
    static iyar = new Months('אייר')
    static sivan = new Months('סיון')
    static tamuz = new Months('תמוז')
    static av = new Months('אב')
    static elul = new Months('אלול')
    constructor(public caption = '') { this.id = caption }
    id!: string
    static getOptions(exclude = [] as Months[]) {
        let options = [] as Months[]
        if (!exclude.includes(Months.tishrei)) {
            options.push(Months.tishrei)
        }
        if (!exclude.includes(Months.cheshvan)) {
            options.push(Months.cheshvan)
        }
        if (!exclude.includes(Months.kislev)) {
            options.push(Months.kislev)
        }
        if (!exclude.includes(Months.tevet)) {
            options.push(Months.tevet)
        }
        if (!exclude.includes(Months.shvat)) {
            options.push(Months.shvat)
        }
        if (!exclude.includes(Months.adar)) {
            options.push(Months.adar)
        }
        if (!exclude.includes(Months.adarB)) {
            options.push(Months.adarB)
        }
        if (!exclude.includes(Months.nissan)) {
            options.push(Months.nissan)
        }
        if (!exclude.includes(Months.iyar)) {
            options.push(Months.iyar)
        }
        if (!exclude.includes(Months.sivan)) {
            options.push(Months.sivan)
        }
        if (!exclude.includes(Months.tamuz)) {
            options.push(Months.tamuz)
        }
        if (!exclude.includes(Months.av)) {
            options.push(Months.av)
        }
        if (!exclude.includes(Months.elul)) {
            options.push(Months.elul)
        }

        return options
    }
}
