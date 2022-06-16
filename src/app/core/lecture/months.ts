import { ValueListFieldType } from "remult"

@ValueListFieldType()
export class Months {
    static nissan = new Months('ניסן')
    static iyar = new Months('אייר')
    static sivan = new Months('סיון')
    static tamuz = new Months('תמוז')
    static av = new Months('אב')
    static elul = new Months('אלול')
    static tishrei = new Months('תשרי')
    static cheshvan = new Months('חשון')
    static kislev = new Months('כסליו')
    static tevet = new Months('טבת')
    static shvat = new Months('שבט')
    static adar = new Months('אדר')
    static adarB = new Months('אדר ב')
    constructor(public caption = '') { }
    id!: string
}
