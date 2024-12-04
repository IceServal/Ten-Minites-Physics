class Band
{
    constructor()
    {
        this.line = new Line();
        this.thickness = 0.0;

        this.area = 0.0;
    }

    static from(line, thickness)
    {
        let result = new Rod();
        result.line.copy(line);
        result.thickness = thickness;
        result._update_area();
        return result;
    }

    clone()
    {
        let result = new Band().copy(this);
        return result;
    }

    copy(a)
    {
        this.line.copy(a.line);
        this.thickness = a.thickness;
        this.area = a.area;
        return this;
    }

    set_line(line)
    {
        this.line.copy(line);
        this._update_area();
        return this;
    }

    set_thickness(thickness)
    {
        this.thickness = thickness;
        this._update_area();
        return this;
    }

    _update_area()
    {
        this.area = this.line.length * this.thickness * 2.0;
    }
};

