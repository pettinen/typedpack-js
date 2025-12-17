import test from "ava";

import {
    Encode,
    EncodeArray,
    DecodeArray,
    TypedpackDecodeInternal,
    Types,
} from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode array of boolean", (t) => {
    t.is(toHex(Encode.TestArrayOfBoolean({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfBoolean({ x: [false] })), "81 00 91 c2");
    t.is(
        toHex(Encode.TestArrayOfBoolean({ x: [true, true] })),
        "81 00 92 c3 c3",
    );
});

test("decode array of boolean", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBoolean(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBoolean(fromHex("81 00 91 c2")),
        [{ x: [false] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBoolean(fromHex("81 00 92 c3 c3")),
        [{ x: [true, true] }, 5],
    );
});

test("encode array of uint8", (t) => {
    t.is(toHex(Encode.TestArrayOfUint8({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfUint8({ x: [0] })), "81 00 91 00");
    t.is(toHex(Encode.TestArrayOfUint8({ x: [255, 0] })), "81 00 92 cc ff 00");
});

test("decode array of uint8", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfUint8(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint8(fromHex("81 00 91 00")),
        [{ x: [0] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint8(fromHex("81 00 92 cc ff 00")),
        [{ x: [255, 0] }, 6],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfUint8(fromHex("81 00 91 cd 01 00"));
    });
});

test("encode array of int8", (t) => {
    t.is(toHex(Encode.TestArrayOfInt8({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfInt8({ x: [-1] })), "81 00 91 ff");
    t.is(
        toHex(Encode.TestArrayOfInt8({ x: [-128, 127] })),
        "81 00 92 d0 80 7f",
    );
});

test("decode array of int8", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfInt8(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt8(fromHex("81 00 91 ff")),
        [{ x: [-1] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt8(fromHex("81 00 92 d0 80 7f")),
        [{ x: [-128, 127] }, 6],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfInt8(fromHex("81 00 91 cc ff"));
    });
});

test("encode array of uint16", (t) => {
    t.is(toHex(Encode.TestArrayOfUint16({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfUint16({ x: [0] })), "81 00 91 00");
    t.is(
        toHex(Encode.TestArrayOfUint16({ x: [65_535, 1] })),
        "81 00 92 cd ff ff 01",
    );
});

test("decode array of uint16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint16(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint16(fromHex("81 00 91 00")),
        [{ x: [0] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint16(
            fromHex("81 00 92 cd ff ff 01"),
        ),
        [{ x: [65_535, 1] }, 7],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfUint16(
            fromHex("81 00 91 ce 00 01 00 00"),
        );
    });
});

test("encode array of int16", (t) => {
    t.is(toHex(Encode.TestArrayOfInt16({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfInt16({ x: [-1] })), "81 00 91 ff");
    t.is(
        toHex(Encode.TestArrayOfInt16({ x: [-32_768, 32_767] })),
        "81 00 92 d1 80 00 cd 7f ff",
    );
});

test("decode array of int16", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfInt16(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt16(fromHex("81 00 91 ff")),
        [{ x: [-1] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt16(
            fromHex("81 00 92 d1 80 00 cd 7f ff"),
        ),
        [{ x: [-32_768, 32_767] }, 9],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfInt16(fromHex("81 00 91 cd ff ff"));
    });
});

test("encode array of uint32", (t) => {
    t.is(toHex(Encode.TestArrayOfUint32({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfUint32({ x: [0] })), "81 00 91 00");
    t.is(
        toHex(Encode.TestArrayOfUint32({ x: [4_294_967_295, 1] })),
        "81 00 92 ce ff ff ff ff 01",
    );
});

test("decode array of uint32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint32(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint32(fromHex("81 00 91 00")),
        [{ x: [0] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint32(
            fromHex("81 00 92 ce ff ff ff ff 01"),
        ),
        [{ x: [4_294_967_295, 1] }, 9],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfUint32(
            fromHex("81 00 91 cf 00 00 00 01 00 00 00 00"),
        );
    });
});

test("encode array of int32", (t) => {
    t.is(toHex(Encode.TestArrayOfInt32({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfInt32({ x: [-1] })), "81 00 91 ff");
    t.is(
        toHex(Encode.TestArrayOfInt32({ x: [-2_147_483_648, 2_147_483_647] })),
        "81 00 92 d2 80 00 00 00 ce 7f ff ff ff",
    );
});

test("decode array of int32", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfInt32(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt32(fromHex("81 00 91 ff")),
        [{ x: [-1] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt32(
            fromHex("81 00 92 d2 80 00 00 00 ce 7f ff ff ff"),
        ),
        [{ x: [-2_147_483_648, 2_147_483_647] }, 13],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfInt32(
            fromHex("81 00 91 ce 80 00 00 00"),
        );
    });
});

test("encode array of uint64", (t) => {
    t.is(toHex(Encode.TestArrayOfUint64({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfUint64({ x: [0n] })), "81 00 91 00");
    t.is(
        toHex(Encode.TestArrayOfUint64({ x: [4_294_967_296n, 1n] })),
        "81 00 92 cf 00 00 00 01 00 00 00 00 01",
    );

    t.throws(() => {
        Encode.TestArrayOfUint64({ x: [18_446_744_073_709_551_616n] });
    });
});

test("decode array of uint64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint64(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint64(fromHex("81 00 91 00")),
        [{ x: [0n] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfUint64(
            fromHex("81 00 92 cf 00 00 00 01 00 00 00 00 01"),
        ),
        [{ x: [4_294_967_296n, 1n] }, 13],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfUint64(fromHex("81 00 91 ff"));
    });
});

test("encode array of int64", (t) => {
    t.is(toHex(Encode.TestArrayOfInt64({ x: [] })), "81 00 90");
    t.is(toHex(Encode.TestArrayOfInt64({ x: [-1n] })), "81 00 91 ff");
    t.is(
        toHex(
            Encode.TestArrayOfInt64({ x: [-2_147_483_648n, 2_147_483_647n] }),
        ),
        "81 00 92 d2 80 00 00 00 ce 7f ff ff ff",
    );
});

test("decode array of int64", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfInt64(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt64(fromHex("81 00 92 ff 00")),
        [{ x: [-1n, 0n] }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfInt64(
            fromHex(
                "81 00 92 d3 80 00 00 00 00 00 00 00 cf 7f ff ff ff ff ff ff ff",
            ),
        ),
        [{ x: [-9_223_372_036_854_775_808n, 9_223_372_036_854_775_807n] }, 21],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfInt64(fromHex("81 00 91 90"));
    });
});

test("encode array of float32", (t) => {
    t.is(toHex(Encode.TestArrayOfFloat32({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestArrayOfFloat32({ x: [0, 3.141592653589793] })),
        "81 00 92 ca 00 00 00 00 ca 40 49 0f db",
    );
});

test("decode array of float32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfFloat32(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfFloat32(
            fromHex("81 00 91 ca 5a 00 00 00"),
        ),
        [{ x: [9_007_199_254_740_992] }, 8],
    );
});

test("encode array of float64", (t) => {
    t.is(toHex(Encode.TestArrayOfFloat64({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestArrayOfFloat64({ x: [-1, 3.141592653589793] })),
        "81 00 92 cb bf f0 00 00 00 00 00 00 cb 40 09 21 fb 54 44 2d 18",
    );
});

test("decode array of float64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfFloat64(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfFloat64(
            fromHex("81 00 91 cb c3 3f ff ff ff ff ff ff"),
        ),
        [{ x: [-9_007_199_254_740_991] }, 12],
    );
});

test("encode array of string", (t) => {
    t.is(toHex(Encode.TestArrayOfString({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestArrayOfString({ x: ["AA", ""] })),
        "81 00 92 a2 41 41 a0",
    );
});

test("decode array of string", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfString(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfString(
            fromHex("81 00 92 a2 41 41 a0"),
        ),
        [{ x: ["AA", ""] }, 7],
    );
});

test("encode array of bytes", (t) => {
    t.is(toHex(Encode.TestArrayOfBytes({ x: [] })), "81 00 90");
    t.is(
        toHex(
            Encode.TestArrayOfBytes({
                x: [fromHex("00 01").buffer],
            }),
        ),
        "81 00 91 c4 02 00 01",
    );
});

test("decode array of bytes", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestArrayOfBytes(fromHex("81 00 90")), [
        { x: [] },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBytes(
            fromHex("81 00 91 c4 02 00 01"),
        ),
        [{ x: [fromHex("00 01").buffer] }, 7],
    );
});

test("encode array of bytes8", (t) => {
    t.is(toHex(Encode.TestArrayOfBytes8({ x: [] })), "81 00 90");
    t.is(
        toHex(
            Encode.TestArrayOfBytes({
                x: [
                    fromHex("01 01 01 01 01 01 01 01").buffer,
                    fromHex("02 02 02 02 02 02 02 02").buffer,
                ],
            }),
        ),
        "81 00 92 c4 08 01 01 01 01 01 01 01 01 c4 08 02 02 02 02 02 02 02 02",
    );

    t.throws(() => {
        Encode.TestArrayOfBytes8({ x: [fromHex("01").buffer] });
    });
});

test("decode array of bytes8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBytes8(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfBytes8(
            fromHex(
                "81 00 92 c4 08 01 01 01 01 01 01 01 01 c4 08 02 02 02 02 02 02 02 02",
            ),
        ),
        [
            {
                x: [
                    fromHex("01 01 01 01 01 01 01 01").buffer,
                    fromHex("02 02 02 02 02 02 02 02").buffer,
                ],
            },
            23,
        ],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfBytes8(
            fromHex("81 00 91 c4 07 01 01 01 01 01 01 01"),
        );
    });
});

test("encode array of array", (t) => {
    t.is(toHex(Encode.TestArrayOfArrayOfBytes0({ x: [] })), "81 00 90");
    t.is(
        toHex(
            Encode.TestArrayOfArrayOfBytes0({
                x: [[], [new ArrayBuffer(0), new ArrayBuffer(0)]],
            }),
        ),
        "81 00 92 90 92 c4 00 c4 00",
    );
});

test("decode array of array", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfArrayOfBytes0(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfArrayOfBytes0(
            fromHex("81 00 92 90 92 c4 00 c4 00"),
        ),
        [{ x: [[], [new ArrayBuffer(0), new ArrayBuffer(0)]] }, 9],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfArrayOfBytes0(
            fromHex("81 00 91 c4 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestArrayOfArrayOfBytes0(
            fromHex("81 00 91 91 c4 01 00"),
        );
    });
});

test("encode array of array of array", (t) => {
    t.is(toHex(Encode.TestArrayOfArrayOfArrayOfUint8({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestArrayOfArrayOfArrayOfUint8({ x: [[]] })),
        "81 00 91 90",
    );
    t.is(
        toHex(Encode.TestArrayOfArrayOfArrayOfUint8({ x: [[[0, 1]]] })),
        "81 00 91 91 92 00 01",
    );
});

test("decode array of array of array", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfArrayOfArrayOfUint8(
            fromHex("81 00 90"),
        ),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfArrayOfArrayOfUint8(
            fromHex("81 00 91 90"),
        ),
        [{ x: [[]] }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestArrayOfArrayOfArrayOfUint8(
            fromHex("81 00 91 91 92 00 01"),
        ),
        [{ x: [[[0, 1]]] }, 7],
    );
});

test("encode optional array", (t) => {
    t.is(toHex(Encode.TestOptionalArrayOfBoolean({})), "80");
    t.is(toHex(Encode.TestOptionalArrayOfBoolean({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestOptionalArrayOfBoolean({ x: [false, true] })),
        "81 00 92 c2 c3",
    );
});

test("decode optional array", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalArrayOfBoolean(fromHex("80")),
        [{}, 1],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalArrayOfBoolean(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalArrayOfBoolean(
            fromHex("81 00 92 c2 c3"),
        ),
        [{ x: [false, true] }, 5],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalArrayOfBoolean(fromHex("81 00 c0"));
    });
});

test("encode nullable array", (t) => {
    t.is(toHex(Encode.TestNullableArrayOfBoolean({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestNullableArrayOfBoolean({ x: [] })), "81 00 90");
    t.is(
        toHex(Encode.TestNullableArrayOfBoolean({ x: [true] })),
        "81 00 91 c3",
    );
});

test("decode nullable array", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableArrayOfBoolean(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableArrayOfBoolean(fromHex("81 00 90")),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableArrayOfBoolean(
            fromHex("81 00 91 c3"),
        ),
        [{ x: [true] }, 4],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestNullableArrayOfBoolean(fromHex("80"));
    });
});

test("encode optional nullable array", (t) => {
    t.is(toHex(Encode.TestOptionalNullableArrayOfBoolean({})), "80");
    t.is(
        toHex(Encode.TestOptionalNullableArrayOfBoolean({ x: null })),
        "81 00 c0",
    );
    t.is(
        toHex(Encode.TestOptionalNullableArrayOfBoolean({ x: [] })),
        "81 00 90",
    );
    t.is(
        toHex(Encode.TestOptionalNullableArrayOfBoolean({ x: [true, false] })),
        "81 00 92 c3 c2",
    );
});

test("decode optional nullable array", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableArrayOfBoolean(
            fromHex("80"),
        ),
        [{}, 1],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableArrayOfBoolean(
            fromHex("81 00 c0"),
        ),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableArrayOfBoolean(
            fromHex("81 00 90"),
        ),
        [{ x: [] }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableArrayOfBoolean(
            fromHex("81 00 92 c3 c2"),
        ),
        [{ x: [true, false] }, 5],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalNullableArrayOfBoolean(
            fromHex("81 00 00"),
        );
    });
});

test("encode array of structs", (t) => {
    t.is(toHex(EncodeArray.TestBoolean([])), "90");
    t.is(toHex(EncodeArray.TestBoolean([{ x: false }])), "91 81 00 c2");
    t.is(
        toHex(EncodeArray.TestString([{ x: "a" }, { x: "bb" }])),
        "92 81 00 a1 61 81 00 a2 62 62",
    );
});

test("decode array of structs", (t) => {
    t.deepEqual(DecodeArray.TestBoolean(fromHex("90")), []);
    t.deepEqual(DecodeArray.TestBoolean(fromHex("91 81 00 c2")), [
        { x: false },
    ]);
    t.deepEqual(
        DecodeArray.TestString(fromHex("92 81 00 a1 61 81 00 a2 62 62")),
        [{ x: "a" }, { x: "bb" }],
    );
});

test("encode array of enums", (t) => {
    t.is(
        toHex(EncodeArray.TestEnum([Types.TestEnum.A, Types.TestEnum.C])),
        "92 00 7f",
    );
});

test("decode array of enums", (t) => {
    t.deepEqual(DecodeArray.TestEnum(fromHex("92 00 7f")), [
        Types.TestEnum.A,
        Types.TestEnum.C,
    ]);
});

test("encode array of tagged enums", (t) => {
    t.is(
        toHex(
            EncodeArray.TestTaggedEnum([
                [Types.TestTaggedEnum.B, { x: 16 }],
                [Types.TestTaggedEnum.A, { x: true }],
            ]),
        ),
        "92 92 01 81 00 10 92 00 81 00 c3",
    );
});

test("decode array of tagged enums", (t) => {
    t.deepEqual(
        DecodeArray.TestTaggedEnum(fromHex("92 92 01 81 00 10 92 00 81 00 c3")),
        [
            [Types.TestTaggedEnum.B, { x: 16 }],
            [Types.TestTaggedEnum.A, { x: true }],
        ],
    );
});
