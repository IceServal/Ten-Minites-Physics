var ifs_store;
if (ifs_store == undefined) {
    ifs_store = {};
}

ifs_store.sierpinski_triangle = [
    {
        color: {
            value: [255, 255, 0, 255],
            weight: 0.33,
        },
        probability: 0.33,
        transformation: Matrix3x3.from_components(
            0.50 , 0.00 , 0.00,
            0.00 , 0.50 , 0.00,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [0, 255, 255, 255],
            weight: 0.33,
        },
        probability: 0.33,
        transformation: Matrix3x3.from_components(
            0.50 , 0.00 , 0.50,
            0.00 , 0.50 , 0.00,
            0.00 , 0.00 , 1.00,
        ),
    },
    {
        color: {
            value: [255, 0, 255, 255],
            weight: 0.34,
        },
        probability: 0.34,
        transformation: Matrix3x3.from_components(
            0.50 , 0.00 , 0.00,
            0.00 , 0.50 , 0.50,
            0.00 , 0.00 , 1.00,
        ),
    },
];

