import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode uint16", (t) => {
    t.is(toHex(Encode.TestUint16({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestUint16({ x: 127 })), "81 00 7f");
    t.is(toHex(Encode.TestUint16({ x: 128 })), "81 00 cc 80");
    t.is(toHex(Encode.TestUint16({ x: 255 })), "81 00 cc ff");
    t.is(toHex(Encode.TestUint16({ x: 256 })), "81 00 cd 01 00");
    t.is(toHex(Encode.TestUint16({ x: 65_535 })), "81 00 cd ff ff");
});

test("decode uint16", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 7f")), [
        { x: 127 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 cc 80")), [
        { x: 128 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 cc ff")), [
        { x: 255 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 cd 01 00")), [
        { x: 256 },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint16(fromHex("81 00 cd ff ff")), [
        { x: 65_535 },
        5,
    ]);
});

test("encode optional uint16", (t) => {
    t.is(toHex(Encode.TestOptionalUint16({ x: 255 })), "81 00 cc ff");
    t.is(toHex(Encode.TestOptionalUint16({})), "80");
});

test("decode optional uint16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalUint16(fromHex("81 00 cd ff ff")),
        [{ x: 65_535 }, 5],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalUint16(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable uint16", (t) => {
    t.is(toHex(Encode.TestNullableUint16({ x: 8 })), "81 00 08");
    t.is(toHex(Encode.TestNullableUint16({ x: null })), "81 00 c0");
});

test("decode nullable uint16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint16(fromHex("81 00 cd 03 e8")),
        [{ x: 1000 }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint16(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable uint16", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableUint16({ x: 2000 })),
        "81 00 cd 07 d0",
    );
    t.is(toHex(Encode.TestOptionalNullableUint16({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableUint16({})), "80");
});

test("decode optional nullable uint16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint16(
            fromHex("81 00 cd 27 10"),
        ),
        [{ x: 10_000 }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint16(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint16(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-uint16 value into uint16", (t) => {
    t.throws(() => {
        Encode.TestUint16({ x: -1 });
    });
    t.throws(() => {
        Encode.TestUint16({ x: 65_536 });
    });
    t.throws(() => {
        Encode.TestUint16({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestUint16({ x: NaN });
    });
    t.throws(() => {
        Encode.TestUint16({ x: Infinity });
    });
});

test("fail to decode non-uint16 value into uint16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 ce 00 01 00 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into uint16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("80"));
    });
});

test("fail to decode missing field into nullable uint16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableUint16(fromHex("80"));
    });
});

test("fail to decode null into uint16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint16(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional uint16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalUint16(fromHex("81 00 c0"));
    });
});
