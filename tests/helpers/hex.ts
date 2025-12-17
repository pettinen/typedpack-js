export const fromHex = (hex: string): DataView<ArrayBuffer> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new DataView((Uint8Array as any).fromHex(hex.replace(/ /g, "")).buffer);

export const toHex = (data: DataView<ArrayBuffer>) => {
    // TODO: can just use `data.buffer` without transferring once
    // https://issues.chromium.org/issues/452663011 lands in Node.js
    const buffer = data.buffer.transferToFixedLength();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hex = (new Uint8Array(buffer) as any).toHex();
    let hexWithSpaces = "";
    for (let i = 0; i < 2 * buffer.byteLength; i += 2) {
        if (i !== 0) {
            hexWithSpaces += " ";
        }
        hexWithSpaces += hex.substring(i, i + 2);
    }
    return hexWithSpaces;
};
