import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode int32", (t) => {
    t.is(toHex(Encode.TestInt32({ x: 0 })), "81 00 00");
    t.is(toHex(Encode.TestInt32({ x: -1 })), "81 00 ff");
    t.is(toHex(Encode.TestInt32({ x: 2_147_483_647 })), "81 00 ce 7f ff ff ff");
    t.is(
        toHex(Encode.TestInt32({ x: -2_147_483_648 })),
        "81 00 d2 80 00 00 00",
    );
});

test("decode int32", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestInt32(fromHex("81 00 00")), [
        { x: 0 },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestInt32(fromHex("81 00 ff")), [
        { x: -1 },
        3,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 ce 7f ff ff ff")),
        [{ x: 2_147_483_647 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 d2 7f ff ff ff")),
        [{ x: 2_147_483_647 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 d2 80 00 00 00")),
        [{ x: -2_147_483_648 }, 7],
    );
});

test("encode optional int32", (t) => {
    t.is(toHex(Encode.TestOptionalInt32({ x: 32_768 })), "81 00 cd 80 00");
    t.is(toHex(Encode.TestOptionalInt32({})), "80");
});

test("decode optional int32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalInt32(
            fromHex("81 00 d2 ff ff 7f ff"),
        ),
        [{ x: -32_769 }, 7],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalInt32(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable int32", (t) => {
    t.is(toHex(Encode.TestNullableInt32({ x: 1 })), "81 00 01");
    t.is(toHex(Encode.TestNullableInt32({ x: null })), "81 00 c0");
});

test("decode nullable int32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt32(fromHex("81 00 64")),
        [{ x: 100 }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableInt32(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable int32", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableInt32({ x: 65_535 })),
        "81 00 cd ff ff",
    );
    t.is(toHex(Encode.TestOptionalNullableInt32({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableInt32({})), "80");
});

test("decode optional nullable int32", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt32(
            fromHex("81 00 ce 00 01 00 00"),
        ),
        [{ x: 65_536 }, 7],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt32(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableInt32(fromHex("80")),
        [{}, 1],
    );
});

test("fail to encode non-int32 value into int32", (t) => {
    t.throws(() => {
        Encode.TestInt32({ x: -2_147_483_649 });
    });
    t.throws(() => {
        Encode.TestInt32({ x: 2_147_483_648 });
    });
    t.throws(() => {
        Encode.TestInt32({ x: 1.5 });
    });
    t.throws(() => {
        Encode.TestInt32({ x: NaN });
    });
    t.throws(() => {
        Encode.TestInt32({ x: Infinity });
    });
});

test("fail to decode non-int32 value into int32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(
            fromHex("81 00 cf 00 00 00 00 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(
            fromHex("81 00 cf 00 00 00 00 80 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(
            fromHex("81 00 d3 ff ff ff ff 7f ff ff ff"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 a1 31"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 c4 00"));
    });
});

test("fail to decode missing field into int32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(fromHex("80"));
    });
});

test("fail to decode missing field into nullable int32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableInt32(fromHex("80"));
    });
});

test("fail to decode null into int32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestInt32(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional int32", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalInt32(fromHex("81 00 c0"));
    });
});
