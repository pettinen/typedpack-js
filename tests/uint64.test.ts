import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode uint64", (t) => {
    t.is(toHex(Encode.TestUint64({ x: 0n })), "81 00 00");
    t.is(toHex(Encode.TestUint64({ x: 127n })), "81 00 7f");
    t.is(toHex(Encode.TestUint64({ x: 128n })), "81 00 cc 80");
    t.is(toHex(Encode.TestUint64({ x: 255n })), "81 00 cc ff");
    t.is(toHex(Encode.TestUint64({ x: 256n })), "81 00 cd 01 00");
    t.is(toHex(Encode.TestUint64({ x: 65_535n })), "81 00 cd ff ff");
    t.is(toHex(Encode.TestUint64({ x: 65_536n })), "81 00 ce 00 01 00 00");
    t.is(
        toHex(Encode.TestUint64({ x: 4_294_967_295n })),
        "81 00 ce ff ff ff ff",
    );
    t.is(
        toHex(Encode.TestUint64({ x: 4_294_967_296n })),
        "81 00 cf 00 00 00 01 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestUint64({ x: 18_446_744_073_709_551_615n })),
        "81 00 cf ff ff ff ff ff ff ff ff",
    );
});

test("decode uint64", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 00")), [
        { x: 0n },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 7f")), [
        { x: 127n },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 cc 80")), [
        { x: 128n },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 cc ff")), [
        { x: 255n },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 cd 01 00")), [
        { x: 256n },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestUint64(fromHex("81 00 cd ff ff")), [
        { x: 65_535n },
        5,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 ce 00 01 00 00")),
        [{ x: 65_536n }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 ce ff ff ff ff")),
        [{ x: 4_294_967_295n }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestUint64(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        ),
        [{ x: 4_294_967_296n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestUint64(
            fromHex("81 00 cf ff ff ff ff ff ff ff ff"),
        ),
        [{ x: 18_446_744_073_709_551_615n }, 11],
    );
});

test("encode optional uint64", (t) => {
    t.is(toHex(Encode.TestOptionalUint64({ x: 128n })), "81 00 cc 80");
    t.is(toHex(Encode.TestOptionalUint64({})), "80");
});

test("decode optional uint64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalUint64(fromHex("81 00 cd 01 00")),
        [{ x: 256n }, 5],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalUint64(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable uint64", (t) => {
    t.is(
        toHex(Encode.TestNullableUint64({ x: 72_057_594_037_927_936n })),
        "81 00 cf 01 00 00 00 00 00 00 00",
    );
    t.is(toHex(Encode.TestNullableUint64({ x: null })), "81 00 c0");
});

test("decode nullable uint64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint64(
            fromHex("81 00 cf 01 00 00 00 00 00 00 00"),
        ),
        [{ x: 72_057_594_037_927_936n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableUint64(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable uint64", (t) => {
    t.is(toHex(Encode.TestOptionalNullableUint64({ x: 0n })), "81 00 00");
    t.is(toHex(Encode.TestOptionalNullableUint64({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableUint64({})), "80");
});

test("decode optional nullable uint64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint64(
            fromHex("81 00 cd 27 10"),
        ),
        [{ x: 10_000n }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint64(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableUint64(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-uint64 value into uint64", (t) => {
    t.throws(() => {
        Encode.TestUint64({ x: -1n });
    });
    t.throws(() => {
        Encode.TestUint64({ x: 18_446_744_073_709_551_616n });
    });
});

test("fail to decode non-uint64 value into uint64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(
            fromHex("81 00 d3 ff ff ff ff ff ff ff ff"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into uint64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("80"));
    });
});

test("fail to decode missing field into nullable uint64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableUint64(fromHex("80"));
    });
});

test("fail to decode null into uint64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestUint64(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional uint64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalUint64(fromHex("81 00 c0"));
    });
});
