import { ValueListFieldType } from "remult"

@ValueListFieldType()
export class Years {
    static התשפב = new Years('התשפ"ב')
    static התשפא = new Years('התשפ"א')
    static התשפ = new Years('התש"פ')
    static התשעט = new Years('התשע"ט')
    static התשעח = new Years('התשע"ח')
    static התשעז = new Years('התשע"ז')
    static התשעו = new Years('התשע"ו')
    static התשעה = new Years('התשע"ה')
    static התשעד = new Years('התשע"ד')
    static התשעג = new Years('התשע"ג')
    static התשעב = new Years('התשע"ב')
    static התשעא = new Years('התשע"א')
    static התשע = new Years('התש"ע')
    constructor(public caption = '') { }
    id!: string
}
