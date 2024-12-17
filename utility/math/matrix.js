class Matrix3x3
{
    constructor()
    {
        this.data = new Float32Array(9);
    }

    static from_components(a11, a12, a13, a21, a22, a23, a31, a32, a33)
    {
        let result = new Matrix3x3();

        if (a12 == undefined) {
            a12 = 0.0;
            a13 = 0.0;
            a21 = 0.0;
            a22 = a11;
            a23 = 0.0;
            a31 = 0.0;
            a32 = 0.0;
            a33 = a11;
        }
        if (a21 == undefined) {
            a21 = 0.0;
            a22 = a12;
            a23 = 0.0;
            a31 = 0.0;
            a32 = 0.0;
            a33 = a13;
            a12 = 0.0;
            a13 = 0.0;
        }

        result.data[0] = (a11 == undefined ? 0.0 : a11);
        result.data[1] = (a12 == undefined ? 0.0 : a12);
        result.data[2] = (a13 == undefined ? 0.0 : a13);
        result.data[3] = (a21 == undefined ? 0.0 : a21);
        result.data[4] = (a22 == undefined ? 0.0 : a22);
        result.data[5] = (a23 == undefined ? 0.0 : a23);
        result.data[6] = (a31 == undefined ? 0.0 : a31);
        result.data[7] = (a32 == undefined ? 0.0 : a32);
        result.data[8] = (a33 == undefined ? 0.0 : a33);

        return result;
    }

    static from_array(array)
    {
        let result = new Matrix3x3();
        switch (array.length) {
            case 1: {
                result.data[0] = array[0];
                result.data[4] = array[0];
                result.data[8] = array[0];
            }
            case 3: {
                result.data[0] = array[0];
                result.data[4] = array[1];
                result.data[8] = array[2];
            }
            default: {
                let length = Math.min(array.length, 9);
                for (let i = 0; i < length; i++) {
                    result.data[i] = (array[i] == undefined ? 0.0 : array[i]);
                }
            }
        }

        return result;
    }

    clone()
    {
        return new Matrix3x3().copy(this);
    }

    copy(a)
    {
        this.data = a.data.slice();

        return this;
    }

    clear()
    {
        this.data.fill(0.0);

        return this;
    }

    scale(scaling)
    {
        for (let i = 0; i < 9; i++) {
            this.data[i] *= scaling;
        }

        return this;
    }

    assign_sum_of(a, b)
    {
        for (let i = 0; i < 9; i++) {
            this.data[i] = a.data[i] + b.data[i];
        }

        return this;
    }

    assign_difference_of(a, b)
    {
        for (let i = 0; i < 9; i++) {
            this.data[i] = a.data[i] - b.data[i];
        }

        return this;
    }

    add(a, scaling = 1.0)
    {
        for (let i = 0; i < 9; i++) {
            this.data[i] += a.data[i] * scaling;
        }

        return this;
    }

    subtract(a, scaling = 1.0)
    {
        for (let i = 0; i < 9; i++) {
            this.data[i] -= a.data[i] * scaling;
        }

        return this;
    }

    left_multiply(matrix)
    {
        let a_data = this.data;
        let b_data = matrix.data;

        let a11 = a_data[0];
        let a12 = a_data[1];
        let a13 = a_data[2];
        let a21 = a_data[3];
        let a22 = a_data[4];
        let a23 = a_data[5];
        let a31 = a_data[6];
        let a32 = a_data[7];
        let a33 = a_data[8];
        let b11 = b_data[0];
        let b12 = b_data[1];
        let b13 = b_data[2];
        let b21 = b_data[3];
        let b22 = b_data[4];
        let b23 = b_data[5];
        let b31 = b_data[6];
        let b32 = b_data[7];
        let b33 = b_data[8];
        a_data[0] = b11 * a11 + b12 * a21 + b13 * a31;
        a_data[1] = b11 * a12 + b12 * a22 + b13 * a32;
        a_data[2] = b11 * a13 + b12 * a23 + b13 * a33;
        a_data[3] = b21 * a11 + b22 * a21 + b23 * a31;
        a_data[4] = b21 * a12 + b22 * a22 + b23 * a32;
        a_data[5] = b21 * a13 + b22 * a23 + b23 * a33;
        a_data[6] = b31 * a11 + b32 * a21 + b33 * a31;
        a_data[7] = b31 * a12 + b32 * a22 + b33 * a32;
        a_data[8] = b31 * a13 + b32 * a23 + b33 * a33;

        return this;
    }

    transform(vector)
    {
        let result = Vector2.from_components();

        let data = this.data;

        let a11 = data[0];
        let a12 = data[1];
        let a13 = data[2];
        let a21 = data[3];
        let a22 = data[4];
        let a23 = data[5];
        let a31 = data[6];
        let a32 = data[7];
        let a33 = data[8];

        result.x = a11 * vector.x + a12 * vector.y + a13;
        result.y = a21 * vector.x + a22 * vector.y + a23;
        let z = a31 * vector.x + a32 * vector.y + a33;
        result.scale(1.0 / z);

        return result;
    }

    transpose()
    {
        let data = this.data;

        let a12 = data[1];
        let a13 = data[2];
        let a21 = data[3];
        let a23 = data[5];
        let a31 = data[6];
        let a32 = data[7];
        data[1] = a21;
        data[2] = a31;
        data[3] = a12;
        data[5] = a32;
        data[6] = a13;
        data[7] = a23;

        return this;
    }

    determinant()
    {
        let data = this.data;

        let a11 = data[0];
        let a12 = data[1];
        let a13 = data[2];
        let a21 = data[3];
        let a22 = data[4];
        let a23 = data[5];
        let a31 = data[6];
        let a32 = data[7];
        let a33 = data[8];

        return a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);
    }

    inverse()
    {
        let determinant = this.determinant();
        if (determinant == 0.0) {
            this.clear();
            return this;
        }

        let data = this.data;

        let a11 = data[0];
        let a12 = data[1];
        let a13 = data[2];
        let a21 = data[3];
        let a22 = data[4];
        let a23 = data[5];
        let a31 = data[6];
        let a32 = data[7];
        let a33 = data[8];
        this.data[0] = +(a22 * a33 - a23 * a32);
        this.data[1] = -(a12 * a33 - a13 * a32);
        this.data[2] = +(a12 * a23 - a13 * a22);
        this.data[3] = -(a21 * a33 - a23 * a31);
        this.data[4] = +(a11 * a33 - a13 * a31);
        this.data[5] = -(a11 * a23 - a13 * a21);
        this.data[6] = +(a21 * a32 - a22 * a31);
        this.data[7] = -(a11 * a32 - a12 * a31);
        this.data[8] = +(a11 * a22 - a12 * a21);

        this.scale(1.0 / determinant);

        return this;
    }
};

