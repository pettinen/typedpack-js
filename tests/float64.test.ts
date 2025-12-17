import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode float64", (t) => {
    t.is(
        toHex(Encode.TestFloat64({ x: 0 })),
        "81 00 cb 00 00 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: -0 })),
        "81 00 cb 80 00 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: 1 })),
        "81 00 cb 3f f0 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: 1.5 })),
        "81 00 cb 3f f8 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: 3.141592653589793 })),
        "81 00 cb 40 09 21 fb 54 44 2d 18",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: -1 })),
        "81 00 cb bf f0 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: -9_007_199_254_740_991 })),
        "81 00 cb c3 3f ff ff ff ff ff ff",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: 9_007_199_254_740_991 })),
        "81 00 cb 43 3f ff ff ff ff ff ff",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: 18_446_744_073_709_552_000 })),
        "81 00 cb 43 f0 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: NaN })),
        "81 00 cb 7f f8 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: -NaN })),
        "81 00 cb ff f8 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: Infinity })),
        "81 00 cb 7f f0 00 00 00 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat64({ x: -Infinity })),
        "81 00 cb ff f0 00 00 00 00 00 00",
    );
});

test("decode float64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 00 00 00 00 00 00 00 00"),
        ),
        [{ x: 0 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 80 00 00 00 00 00 00 00"),
        ),
        [{ x: -0 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 3f f0 00 00 00 00 00 00"),
        ),
        [{ x: 1 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 3f f8 00 00 00 00 00 00"),
        ),
        [{ x: 1.5 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 40 09 21 fb 54 44 2d 18"),
        ),
        [{ x: 3.141592653589793 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb bf f0 00 00 00 00 00 00"),
        ),
        [{ x: -1 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb c3 3f ff ff ff ff ff ff"),
        ),
        [{ x: -9_007_199_254_740_991 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 43 40 00 00 00 00 00 00"),
        ),
        [{ x: 9_007_199_254_740_992 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 43 f0 00 00 00 00 00 00"),
        ),
        [{ x: 18_446_744_073_709_552_000 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 7f f8 00 00 00 00 00 00"),
        ),
        [{ x: NaN }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb ff f8 00 00 00 00 00 00"),
        ),
        [{ x: -NaN }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb 7f f0 00 00 00 00 00 00"),
        ),
        [{ x: Infinity }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cb ff f0 00 00 00 00 00 00"),
        ),
        [{ x: -Infinity }, 11],
    );
});

test("encode optional float64", (t) => {
    t.is(
        toHex(Encode.TestOptionalFloat64({ x: 4_294_967_295 })),
        "81 00 cb 41 ef ff ff ff e0 00 00",
    );
    t.is(toHex(Encode.TestOptionalFloat64({})), "80");
});

test("decode optional float64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalFloat64(
            fromHex("81 00 cb 41 f0 00 00 00 00 00 00"),
        ),
        [{ x: 4_294_967_296 }, 11],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalFloat64(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable float64", (t) => {
    t.is(
        toHex(Encode.TestNullableFloat64({ x: 4_294_967_296 })),
        "81 00 cb 41 f0 00 00 00 00 00 00",
    );
    t.is(toHex(Encode.TestNullableFloat64({ x: null })), "81 00 c0");
});

test("decode nullable float64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableFloat64(
            fromHex("81 00 cb 3f c0 00 00 00 00 00 00"),
        ),
        [{ x: 0.125 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableFloat64(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable float64", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableFloat64({ x: 16.5 })),
        "81 00 cb 40 30 80 00 00 00 00 00",
    );
    t.is(toHex(Encode.TestOptionalNullableFloat64({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableFloat64({})), "80");
});

test("decode optional nullable float64", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat64(
            fromHex("81 00 cb 40 30 80 00 00 00 00 00"),
        ),
        [{ x: 16.5 }, 11],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat64(
            fromHex("81 00 c0"),
        ),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat64(fromHex("80")),
        [{}, 1],
    );
});

test("fail to decode non-float64 value into float64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 ca 00 00 00 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into float64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("80"));
    });
});

test("fail to decode missing field into nullable float64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableFloat64(fromHex("80"));
    });
});

test("fail to decode null into float64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat64(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional float64", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalFloat64(fromHex("81 00 c0"));
    });
});
