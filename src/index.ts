const textDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
const textEncoder = new TextEncoder();

/**
 * Encodes a MessagePack array header.
 *
 * @invariants
 * - Argument `length` must be a non-negative integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param length - The length of the array.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the header is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if argument `length` is not an unsigned 32-bit integer.
 * @throws {RangeError} Thrown if data would be written beyond the end of the `DataView`.
 */
export const encodeArrayHeader = (
    length: number,
    data: DataView,
    offset: number,
): 1 | 3 | 5 => {
    if (length >= 4_294_967_296) {
        throw new RangeError("invalid array length");
    }
    if (length < 16) {
        data.setUint8(offset, 0x90 | length);
        return 1;
    }
    if (length < 65_536) {
        data.setUint8(offset, 0xdc);
        data.setUint16(offset + 1, length);
        return 3;
    }
    data.setUint8(offset, 0xdd);
    data.setUint32(offset + 1, length);
    return 5;
};

const arrayOrMapHeaderLength = (length: number): 1 | 3 | 5 => {
    if (length >= 4_294_967_296) {
        throw new RangeError("invalid length");
    }
    if (length < 16) {
        return 1;
    }
    if (length < 65_536) {
        return 3;
    }
    return 5;
};

/**
 * Calculates the length (in bytes) of the header for a MessagePack array of a given length.
 *
 * @invariant Argument `length` must be a non-negative integer.
 *
 * @param length - The length of the array.
 * @returns The array header length.
 * @throws {RangeError} Thrown if argument `length` would not fit in an unsigned 32-bit integer.
 */
export const arrayHeaderLength = (length: number): 1 | 3 | 5 =>
    arrayOrMapHeaderLength(length);

/**
 * Encodes a MessagePack boolean.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param value - The boolean value to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if data would be written beyond the end of the `DataView`.
 */
export const encodeBoolean = (
    value: boolean,
    data: DataView,
    offset: number,
): 1 => {
    data.setUint8(offset, value ? 0xc3 : 0xc2);
    return 1;
};

/**
 * Encodes a MessagePack map header.
 *
 * @invariants
 * - Argument `length` must be a non-negative integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param length - The length of the map.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the header is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if argument `length` would not fit in an unsigned 32-bit integer.
 * @throws {RangeError} Thrown if data would be written beyond the end of the `DataView`.
 */
export const encodeMapHeader = (
    length: number,
    data: DataView,
    offset: number,
): number => {
    if (length >= 4_294_967_296) {
        throw new RangeError("invalid map length");
    }
    if (length < 16) {
        data.setUint8(offset, 0x80 | length);
        return 1;
    }
    if (length < 65_536) {
        data.setUint8(offset, 0xde);
        data.setUint16(offset + 1, length);
        return 3;
    }
    data.setUint8(offset, 0xdf);
    data.setUint32(offset + 1, length);
    return 5;
};

/**
 * Calculates the length (in bytes) of the header for a MessagePack map of a given length.
 *
 * @invariant Argument `length` must be a non-negative integer.
 *
 * @param length - The length of the map.
 * @returns The map header length.
 * @throws {RangeError} Thrown if argument `length` would not fit in an unsigned 32-bit integer.
 */
export const mapHeaderLength = (length: number): 1 | 3 | 5 =>
    arrayOrMapHeaderLength(length);

/**
 * Encodes a MessagePack string.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param value - The string to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the string is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the string, encoded as UTF-8, would be written
 *     beyond the end of the `DataView`.
 * @throws {RangeError} Thrown if the UTF-8 encoded byte length would
 *     not fit in a 32-bit unsigned integer.
 * @throws {RangeError} Thrown if argument `offset` is not a non-negative safe integer.
 */
