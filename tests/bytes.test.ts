import test from "ava";

import { Encode, TypedpackDecodeInternal } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

const repeated = (value: number, n: number): ArrayBuffer =>
    new Uint8Array(new ArrayBuffer(n)).fill(value).buffer;

test("encode bytes", (t) => {
    t.is(toHex(Encode.TestBytes({ x: new ArrayBuffer(0) })), "81 00 c4 00");
    t.is(toHex(Encode.TestBytes({ x: new ArrayBuffer(1) })), "81 00 c4 01 00");
    t.is(
        toHex(Encode.TestBytes({ x: repeated(0x80, 255) })),
        "81 00 c4 ff" + " 80".repeat(255),
    );
    t.is(
        toHex(Encode.TestBytes({ x: repeated(0xff, 256) })),
        "81 00 c5 01 00" + " ff".repeat(256),
    );
    t.is(
        toHex(Encode.TestBytes({ x: new ArrayBuffer(65_535) })),
        "81 00 c5 ff ff" + " 00".repeat(65_535),
    );
    t.is(
        toHex(Encode.TestBytes({ x: repeated(0x01, 65_536) })),
        "81 00 c6 00 01 00 00" + " 01".repeat(65_536),
    );
});

test("decode bytes", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestBytes(fromHex("81 00 c4 00")), [
        { x: new ArrayBuffer() },
        4,
    ]); // TODO ArrayBuffer(0)
    t.deepEqual(TypedpackDecodeInternal.TestBytes(fromHex("81 00 c4 01 00")), [
        { x: new ArrayBuffer(1) },
        5,
    ]);
    t.deepEqual(
        TypedpackDecodeInternal.TestBytes(
            fromHex("81 00 c4 ff" + " ff".repeat(255)),
        ),
        [{ x: repeated(0xff, 255) }, 259],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestBytes(
            fromHex("81 00 c5 01 00" + " 80".repeat(256)),
        ),
        [{ x: repeated(0x80, 256) }, 261],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestBytes(
            fromHex("81 00 c5 ff ff" + " 01".repeat(65_535)),
        ),
        [{ x: repeated(0x01, 65_535) }, 65_540],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestBytes(
            fromHex("81 00 c6 00 01 00 00" + " 00".repeat(65_536)),
        ),
        [{ x: new ArrayBuffer(65_536) }, 65_543],
    );
});

test("encode optional bytes", (t) => {
    t.is(
        toHex(Encode.TestOptionalBytes({ x: new ArrayBuffer() })),
        "81 00 c4 00",
    );
    t.is(toHex(Encode.TestOptionalBytes({})), "80");
});

test("decode optional bytes", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalBytes(fromHex("81 00 c4 00")),
        [{ x: new ArrayBuffer() }, 4],
    );
    t.deepEqual(TypedpackDecodeInternal.TestOptionalBytes(fromHex("80")), [
        {},
        1,
    ]);
});

test("encode nullable bytes", (t) => {
    t.is(
        toHex(Encode.TestNullableBytes({ x: new ArrayBuffer() })),
        "81 00 c4 00",
    );
    t.is(toHex(Encode.TestNullableBytes({ x: null })), "81 00 c0");
});

test("decode nullable bytes", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableBytes(fromHex("81 00 c4 00")),
        [{ x: new ArrayBuffer() }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestNullableBytes(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
});

test("encode optional nullable bytes", (t) => {
    t.is(
        toHex(Encode.TestOptionalNullableBytes({ x: new ArrayBuffer() })),
        "81 00 c4 00",
    );
    t.is(toHex(Encode.TestOptionalNullableBytes({ x: null })), "81 00 c0");
    t.is(toHex(Encode.TestOptionalNullableBytes({})), "80");
});

test("decode optional nullable bytes", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBytes(
            fromHex("81 00 c4 00"),
        ),
        [{ x: new ArrayBuffer() }, 4],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBytes(fromHex("81 00 c0")),
        [{ x: null }, 3],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestOptionalNullableBytes(fromHex("80")),
        [{}, 1],
    );
});

test("fail to decode non-bytes value into bytes", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 ff"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 ca 00 00 00 00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(
            fromHex("81 00 cf 00 00 00 01 00 00 00 00"),
        );
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 c2"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 61"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 a0"));
    });
});

test("fail to decode missing field into bytes", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("80"));
    });
});

test("fail to decode missing field into nullable bytes", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestNullableBytes(fromHex("80"));
    });
});

test("fail to decode null into bytes", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestBytes(fromHex("81 00 c0"));
    });
});

test("fail to decode null into optional bytes", (t) => {
    t.throws(() => {
        TypedpackDecodeInternal.TestOptionalBytes(fromHex("81 00 c0"));
    });
});
