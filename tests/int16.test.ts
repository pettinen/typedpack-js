import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode int16", (t) => {
    t.is(toHex(Encode.TestInt16({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestInt16({ x: -1 })), "81 00 ff");
    t.is(toHex(Encode.TestInt16({ x: 32_767 })), "81 00 cd 7f ff");
    t.is(toHex(Encode.TestInt16({ x: -32_768 })), "81 00 d1 80 00");
});

test("decode int16", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestInt16(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt16(fromHex("81 00 ff")), [
        { x: -1 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt16(fromHex("81 00 cd 7f ff")), [
        { x: 32_767 },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt16(fromHex("81 00 d1 7f ff")), [
        { x: 32_767 },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt16(fromHex("81 00 d1 80 00")), [
        { x: -32_768 },
        5,
    ]);
});

test("encode optional int16", (t) => {
    t.is(toHex(Encode.TestOptionalInt16({ x: 32_767 })), "81 00 cd 7f ff");
    t.is(toHex(Encode.TestOptionalInt16({})), "80");
});

test("decode optional int16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalInt16(fromHex("81 00 d1 d8 f0")),
        [{ x: -10_000 }, 5],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalInt16(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable int16", (t) => {
    t.is(toHex(Encode.TestNullableInt16({ x: 1 })), "81 00 01");
    t.is(toHex(Encode.TestNullableInt16({ x: null })), "81 00 c0");
});

test("decode nullable int16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt16(fromHex("81 00 64")),
        [{ x: 100 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt16(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable int16", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableInt16({ x: 10_000 })),
        "81 00 cd 27 10",
    );
    t.is(toHex(Encode.TestOptionalNullableInt16({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableInt16({})), "80");
});

test("decode optional nullable int16", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt16(fromHex("81 00 f6")),
        [{ x: -10 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt16(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt16(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-int16 value into int16", (t) => {
    t.throws(() => {
        Encode.TestInt16({ x: -32_769 });
    });
    t.throws(() => {
        Encode.TestInt16({ x: 32_768 });
    });
    t.throws(() => {
        Encode.TestInt16({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestInt16({ x: NaN });
    });
    t.throws(() => {
        Encode.TestInt16({ x: Infinity });
    });
});

test("fail to decode non-int16 value into int16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 d2 ff ff 7f ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 ce 00 00 80 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 d2 00 00 80 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into int16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("80"));
    });
});

test("fail to decode missing field into nullable int16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableInt16(fromHex("80"));
    });
});

test("fail to decode null into int16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt16(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional int16", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalInt16(fromHex("81 00 c0"));
    });
});