export const encodeString = (
    value: string,
    data: DataView,
    offset: number,
): number => {
    if (value.length === 0) {
        data.setUint8(offset, 0xa0);
        return 1;
    }
    if (value.length < 8) {
        // must be a 1-byte header
        const { read, written } = textEncoder.encodeInto(
            value,
            new Uint8Array(data.buffer).subarray(offset + 1),
        );
        if (read !== value.length) {
            throw new RangeError("not enough space in buffer");
        }

        data.setUint8(offset, 0xa0 | written);
        return written + 1;
    }
    if (value.length >= 65_536) {
        // must be a 5-byte header
        const { read, written } = textEncoder.encodeInto(
            value,
            new Uint8Array(data.buffer).subarray(offset + 5),
        );
        if (read !== value.length) {
            throw new RangeError("not enough space in buffer");
        }
        if (written >= 4_294_967_296) {
            throw new RangeError("string is too long");
        }
        data.setUint8(offset, 0xdb);
        data.setUint32(offset + 1, written);
        return written + 5;
    }

    const encoded = textEncoder.encode(value);
    if (encoded.byteLength >= 4_294_967_296) {
        throw new RangeError("string is too long");
    }
    if (encoded.byteLength >= 65_536) {
        data.setUint8(offset, 0xdb);
        data.setUint32(offset + 1, encoded.byteLength);
        new Uint8Array(data.buffer).set(encoded, offset + 5);
        return encoded.byteLength + 5;
    }
    if (encoded.byteLength >= 256) {
        data.setUint8(offset, 0xda);
        data.setUint16(offset + 1, encoded.byteLength);
        new Uint8Array(data.buffer).set(encoded, offset + 3);
        return encoded.byteLength + 3;
    }
    if (encoded.byteLength >= 32) {
        data.setUint8(offset, 0xd9);
        data.setUint8(offset + 1, encoded.byteLength);
        new Uint8Array(data.buffer).set(encoded, offset + 2);
        return encoded.byteLength + 2;
    }
    data.setUint8(offset, 0xa0 | encoded.byteLength);
    new Uint8Array(data.buffer).set(encoded, offset + 1);
    return encoded.byteLength + 1;
};

/**
 * Calculates the length (in bytes) of the header for a MessagePack string
 * of a given encoded length.
 *
 * @invariant Argument `length` must be a non-negative integer.
 *
 * @param length - The length of the UTF-8 encoding of the string in bytes.
 * @returns The string header length.
 * @throws {RangeError} Thrown if argument `length` is not an unsigned 32-bit integer.
 */
export const stringHeaderLength = (length: number): 1 | 2 | 3 | 5 => {
    if (length < 32) {
        return 1;
    }
    if (length < 256) {
        return 2;
    }
    if (length < 65_536) {
        return 3;
    }
    if (length < 4_294_967_296) {
        return 5;
    }
    throw new RangeError("invalid string length");
};

/**
 * Encodes a MessagePack byte array.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param value - The byte array to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the byte array is written.
 * @param expectedLength - The expected byte length of argument `value`.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the byte array would be written beyond the end of the `DataView`.
 * @throws {RangeError} Thrown if the byte array length would not fit in a 32-bit unsigned integer.
 * @throws {RangeError} Thrown if argument `expectedLength` is not null
 *     and does not equal the byte length of argument `value`.
 */
export const encodeBytes = (
    value: ArrayBuffer,
    data: DataView,
    offset: number,
    expectedLength: number | null = null,
): number => {
    if (expectedLength !== null && value.byteLength !== expectedLength) {
        throw new RangeError(
            `invalid bytes length: expected ${expectedLength}, got ${value.byteLength}`,
        );
    }
    if (value.byteLength < 256) {
        data.setUint8(offset, 0xc4);
        data.setUint8(offset + 1, value.byteLength);
        new Uint8Array(data.buffer).set(new Uint8Array(value), offset + 2);
        return value.byteLength + 2;
    }
    if (value.byteLength < 65_536) {
        data.setUint8(offset, 0xc5);
        data.setUint16(offset + 1, value.byteLength);
        new Uint8Array(data.buffer).set(new Uint8Array(value), offset + 3);
        return value.byteLength + 3;
    }
    if (value.byteLength < 4_294_967_296) {
        data.setUint8(offset, 0xc6);
        data.setUint32(offset + 1, value.byteLength);
        new Uint8Array(data.buffer).set(new Uint8Array(value), offset + 5);
        return value.byteLength + 5;
    }
    throw new Error("binary data is too long");
};

/**
 * Calculates the length (in bytes) of the header for a MessagePack byte array of a given length.
 *
 * @param length - The length of the byte array.
 * @returns The byte array header length.
 * @throws {RangeError} Thrown if argument `length` is not an unsigned 32-bit integer.
 */
