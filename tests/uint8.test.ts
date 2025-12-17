import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode uint8", (t) => {
    t.is(toHex(Encode.TestUint8({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestUint8({ x: 127 })), "81 00 7f");
    t.is(toHex(Encode.TestUint8({ x: 128 })), "81 00 cc 80");
    t.is(toHex(Encode.TestUint8({ x: 255 })), "81 00 cc ff");
});

test("decode uint8", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestUint8(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint8(fromHex("81 00 7f")), [
        { x: 127 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint8(fromHex("81 00 cc 80")), [
        { x: 128 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint8(fromHex("81 00 cc ff")), [
        { x: 255 },
        4,
    ]);
});

test("encode optional uint8", (t) => {
    t.is(toHex(Encode.TestOptionalUint8({ x: 255 })), "81 00 cc ff");
    t.is(toHex(Encode.TestOptionalUint8({})), "80");
});

test("decode optional uint8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalUint8(fromHex("81 00 2a")),
        [{ x: 42 }, 3],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalUint8(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable uint8", (t) => {
    t.is(toHex(Encode.TestNullableUint8({ x: 1 })), "81 00 01");
    t.is(toHex(Encode.TestNullableUint8({ x: null })), "81 00 c0");
});

test("decode nullable uint8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint8(fromHex("81 00 64")),
        [{ x: 100 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint8(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable uint8", (t) => {
    t.is(toHex(Encode.TestOptionalNullableUint8({ x: 200 })), "81 00 cc c8");
    t.is(toHex(Encode.TestOptionalNullableUint8({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableUint8({})), "80");
});

test("decode optional nullable uint8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint8(fromHex("81 00 10")),
        [{ x: 16 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint8(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint8(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-uint8 value into uint8", (t) => {
    t.throws(() => {
        Encode.TestUint8({ x: -1 });
    });
    t.throws(() => {
        Encode.TestUint8({ x: 256 });
    });
    t.throws(() => {
        Encode.TestUint8({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestUint8({ x: NaN });
    });
    t.throws(() => {
        Encode.TestUint8({ x: Infinity });
    });
});

test("fail to decode non-uint8 value into uint8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 e0"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 cd 01 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into uint8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("80"));
    });
});

test("fail to decode missing field into nullable uint8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableUint8(fromHex("80"));
    });
});

test("fail to decode null into uint8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint8(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional uint8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalUint8(fromHex("81 00 c0"));
    });
});
