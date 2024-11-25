class Swirl
{
    constructor()
    {
    }

    static from()
    {
    }

    update(delta_time)
    {
    }

    render(canvas)
    {
    }
};

class Band_Emitter
{
    constructor()
    {
        type = "band";

        this.band = Band.from(Line.from_point0_point1(Vector2.from_components(), Vector2.from_components()), 0.0);
        this.probability = 0.0;
        this.temperature = 0.0;

        this.color = "#00000000";
        this.thickness = 0.0;
    }

    static from(point_0, point_1, probability, temperature)
    {
        let result = new Band_Emitter();
        result.thickness = 0.01;
        result.band = Band.from(Line.from_point0_point1(point_0, point_1), result.thickness);
        result.probability = probability;
        result.temperature = temperature;
        result.color = array_color_to_string(value_to_thermal_color(result.temperature));
        return result;
    }

    create_swirl()
    {
    }

    render(canvas)
    {
        canvas.render_band(this.band, this.color);
    }

    try_to_select(cursor_position)
    {
    }
};

class Circle_Emitter
{
    constructor()
    {
        type = "circle";

        this.circle = Circle.from(Vector2.from_components(), 0.0);
        this.probability = 0.0;
        this.temperature = 0.0;

        this.edge_width = 0.0;
        this.edge_color = "#00000000";
    }

    static from(center, radius, probability, temperature)
    {
        let result = new Circle_Emitter();
        result.circle = Circle.from(center, radius);
        result.probability = probability;
        result.temperature = temperature;
        result.edge_width = 0.01;
        result.edge_color = array_color_to_string(value_to_thermal_color(result.temperature));
        return result;
    }

    create_swirl()
    {
    }

    render(canvas)
    {
        canvas.render_wireframe_circle(this.circle, this.edge_width, this.edge_color);
    }

    try_to_select(cursor_position)
    {
    }
};