export const bytesHeaderLength = (length: number): 2 | 3 | 5 => {
    if (length < 256) {
        return 2;
    }
    if (length < 65_536) {
        return 3;
    }
    if (length < 4_294_967_296) {
        return 5;
    }
    throw new RangeError("invalid byte array length");
};

/**
 * Encodes a MessagePack unsigned 8-, 16-, or 32-bit integer.
 *
 * The value is encoded in the smallest unsigned integer format that it can fit into.
 *
 * @invariants
 * - Argument `value` must be an unsigned 32-bit integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param value - The integer to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeUint = (
    value: number,
    data: DataView,
    offset: number,
): 1 | 2 | 3 | 5 => {
    if (value < 128) {
        data.setUint8(offset, value);
        return 1;
    }
    if (value < 256) {
        data.setUint8(offset, 0xcc);
        data.setUint8(offset + 1, value);
        return 2;
    }
    if (value < 65_536) {
        data.setUint8(offset, 0xcd);
        data.setUint16(offset + 1, value);
        return 3;
    }
    data.setUint8(offset, 0xce);
    data.setUint32(offset + 1, value);
    return 5;
};

/**
 * Encodes a MessagePack unsigned 64-bit integer.
 *
 * The value is encoded in the smallest unsigned integer format that it can fit into.
 *
 * @invariants
 * - Argument `value` must be an unsigned 64-bit integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param value - The integer to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeUint64 = (
    value: bigint,
    data: DataView,
    offset: number,
): 1 | 2 | 3 | 5 | 9 => {
    if (value < 4_294_967_296n) {
        return encodeUint(Number(value), data, offset);
    }
    data.setUint8(offset, 0xcf);
    data.setBigUint64(offset + 1, value);
    return 9;
};

/**
 * Encodes a MessagePack signed 8-, 16-, or 32-bit integer.
 *
 * A non-negative value is encoded in the smallest unsigned integer format that it can fit into.
 * A negative value is encoded in the smallest signed integer format that it can fit into.
 *
 * @invariant
 * - Argument `value` must be a signed 32-bit integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param value - The integer to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeInt = (
    value: number,
    data: DataView,
    offset: number,
): 1 | 2 | 3 | 5 => {
    if (value >= 0) {
        return encodeUint(value, data, offset);
    }
    if (value >= -32) {
        data.setInt8(offset, value);
        return 1;
    }
    if (value >= -128) {
        data.setUint8(offset, 0xd0);
        data.setInt8(offset + 1, value);
        return 2;
    }
    if (value >= -32_768) {
        data.setUint8(offset, 0xd1);
        data.setInt16(offset + 1, value);
        return 3;
    }
    data.setUint8(offset, 0xd2);
    data.setInt32(offset + 1, value);
    return 5;
};

/**
 * Encodes a MessagePack signed 64-bit integer.
 *
 * A non-negative value that can fit in a 32-bit unsigned integer is encoded
 * in the smallest unsigned integer format that it can fit into.
 * A negative value that can fit in a 32-bit signed integer is encoded
 * in the smallest signed integer format that it can fit into.
 * Other values are encoded in the signed 64-bit integer format.
 *
 * @invariants
 * - Argument `value` must be a signed 64-bit integer.
 * - Argument `offset` must be a non-negative integer.
 *
 * @param value - The integer to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeInt64 = (
    value: bigint,
    data: DataView,
    offset: number,
): 1 | 2 | 3 | 5 | 9 => {
    if (value >= -2_147_483_648n && value < 4_294_967_296n) {
        return encodeInt(Number(value), data, offset);
    }
    data.setUint8(offset, 0xd3);
    data.setBigInt64(offset + 1, value);
    return 9;
};

/**
 * Encodes a MessagePack 32-bit float.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param value - The value to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeFloat32 = (
    value: number,
    data: DataView,
    offset: number,
): 5 => {
    data.setUint8(offset, 0xca);
    data.setFloat32(offset + 1, value);
    return 5;
};

/**
 * Encodes a MessagePack 64-bit float.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param value - The value to encode.
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeFloat64 = (
    value: number,
    data: DataView,
    offset: number,
): 9 => {
    data.setUint8(offset, 0xcb);
    data.setFloat64(offset + 1, value);
    return 9;
};

/**
 * Encodes a MessagePack `nil` value.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to write into.
 * @param offset - The offset to argument `data` at which the value is written.
 * @returns The number of bytes written.
 * @throws {RangeError} Thrown if the value would be written beyond the end of the `DataView`.
 */
