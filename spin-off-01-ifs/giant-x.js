var ifs_store;
if (ifs_store == undefined) {
    ifs_store = {};
}

ifs_store.giant_x = [
    {
        color: {
            value: [255, 255, 0, 255],
            weight: 0.2,
        },
        probability: 0.2,
        transformation: Matrix3x3.from_components(
            0.33 , 0.00 , 0.00,
            0.00 , 0.33 , 0.00,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [0, 255, 255, 255],
            weight: 0.2,
        },
        probability: 0.2,
        transformation: Matrix3x3.from_components(
            0.33 , 0.00 , 0.66,
            0.00 , 0.33 , 0.00,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [255, 255, 255, 255],
            weight: 0.2,
        },
        probability: 0.2,
        transformation: Matrix3x3.from_components(
            0.33 , 0.00 , 0.33,
            0.00 , 0.33 , 0.33,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [255, 0, 255, 255],
            weight: 0.2,
        },
        probability: 0.2,
        transformation: Matrix3x3.from_components(
            0.33 , 0.00 , 0.00,
            0.00 , 0.33 , 0.66,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [255, 255, 0, 255],
            weight: 0.2,
        },
        probability: 0.2,
        transformation: Matrix3x3.from_components(
            0.33 , 0.00 , 0.66,
            0.00 , 0.33 , 0.66,
            0.00 , 0.00 , 1.00,
        ),
    },
];

