import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode float32", (t) => {
    t.is(toHex(Encode.TestFloat32({ x: 0 })), "81 00 ca 00 00 00 00");
    t.is(toHex(Encode.TestFloat32({ x: -0 })), "81 00 ca 80 00 00 00");
    t.is(toHex(Encode.TestFloat32({ x: 1 })), "81 00 ca 3f 80 00 00");
    t.is(toHex(Encode.TestFloat32({ x: 1.5 })), "81 00 ca 3f c0 00 00");
    t.is(
        toHex(Encode.TestFloat32({ x: 3.141592653589793 })),
        "81 00 ca 40 49 0f db",
    );
    t.is(toHex(Encode.TestFloat32({ x: -1 })), "81 00 ca bf 80 00 00");
    t.is(
        toHex(Encode.TestFloat32({ x: -9_007_199_254_740_991 })),
        "81 00 ca da 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat32({ x: 9_007_199_254_740_991 })),
        "81 00 ca 5a 00 00 00",
    );
    t.is(
        toHex(Encode.TestFloat32({ x: 18_446_744_073_709_552_000 })),
        "81 00 ca 5f 80 00 00",
    );
    t.is(toHex(Encode.TestFloat32({ x: NaN })), "81 00 ca 7f c0 00 00");
    t.is(toHex(Encode.TestFloat32({ x: -NaN })), "81 00 ca ff c0 00 00");
    t.is(toHex(Encode.TestFloat32({ x: Infinity })), "81 00 ca 7f 80 00 00");
    t.is(toHex(Encode.TestFloat32({ x: -Infinity })), "81 00 ca ff 80 00 00");
});

test("decode float32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 00 00 00 00")),
        [{ x: 0 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 80 00 00 00")),
        [{ x: -0 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 3f 80 00 00")),
        [{ x: 1 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 3f c0 00 00")),
        [{ x: 1.5 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 40 49 0f db")),
        [{ x: 3.1415927410125732 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca bf 80 00 00")),
        [{ x: -1 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca da 00 00 00")),
        [{ x: -9_007_199_254_740_992 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 5a 00 00 00")),
        [{ x: 9_007_199_254_740_992 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 5f 80 00 00")),
        [{ x: 18_446_744_073_709_552_000 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 7f c0 00 00")),
        [{ x: NaN }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca ff c0 00 00")),
        [{ x: -NaN }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca 7f 80 00 00")),
        [{ x: Infinity }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ca ff 80 00 00")),
        [{ x: -Infinity }, 7],
    );
});

test("encode optional float32", (t) => {
    t.is(
        toHex(Encode.TestOptionalFloat32({ x: 4_294_967_295 })),
        "81 00 ca 4f 80 00 00",
    );
    t.is(toHex(Encode.TestOptionalFloat32({})), "80");
});

test("decode optional float32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalFloat32(
            fromHex("81 00 ca 4f 80 00 00"),
        ),
        [{ x: 4_294_967_296 }, 7],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalFloat32(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable float32", (t) => {
    t.is(
        toHex(Encode.TestNullableFloat32({ x: 4_294_967_296 })),
        "81 00 ca 4f 80 00 00",
    );
    t.is(toHex(Encode.TestNullableFloat32({ x: null })), "81 00 c0");
});

test("decode nullable float32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableFloat32(
            fromHex("81 00 ca 3e 00 00 00"),
        ),
        [{ x: 0.125 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableFloat32(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable float32", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableFloat32({ x: 16.5 })),
        "81 00 ca 41 84 00 00",
    );
    t.is(toHex(Encode.TestOptionalNullableFloat32({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableFloat32({})), "80");
});

test("decode optional nullable float32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat32(
            fromHex("81 00 ca 41 84 00 00"),
        ),
        [{ x: 16.5 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat32(
            fromHex("81 00 c0"),
        ),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableFloat32(fromHex("80")),
        [{}, 1],
    );
});

test("fail to decode non-float32 value into float32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into float32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("80"));
    });
});

test("fail to decode missing field into nullable float32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableFloat32(fromHex("80"));
    });
});

test("fail to decode null into float32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestFloat32(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional float32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalFloat32(fromHex("81 00 c0"));
    });
});
