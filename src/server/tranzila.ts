
//http://doctr6.interspace.net/

export const Pay = async (bankAccount = '') => {

    const creds = {
        id: process.env['TRANZILA_ID'],
        masof: process.env['TRANZILA_MASOF'],
        account: process.env['TRANZILA_ACCOUNT']
    }
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi'

    const url_1_1 = 'https://secure5.tranzila.com/cgi-bin/tranzila71pme.cgi'
    const url_1_2 = '<FORM Action="https://secure5.tranzila.com/cgi-bin/tranzila71pme.cgi" method=POST>'
    const url_1_3 = `<Input type="hidden"  name="supplier"  value="${creds.masof}">`
    const url_1_4 = 'https://secure5.tranzila.com/cgi-bin/tranzila71pme.cgi'

    let res = await fetch(url, {
        method: "POST",
        body: bankAccount
    })
    if (res.ok) {

    }
    else {
        console.error(res.statusText)
    }

}

const iframe = () => {
    const url = 'https://direct.tranzila.com/USERNAME/iframenew.php'
}

const masav = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&sum=1&currency=1&bank=10&branch=123&account=11111&tranmode=T'
}
const ip = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/remote.cgi?terminal=test&sum=1¤cy=1'
}

const applePay = () => {
    const url = 'https://www.paymentwebsite.com/.well-known/apple-developer-merchantid-domain-association'
    // const script = '<script>document.write('<script src="https://direct.tranzila.com/js/tranzilanapple_v2.js?v=' + Date.now() + '"><\/script>');</script>'
}

const regular = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&tranmode=A&ccno=12312312&expdate=0917&sum=15&currency=1&cred_type=1&myid=123456789&mycvv=123'
}

const zikui = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&CreditPass=test&tranmode=C1497&authnr=0000000&ccno=12312312&expdate=0917&sum=15&currency=1&cred_type=1&myid=123456789&mycvv=123'
}

const tashlumim = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=naamatest&tranmode=A&ccno=12312312&expdate=0917&sum=50&currency=1&cred_type=8&myid=123456789&mycvv=123&npay=4&fpay=10&spay=10'
}

const cancel = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&CreditPass=test&tranmode=D1499&authnr=0000000'
}

const getPayments = (start: Date, end: Date) => {
    const url = 'https://secure5.tranzila.com/cgi-bin/billing/tranzila_dates.cgi?terminal=שם מסוף בטרנזילה&passw=סיסמא טרנזילה&Fdate=מתאריך&Tdate=עד תאריך'
}

const bit = () => {
    const url = 'https://preprod.paymeservice.com/sale/generate/SALE1616-4195312C-TUGZGDPS-27PXPYXE'
}

const token = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&TranzilaPW=test&ccno=12312312&TranzilaTK=1'
}

const payWithToken = () => {
    const url = 'https://secure5.tranzila.com/cgi-bin/tranzila71u.cgi?supplier=test&TranzilaPW=test&TranzilaTK=e29f9ac5b2b3cce2312&expdate=0917&sum=15¤cy=1&cred_type=1'
}
