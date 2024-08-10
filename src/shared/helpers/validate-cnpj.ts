export function validateCnpj(cnpj: string): boolean {
    // Remove any non-numeric characters from the CNPJ
    const cleanedCnpj = cnpj.replace(/[^\d]/g, '')

    // Check if the cleaned CNPJ has 14 digits
    if (cleanedCnpj.length !== 14) {
        return false
    }

    // Check if all digits are the same, which is an invalid CNPJ condition
    if (/^(\d)\1+$/g.test(cleanedCnpj)) {
        return false
    }

    // Validate the CNPJ using the algorithm
    let sum = 0
    let position = 5

    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanedCnpj[i]) * position
        position--

        if (position < 2) {
            position = 9
        }
    }

    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    if (result !== parseInt(cleanedCnpj[12])) {
        return false
    }

    sum = 0
    position = 6

    for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanedCnpj[i]) * position
        position--

        if (position < 2) {
            position = 9
        }
    }

    const secondResult = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    return secondResult === parseInt(cleanedCnpj[13])
}
