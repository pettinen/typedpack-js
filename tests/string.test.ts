import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode string", (t) => {
    t.is(toHex(Encode.TestString({ x: "" })), "81 00 a0");
    t.is(toHex(Encode.TestString({ x: "a" })), "81 00 a1 61");
    t.is(toHex(Encode.TestString({ x: "\x00" })), "81 00 a1 00");
    t.is(toHex(Encode.TestString({ x: "a\x00b" })), "81 00 a3 61 00 62");
    t.is(
        toHex(Encode.TestString({ x: "a".repeat(31) })),
        "81 00 bf" + " 61".repeat(31),
    );
    t.is(
        toHex(Encode.TestString({ x: "\u00E4".repeat(16) })),
        "81 00 d9 20" + " c3 a4".repeat(16),
    );
    t.is(
        toHex(Encode.TestString({ x: "a".repeat(255) })),
        "81 00 d9 ff" + " 61".repeat(255),
    );
    t.is(
        toHex(Encode.TestString({ x: "a".repeat(256) })),
        "81 00 da 01 00" + " 61".repeat(256),
    );
    t.is(
        toHex(Encode.TestString({ x: "a".repeat(65_535) })),
        "81 00 da ff ff" + " 61".repeat(65_535),
    );
    t.is(
        toHex(Encode.TestString({ x: "a".repeat(65_536) })),
        "81 00 db 00 01 00 00" + " 61".repeat(65_536),
    );
    t.is(toHex(Encode.TestString({ x: "\u{1F4A9}" })), "81 00 a4 f0 9f 92 a9");
});

test("decode string", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestString(fromHex("81 00 a0")), [
        { x: "" },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestString(fromHex("81 00 a1 61")), [
        { x: "a" },
        4,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestString(fromHex("81 00 a1 00")), [
        { x: "\x00" },
        4,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestString(fromHex("81 00 a3 61 00 62")),
        [{ x: "a\x00b" }, 6],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 bf" + " 61".repeat(31)),
        ),
        [{ x: "a".repeat(31) }, 34],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 d9 20" + " c3 a4".repeat(16)),
        ),
        [{ x: "\u00E4".repeat(16) }, 36],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 d9 ff" + " 61".repeat(255)),
        ),
        [{ x: "a".repeat(255) }, 259],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 da 01 00" + " 61".repeat(256)),
        ),
        [{ x: "a".repeat(256) }, 261],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 da ff ff" + " 61".repeat(65_535)),
        ),
        [{ x: "a".repeat(65_535) }, 65_540],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 db 00 01 00 00" + " 61".repeat(65_536)),
        ),
        [{ x: "a".repeat(65_536) }, 65_543],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestString(fromHex("81 00 a4 f0 9f 92 a9")),
        [{ x: "\u{1F4A9}" }, 7],
    );
});

test("encode optional string", (t) => {
    t.is(toHex(Encode.TestOptionalString({ x: "" })), "81 00 a0");
    t.is(toHex(Encode.TestOptionalString({})), "80");
});

test("decode optional string", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalString(fromHex("81 00 a0")),
        [{ x: "" }, 3],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalString(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable string", (t) => {
    t.is(toHex(Encode.TestNullableString({ x: "" })), "81 00 a0");
    t.is(toHex(Encode.TestNullableString({ x: null })), "81 00 c0");
});

test("decode nullable string", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableString(fromHex("81 00 a0")),
        [{ x: "" }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableString(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable string", (t) => {
    t.is(toHex(Encode.TestOptionalNullableString({ x: "" })), "81 00 a0");
    t.is(toHex(Encode.TestOptionalNullableString({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableString({})), "80");
});

test("decode optional nullable string", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableString(fromHex("81 00 a0")),
        [{ x: "" }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableString(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableString(fromHex("80")),
        [{}, 1],
    );
});

test("fail to decode non-string value into string", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 ca 00 00 00 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestString(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 61"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into string", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("80"));
    });
});

test("fail to decode missing field into nullable string", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableString(fromHex("80"));
    });
});

test("fail to decode null into string", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestString(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional string", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalString(fromHex("81 00 c0"));
    });
});
