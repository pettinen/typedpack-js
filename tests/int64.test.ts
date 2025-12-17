import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode int64", (t) => {
    t.is(toHex(Encode.TestInt64({ x: 0n })), "81 00 00");
    t.is(toHex(Encode.TestInt64({ x: 127n })), "81 00 7f");
    t.is(toHex(Encode.TestInt64({ x: 128n })), "81 00 cc 80");
    t.is(toHex(Encode.TestInt64({ x: 255n })), "81 00 cc ff");
    t.is(toHex(Encode.TestInt64({ x: 256n })), "81 00 cd 01 00");
    t.is(toHex(Encode.TestInt64({ x: 65_535n })), "81 00 cd ff ff");
    t.is(toHex(Encode.TestInt64({ x: 65_536n })), "81 00 ce 00 01 00 00");
    t.is(
        toHex(Encode.TestInt64({ x: 4_294_967_295n })),
        "81 00 ce ff ff ff ff",
    );
    t.is(
        toHex(Encode.TestInt64({ x: 4_294_967_296n })),
        "81 00 d3 00 00 00 01 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestInt64({ x: -9_223_372_036_854_775_808n })),
        "81 00 d3 80 00 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestInt64({ x: 9_223_372_036_854_775_807n })),
        "81 00 d3 7f ff ff ff ff ff ff ff",
    );
});

test("decode int64", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 00")), [
        { x: 0n },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 7f")), [
        { x: 127n },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 cc 80")), [
        { x: 128n },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 cc ff")), [
        { x: 255n },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 cd 01 00")), [
        { x: 256n },
        5,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt64(fromHex("81 00 cd ff ff")), [
        { x: 65_535n },
        5,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 ce 00 01 00 00")),
        [{ x: 65_536n }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 ce ff ff ff ff")),
        [{ x: 4_294_967_295n }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt64(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        ),
        [{ x: 4_294_967_296n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt64(
            fromHex("81 00 d3 80 00 00 00 00 00 00 00"),
        ),
        [{ x: -9_223_372_036_854_775_808n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt64(
            fromHex("81 00 cf 7f ff ff ff ff ff ff ff"),
        ),
        [{ x: 9_223_372_036_854_775_807n }, 11],
    );
});

test("encode optional int64", (t) => {
    t.is(
        toHex(Encode.TestOptionalInt64({ x: 1_000_000_000_000_000_000n })),
        "81 00 d3 0d e0 b6 b3 a7 64 00 00",
    );
    t.is(toHex(Encode.TestOptionalInt64({})), "80");
});

test("decode optional int64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalInt64(
            fromHex("81 00 d3 f2 1f 49 4c 58 9c 00 00"),
        ),
        [{ x: -1_000_000_000_000_000_000n }, 11],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalInt64(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable int64", (t) => {
    t.is(
        toHex(Encode.TestNullableInt64({ x: 72_057_594_037_927_936n })),
        "81 00 d3 01 00 00 00 00 00 00 00",
    );
    t.is(toHex(Encode.TestNullableInt64({ x: null })), "81 00 c0");
});

test("decode nullable int64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt64(
            fromHex("81 00 cf 01 00 00 00 00 00 00 00"),
        ),
        [{ x: 72_057_594_037_927_936n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt64(
            fromHex("81 00 d3 01 00 00 00 00 00 00 00"),
        ),
        [{ x: 72_057_594_037_927_936n }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt64(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable int64", (t) => {
    t.is(toHex(Encode.TestOptionalNullableInt64({ x: 0n })), "81 00 00");
    t.is(toHex(Encode.TestOptionalNullableInt64({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableInt64({})), "80");
});

test("decode optional nullable int64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt64(
            fromHex("81 00 cd 27 10"),
        ),
        [{ x: 10_000n }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt64(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt64(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-int64 value into int64", (t) => {
    t.throws(() => {
        Encode.TestInt64({ x: -9_223_372_036_854_775_809n });
    });
    t.throws(() => {
        Encode.TestInt64({ x: 9_223_372_036_854_775_808n });
    });
});

test("fail to decode non-int64 value into int64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(
            fromHex("81 00 cf 80 00 00 00 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into int64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(fromHex("80"));
    });
});

test("fail to decode missing field into nullable int64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableInt64(fromHex("80"));
    });
});

test("fail to decode null into int64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt64(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional int64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalInt64(fromHex("81 00 c0"));
    });
});
