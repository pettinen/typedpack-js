import test from "ava";

import { Encode, TypedpackDecodeInternal, Types } from "./fixtures/types.js";
import { fromHex, toHex } from "./helpers/hex.js";

test("encode enum", (t) => {
    t.is(toHex(Encode.TestEnum(Types.TestEnum.A)), "00");
    t.is(toHex(Encode.TestEnum(Types.TestEnum.B)), "01");
    t.is(toHex(Encode.TestEnum(Types.TestEnum.C)), "7f");
});

test("decode enum", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestEnum(fromHex("00")), [
        Types.TestEnum.A,
        1,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestEnum(fromHex("01")), [
        Types.TestEnum.B,
        1,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestEnum(fromHex("7f")), [
        Types.TestEnum.C,
        1,
    ]);

    t.throws(() => {
        TypedpackDecodeInternal.TestEnum(fromHex("02"));
    });
});

test("encode enum in struct", (t) => {
    t.is(toHex(Encode.TestEnumInStruct({ x: Types.TestEnum.A })), "81 00 00");
    t.is(toHex(Encode.TestEnumInStruct({ x: Types.TestEnum.C })), "81 00 7f");
});

test("decode enum in struct", (t) => {
    t.deepEqual(TypedpackDecodeInternal.TestEnumInStruct(fromHex("81 00 00")), [
        { x: Types.TestEnum.A },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestEnumInStruct(fromHex("81 00 01")), [
        { x: Types.TestEnum.B },
        3,
    ]);
    t.deepEqual(TypedpackDecodeInternal.TestEnumInStruct(fromHex("81 00 7f")), [
        { x: Types.TestEnum.C },
        3,
    ]);

    t.throws(() => {
        TypedpackDecodeInternal.TestEnumInStruct(fromHex("00"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestEnumInStruct(fromHex("80"));
    });
    t.throws(() => {
        TypedpackDecodeInternal.TestEnumInStruct(fromHex("81 00 02"));
    });
});

test("encode tagged enum", (t) => {
    t.is(
        toHex(Encode.TestTaggedEnum([Types.TestTaggedEnum.A, { x: true }])),
        "92 00 81 00 c3",
    );
    t.is(
        toHex(Encode.TestTaggedEnum([Types.TestTaggedEnum.B, { x: 127 }])),
        "92 01 81 00 7f",
    );
});

test("decode tagged enum", (t) => {
    t.deepEqual(
        TypedpackDecodeInternal.TestTaggedEnum(fromHex("92 00 81 00 c3")),
        [[Types.TestTaggedEnum.A, { x: true }], 5],
    );
    t.deepEqual(
        TypedpackDecodeInternal.TestTaggedEnum(fromHex("92 01 81 00 7f")),
        [[Types.TestTaggedEnum.B, { x: 127 }], 5],
    );

    t.throws(() => {
        TypedpackDecodeInternal.TestTaggedEnum(fromHex("92 02 81 00 7f"));
    });
});