export const encodeNull = (data: DataView, offset: number): 1 => {
    data.setUint8(offset, 0xc0);
    return 1;
};

/**
 * Decodes the array length from a MessagePack array header.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` at which the array header starts.
 * @returns A tuple containing the array length and the first offset after the array header.
 * @throws {RangeError} Thrown if argument `data` does not contain a valid array header
 *     at argument `offset`.
 */
export const decodeArrayLength = (
    data: DataView,
    offset: number,
): [number, number] => {
    const byte = data.getUint8(offset);
    if ((byte & 0xf0) === 0x90) {
        return [byte & 0x0f, offset + 1];
    }
    if (byte === 0xdc) {
        return [data.getUint16(offset + 1), offset + 3];
    }
    if (byte === 0xdd) {
        return [data.getUint32(offset + 1), offset + 5];
    }
    throw new Error("not an array");
};

/**
 * Decodes the map length from a MessagePack map header.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` at which the map header starts.
 * @returns A tuple containing the map length and the first offset after the map header.
 * @throws {RangeError} Thrown if argument `data` does not contain a valid map header
 *     at argument `offset`.
 */
export const decodeMapLength = (
    data: DataView,
    offset: number,
): [number, number] => {
    const byte = data.getUint8(offset);
    if ((byte & 0xf0) === 0x80) {
        return [byte & 0x0f, offset + 1];
    }
    if (byte === 0xde) {
        return [data.getUint16(offset + 1), offset + 3];
    }
    if (byte === 0xdf) {
        return [data.getUint32(offset + 1), offset + 5];
    }
    throw new Error("not a map");
};

/**
 * Decodes a 7-bit unsigned integer.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns The 7-bit unsigned integer read from argument `data`.
 * @throws {RangeError} Thrown if argument `data` does not contain a 7-bit unsigned integer
 *     at argument `offset`.
 */
export const decodeMapKey = (data: DataView, offset: number): number => {
    const byte = data.getUint8(offset);
    if (byte >= 128) {
        throw new RangeError("invalid map key");
    }
    return byte;
};

/**
 * Decodes a MessagePack string.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded string and the first offset after the string.
 * @throws {RangeError} Thrown if argument `data` does not contain a valid string header
 *     at argument `offset`, or if argument `data` would end before the length in the header.
 * @throws {TypeError} Thrown if the string cannot be decoded as UTF-8.
 */
export const decodeString = (
    data: DataView,
    offset: number,
): [string, number] => {
    const byte = data.getUint8(offset);
    let length: number;
    let headerLength: number;
    if ((byte & 0xe0) === 0xa0) {
        length = byte & 0x1f;
        headerLength = 1;
    } else if (byte === 0xd9) {
        length = data.getUint8(offset + 1);
        headerLength = 2;
    } else if (byte === 0xda) {
        length = data.getUint16(offset + 1);
        headerLength = 3;
    } else if (byte === 0xdb) {
        length = data.getUint32(offset + 1);
        headerLength = 5;
    } else {
        throw new RangeError("not a string");
    }
    const start = offset + headerLength;
    const end = start + length;
    if (end > data.byteLength) {
        throw new RangeError("string length exceeds buffer length");
    }
    return [
        textDecoder.decode(new Uint8Array(data.buffer).subarray(start, end)),
        end,
    ];
};

/**
 * Decodes a MessagePack byte array.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @param expectedLength - The expected length of the byte array.
 * @returns A tuple containing the byte array and the first offset after the byte array.
 * @throws {RangeError} Thrown if argument `data` does not contain a valid byte array header
 *     at argument `offset`, or if argument `data` would end before the length in the header.
 * @throws {RangeError} Thrown if argument `expectedLength` is not null
 *     and does not equal the length of the read byte array.
 */
