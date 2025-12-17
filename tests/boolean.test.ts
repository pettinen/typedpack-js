import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode boolean", (t) => {
    t.is(toHex(Encode.TestBoolean({ x: false })), "81 00 c2");
    t.is(toHex(Encode.TestBoolean({ x: true })), "81 00 c3");
});

test("decode boolean", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestBoolean(fromHex("81 00 c2")), [
        { x: false },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestBoolean(fromHex("81 00 c3")), [
        { x: true },
        3,
    ]);
});

test("encode optional boolean", (t) => {
    t.is(toHex(Encode.TestOptionalBoolean({ x: false })), "81 00 c2");
    t.is(toHex(Encode.TestOptionalBoolean({})), "80");
});

test("decode optional boolean", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalBoolean(fromHex("81 00 c2")),
        [{ x: false }, 3],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalBoolean(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable boolean", (t) => {
    t.is(toHex(Encode.TestNullableBoolean({ x: true })), "81 00 c3");
    t.is(toHex(Encode.TestNullableBoolean({ x: null })), "81 00 c0");
});

test("decode nullable boolean", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableBoolean(fromHex("81 00 c3")),
        [{ x: true }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableBoolean(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable boolean", (t) => {
    t.is(toHex(Encode.TestOptionalNullableBoolean({ x: false })), "81 00 c2");
    t.is(toHex(Encode.TestOptionalNullableBoolean({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableBoolean({})), "80");
});

test("decode optional nullable boolean", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBoolean(
            fromHex("81 00 c2"),
        ),
        [{ x: false }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBoolean(
            fromHex("81 00 c0"),
        ),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBoolean(fromHex("80")),
        [{}, 1],
    );
});

test("fail to decode non-boolean value into boolean", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBoolean(fromHex("81 00 a1 01"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBoolean(fromHex("81 00 c4 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBoolean(fromHex("81 00 00"));
    });
});

test("fail to decode missing field into boolean", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBoolean(fromHex("80"));
    });
});

test("fail to decode missing field into nullable boolean", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableBoolean(fromHex("80"));
    });
});

test("fail to decode null into boolean", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBoolean(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional boolean", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalBoolean(fromHex("81 00 c0"));
    });
});
