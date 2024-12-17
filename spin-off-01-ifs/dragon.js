var ifs_store;
if (ifs_store == undefined) {
    ifs_store = {};
}

ifs_store.dragon = [
    {
        color: {
            value: [255, 69, 0, 255],
            weight: 0.5,
        },
        probability: 0.5,
        transformation: Matrix3x3.from_components(
            0.500124, 0.499725, -0.250062,
            -0.499725, 0.500124, 0.249863,
            0.000000, 0.000000, 1.000000,
        ),
    },
    {
        color: {
            value: [128, 0, 128, 255],
            weight: 0.5,
        },
        probability: 0.5,
        transformation: Matrix3x3.from_components(
            -0.499327, 0.500521, 0.749664,
            -0.500521, -0.499327, 0.750261,
            0.000000, 0.000000, 1.000000,
        ),
    },
];

