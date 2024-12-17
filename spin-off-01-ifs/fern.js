var ifs_store;
if (ifs_store == undefined) {
    ifs_store = {};
}

ifs_store.fern = [
    {
        color: {
            value: [184, 131, 11, 255],
            weight: 0.98,
        },
        probability: 0.03,
        transformation: Matrix3x3.from_components(
            0.000000, 0.000000, 0.500000,
            0.000000, 0.200000, 0.000000,
            0.000000, 0.000000, 1.000000,
        ),
    },
    {
        color: {
            value: [124, 252, 0, 255],
            weight: 0.02,
        },
        probability: 0.71,
        transformation: Matrix3x3.from_components(
            0.817377, 0.065530, 0.091311,
            -0.065530, 0.817377, 0.232765,
            0.000000, 0.000000, 1.000000,
        ),
    },
    {
        color: {
            value: [124, 252, 0, 255],
            weight: 0.02,
        },
        probability: 0.13,
        transformation: Matrix3x3.from_components(
            0.108707, -0.372816, 0.445646,
            0.279612, 0.144943, -0.059806,
            0.000000, 0.000000, 1.000000,
        ),
    },
    {
        color: {
            value: [124, 252, 0, 255],
            weight: 0.02,
        },
        probability: 0.13,
        transformation: Matrix3x3.from_components(
            -0.080250, 0.385423, 0.540125,
            0.289067, 0.107000, -0.004534,
            0.000000, 0.000000, 1.000000,
        ),
    },
];

