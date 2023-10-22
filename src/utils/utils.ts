export function hexToText(hex: string | undefined) {
    if (!hex) {
        return;
    }
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.substring(i, i + 2), 16);
        str += String.fromCharCode(byte);
    }
    return str.slice(1);
}