export const decodeBytes = (
    data: DataView,
    offset: number,
    expectedLength: number | null = null,
): [ArrayBuffer, number] => {
    const byte = data.getUint8(offset);
    let length: number;
    let headerLength: number;
    if (byte === 0xc4) {
        length = data.getUint8(offset + 1);
        headerLength = 2;
    } else if (byte === 0xc5) {
        length = data.getUint16(offset + 1);
        headerLength = 3;
    } else if (byte === 0xc6) {
        length = data.getUint32(offset + 1);
        headerLength = 5;
    } else {
        throw new Error("not a byte array");
    }
    if (expectedLength !== null && length !== expectedLength) {
        throw new RangeError(
            `invalid byte array length: expected ${expectedLength}, got ${length}`,
        );
    }
    const start = offset + headerLength;
    const end = start + length;
    if (end > data.byteLength) {
        throw new RangeError("byte array length exceeds buffer length");
    }
    const copy = new Uint8Array(new ArrayBuffer(end - start));
    copy.set(new Uint8Array(data.buffer.slice(start, end)));
    return [copy.buffer, end];
};

/**
 * Decodes a MessagePack 8-, 16-, or 32-bit integer.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded value and the first offset after the value.
 * @throws {RangeError} Thrown if argument `data` does not contain a 8-, 16-, or 32-bit integer
 *     at argument `offset`.
 */
export const decodeInt = (data: DataView, offset: number): [number, number] => {
    const byte = data.getUint8(offset);
    if (byte < 128) {
        return [byte, offset + 1];
    }
    if ((byte & 0xe0) === 0xe0) {
        return [data.getInt8(offset), offset + 1];
    }
    if (byte === 0xcc) {
        return [data.getUint8(offset + 1), offset + 2];
    }
    if (byte === 0xcd) {
        return [data.getUint16(offset + 1), offset + 3];
    }
    if (byte === 0xce) {
        return [data.getUint32(offset + 1), offset + 5];
    }
    if (byte === 0xd0) {
        return [data.getInt8(offset + 1), offset + 2];
    }
    if (byte === 0xd1) {
        return [data.getInt16(offset + 1), offset + 3];
    }
    if (byte === 0xd2) {
        return [data.getInt32(offset + 1), offset + 5];
    }
    throw new RangeError("not a 8-, 16- or 32-bit integer");
};

/**
 * Decodes a MessagePack 64-bit integer.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded value and the first offset after the value.
 * @throws {RangeError} Thrown if argument `data` does not contain a 64-bit integer
 *     at argument `offset`.
 */
export const decodeInt64 = (
    data: DataView,
    offset: number,
): [bigint, number] => {
    try {
        // try smaller than 64-bit first
        const [value, newOffset] = decodeInt(data, offset);
        return [BigInt(value), newOffset];
    } catch {
        // decode a 64-bit integer then
    }
    const byte = data.getUint8(offset);
    if (byte === 0xcf) {
        return [data.getBigUint64(offset + 1), offset + 9];
    }
    if (byte == 0xd3) {
        return [data.getBigInt64(offset + 1), offset + 9];
    }
    throw new RangeError("not a 64-bit integer");
};

/**
 * Decodes a MessagePack 32-bit float.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded value and the first offset after the value.
 * @throws {RangeError} Thrown if argument `data` does not contain a 32-bit float
 *     at argument `offset`.
 */
export const decodeFloat32 = (
    data: DataView,
    offset: number,
): [number, number] => {
    if (data.getUint8(offset) !== 0xca) {
        throw new RangeError("not a 32-bit float");
    }
    return [data.getFloat32(offset + 1), offset + 5];
};

/**
 * Decodes a MessagePack 64-bit float.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded value and the first offset after the value.
 * @throws {RangeError} Thrown if argument `data` does not contain a 64-bit float
 *     at argument `offset`.
 */
export const decodeFloat64 = (
    data: DataView,
    offset: number,
): [number, number] => {
    if (data.getUint8(offset) !== 0xcb) {
        throw new RangeError("not a 64-bit float");
    }
    return [data.getFloat64(offset + 1), offset + 9];
};

/**
 * Decodes a MessagePack boolean.
 *
 * @invariant Argument `offset` must be a non-negative integer.
 *
 * @param data - The `DataView` to read from.
 * @param offset - The offset to argument `data` to read from.
 * @returns A tuple containing the decoded value and the first offset after the value.
 * @throws {RangeError} Thrown if argument `data` does not contain a boolean at argument `offset`.
 */
export const decodeBoolean = (
    data: DataView,
    offset: number,
): [boolean, number] => {
    const byte = data.getUint8(offset);
    if (byte === 0xc2) {
        return [false, offset + 1];
    }
    if (byte === 0xc3) {
        return [true, offset + 1];
    }
    throw new RangeError("not a boolean");
};
