import { Remult } from "remult"
import { User } from "./users/user"

export const GlobalParam = { allowToStart: false }

export async function checkIfUserApprooved(remult?: Remult): Promise<boolean> {
    // console.log('checkIfUserApprooved - 1')
    GlobalParam.allowToStart = false
    if (remult!.user.isShluch || remult!.user.isAvrech) {
        let uid = remult?.user?.id?.trim() ?? ''
        if (uid.length) {
            // console.log('checkIfUserApprooved - 2',uid)
            let u = await remult!.repo(User).findId(uid, { useCache: false })
            if (u?.allowToStart ?? false) {
                // console.log('checkIfUserApprooved - 3')
                GlobalParam.allowToStart = true
            }
            else {
                console.log('checkIfUserApprooved.u.allowToStart', u?.allowToStart)
            }
        }
        else {
            console.log('checkIfUserApprooved.uid.length', uid.length)
        }
    }
    else{
        console.log('checkIfUserApprooved(remult!.user.isShluch || remult!.user.isAvrech) =', remult!.user.isShluch || remult!.user.isAvrech)
        GlobalParam.allowToStart = true
    }
    console.log('checkIfUserApprooved.GlobalParam.allowToStart = ', GlobalParam.allowToStart ?? "NULL")
    return GlobalParam.allowToStart
}
