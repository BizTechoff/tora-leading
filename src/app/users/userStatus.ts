import { ValueListFieldType } from "remult"

@ValueListFieldType()
export class UserStatus {
    static m_WaitingRegister = new UserStatus('ממתין לאישור הרשמה')
    static m_WaitingRegisterApproved = new UserStatus('ממתינים לאישור המכון / רבנות')
    static m_WaitingSupportApproved = new UserStatus('ממתינים לאישור הצטרפות לתוכנית')
    static c_NotRegistered = new UserStatus('טרם אושרת')
    static m_NotWaitingRegisterApproved = new UserStatus('טרם העלית תעודת הרשמה')
    static m_NotWaitingSupportApproved = new UserStatus('טרם צורפת לתוכנית')
    static mc_Ok = new UserStatus('זכאי לתמיכה')
    constructor(public caption = '') { }
    id!:string
}
