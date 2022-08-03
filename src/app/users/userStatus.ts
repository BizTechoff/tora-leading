import { ValueListFieldType } from "remult"

@ValueListFieldType()
export class UserStatus {
    static m_WaitingRegister = new UserStatus('ממתין לאישור הרשמה')
    static m_WaitingRegisterApproved = new UserStatus('ממתין לאישור המכון / רבנות')
    static m_WaitingSupportApproved = new UserStatus('ממתין לאישור הצטרפות לתוכנית')
    static m_NotWaitingRegisterApproved = new UserStatus('טרם העלית תעודת הרשמה')
    static m_NotWaitingSupportApproved = new UserStatus('טרם צורפת לתוכנית')
    static mc_Ok = new UserStatus('זכאי לתמיכה')
    static mc_Reject = new UserStatus('נדחה')
    constructor(public caption = '') { }
    id!: string
}
