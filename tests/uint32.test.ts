import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode uint32", (t) => {
    t.is(toHex(Encode.TestUint32({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestUint32({ x: 127 })), "81 00 7f");
    t.is(toHex(Encode.TestUint32({ x: 128 })), "81 00 cc 80");
    t.is(toHex(Encode.TestUint32({ x: 255 })), "81 00 cc ff");
    t.is(toHex(Encode.TestUint32({ x: 256 })), "81 00 cd 01 00");
    t.is(toHex(Encode.TestUint32({ x: 65_535 })), "81 00 cd ff ff");
    t.is(toHex(Encode.TestUint32({ x: 65_536 })), "81 00 ce 00 01 00 00");
    t.is(
        toHex(Encode.TestUint32({ x: 4_294_967_295 })),
        "81 00 ce ff ff ff ff",
    );
});

test("decode uint32", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 7f")), [
        { x: 127 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 cc 80")), [
        { x: 128 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 cc ff")), [
        { x: 255 },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 cd 01 00")), [
        { x: 256 },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint32(fromHex("81 00 cd ff ff")), [
        { x: 65_535 },
        5,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 ce 00 01 00 00")),
        [{ x: 65_536 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 ce ff ff ff ff")),
        [{ x: 4_294_967_295 }, 7],
    );
});

test("encode optional uint32", (t) => {
    t.is(
        toHex(Encode.TestOptionalUint32({ x: 4_294_967_295 })),
        "81 00 ce ff ff ff ff",
    );
    t.is(toHex(Encode.TestOptionalUint32({})), "80");
});

test("decode optional uint32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalUint32(
            fromHex("81 00 ce ff ff ff ff"),
        ),
        [{ x: 4_294_967_295 }, 7],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalUint32(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable uint32", (t) => {
    t.is(
        toHex(Encode.TestNullableUint32({ x: 1_000_000 })),
        "81 00 ce 00 0f 42 40",
    );
    t.is(toHex(Encode.TestNullableUint32({ x: null })), "81 00 c0");
});

test("decode nullable uint32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint32(fromHex("81 00 01")),
        [{ x: 1 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint32(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable uint32", (t) => {
    t.is(toHex(Encode.TestOptionalNullableUint32({ x: 2 })), "81 00 02");
    t.is(toHex(Encode.TestOptionalNullableUint32({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableUint32({})), "80");
});

test("decode optional nullable uint32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint32(
            fromHex("81 00 cd 27 10"),
        ),
        [{ x: 10_000 }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint32(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint32(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-uint32 value into uint32", (t) => {
    t.throws(() => {
        Encode.TestUint32({ x: -1 });
    });
    t.throws(() => {
        Encode.TestUint32({ x: 4_294_967_296 });
    });
    t.throws(() => {
        Encode.TestUint32({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestUint32({ x: NaN });
    });
    t.throws(() => {
        Encode.TestUint32({ x: -Infinity });
    });
});

test("fail to decode non-uint32 value into uint32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into uint32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("80"));
    });
});

test("fail to decode missing field into nullable uint32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableUint32(fromHex("80"));
    });
});

test("fail to decode null into uint32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint32(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional uint32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalUint32(fromHex("81 00 c0"));
    });
});
