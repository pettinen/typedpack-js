import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode multiple fields", (t) => {
    t.is(
        toHex(Encode.TestMultipleFields({ foo: true, bar: 15 })),
        "82 00 c3 01 0f",
    );
    t.is(
        toHex(
            Encode.TestMultipleNonConsecutiveFields({ foo: false, bar: 127 }),
        ),
        "82 40 c2 7f 7f",
    );
    t.is(
        toHex(Encode.TestMultipleNonConsecutiveFields({ bar: 0 })),
        "81 7f 00",
    );
});

test("decode multiple fields", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestMultipleFields(fromHex("82 00 c3 01 0f")),
        [{ foo: true, bar: 15 }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestMultipleNonConsecutiveFields(
            fromHex("82 40 c2 7f 7f"),
        ),
        [{ foo: false, bar: 127 }, 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestMultipleNonConsecutiveFields(
            fromHex("81 7f 00"),
        ),
        [{ bar: 0 }, 3],
    );
});

test("encode nested struct", (t) => {
    t.is(toHex(Encode.TestNestedStruct({ x: { x: true } })), "81 00 81 00 c3");
});

test("decode nested struct", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNestedStruct(fromHex("81 00 81 00 c3")),
        [{ x: { x: true } }, 5],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestNestedStruct(fromHex("81 00 c3"));
    });
});

test("encode empty struct", (t) => {
    t.is(toHex(Encode.TestEmptyStruct({})), "80");
});

test("decode empty struct", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestEmptyStruct(fromHex("80")), [
        {},
        1,
    ]);
});
