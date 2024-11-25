function value_to_sci_color(value, min, max)
{
    value = Math.min(Math.max(value, min), max);
    let range = max - min;
    let normalized_value = (range == 0.0 ? 0.5 : (value - min) / range);
    let discretized_value = normalized_value / 0.25;
    let level = Math.floor(discretized_value);
    let score = discretized_value - level;

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    switch (level) {
        case 0: r = 0.0;   g = score;       b = 1.0;         break;
        case 1: r = 0.0;   g = 1.0;         b = 1.0 - score; break;
        case 2: r = score; g = 1.0;         b = 0.0;         break;
        case 3: r = 1.0;   g = 1.0 - score; b = 0.0;         break;
        case 4: r = 1.0;   g = 0.0;         b = 0.0;         break;
        default: console.log("Bad sci color conversion: (", value, ", ", min, ", ", max, ")");
    }

    return [255 * r, 255 * g, 255 * b, 255];
}

function value_to_thermal_color(a)
{
    a = Math.min(Math.max(a, 0.0), 1.0);

    let r = 0.0;
    let g = 0.0;
    let b = 0.0;
    if (false) {}
    else if (a < 0.3) {
        r = 0.2 * a / 0.3;
        g = r;
        b = r;
    }
    else if (a < 0.5) {
        r = 0.2 + 0.8 * (a - 0.3) / 0.2;
        g = 0.1;
        b = 0.1;
    }
    else {
        r = 1.0;
        g = (a - 0.5) / 0.48;
        b = 0.0;
    }

    return [255 * r, 255 * g, 255 * b, 255];
}

function array_color_to_string(a)
{
    let result = "#";
    let index = 0;
    for (; index < Math.min(a.length, 4); index++) {
        result += Math.round(Math.min(Math.max(a[index], 0.0), 255.0)).toString(16);
    }
    for (; index < 4; index++) {
        result += "00";
    }
    return result;
}

