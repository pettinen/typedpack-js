import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode int8", (t) => {
    t.is(toHex(Encode.TestInt8({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestInt8({ x: 127 })), "81 00 7f");
    t.is(toHex(Encode.TestInt8({ x: -1 })), "81 00 ff");
    t.is(toHex(Encode.TestInt8({ x: -32 })), "81 00 e0");
    t.is(toHex(Encode.TestInt8({ x: -33 })), "81 00 d0 df");
    t.is(toHex(Encode.TestInt8({ x: -128 })), "81 00 d0 80");
});

test("decode int8", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 7f")), [
        { x: 127 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 ff")), [
        { x: -1 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 e0")), [
        { x: -32 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 d0 df")), [
        { x: -33 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt8(fromHex("81 00 d0 80")), [
        { x: -128 },
        4,
    ]);
});

test("encode optional int8", (t) => {
    t.is(toHex(Encode.TestOptionalInt8({ x: -128 })), "81 00 d0 80");
    t.is(toHex(Encode.TestOptionalInt8({})), "80");
});

test("decode optional int8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalInt8(fromHex("81 00 d0 9c")),
        [{ x: -100 }, 4],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalInt8(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable int8", (t) => {
    t.is(toHex(Encode.TestNullableInt8({ x: 1 })), "81 00 01");
    t.is(toHex(Encode.TestNullableInt8({ x: null })), "81 00 c0");
});

test("decode nullable int8", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestNullableInt8(fromHex("81 00 64")), [
        { x: 100 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestNullableInt8(fromHex("81 00 c0")), [
        { x: null },
        3,
    ]);
});

test("encode optional nullable int8", (t) => {
    t.is(toHex(Encode.TestOptionalNullableInt8({ x: 127 })), "81 00 7f");
    t.is(toHex(Encode.TestOptionalNullableInt8({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableInt8({})), "80");
});

test("decode optional nullable int8", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt8(fromHex("81 00 f6")),
        [{ x: -10 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt8(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt8(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-int8 value into int8", (t) => {
    t.throws(() => {
        Encode.TestInt8({ x: -129 });
    });
    t.throws(() => {
        Encode.TestInt8({ x: 128 });
    });
    t.throws(() => {
        Encode.TestInt8({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestInt8({ x: NaN });
    });
    t.throws(() => {
        Encode.TestInt8({ x: Infinity });
    });
});

test("fail to decode non-int8 value into int8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 d1 ff 7f"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 cc 80"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into int8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("80"));
    });
});

test("fail to decode missing field into nullable int8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableInt8(fromHex("80"));
    });
});

test("fail to decode null into int8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt8(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional int8", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalInt8(fromHex("81 00 c0"));
    });
});
