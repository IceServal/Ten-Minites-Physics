class Ball
{
    constructor()
    {
        this.radius = 0.5;
        this.density = 1.0;
        this.restitution = 0.1;

        this.mass = undefined;
        this.inverse_mass = undefined;
        this.#update_mass();

        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();

        this.color = 0xFF0000;

        this.bounds = undefined;

        this.mesh = undefined;
        this.#create_mesh();

        this.grabbed = false;
        this.last_grabbed_point = new THREE.Vector3();
    }

    static from(position, radius, density, color = 0xFF0000)
    {
        let result = new Ball();
        result.radius = radius;
        result.density = density;
        result.#update_mass();
        result.position.copy(position);
        result.color = color;
        result.#create_mesh();
        return result;
    }

    set_bounds(bounds)
    {
        let radius = this.radius;
        this.bounds = new THREE.Vector3(
            0.5 * bounds.x - radius,
            radius,
            0.5 * bounds.z - radius,
        );
    }

    apply_water_force(force)
    {
        this.acceleration.addScaledVector(force, this.inverse_mass);
        this.velocity.multiplyScalar(0.999);
    }

    apply_acceleration(acceleration)
    {
        this.acceleration.add(acceleration);
    }

    collide_with(a)
    {
        let mass_sum = this.mass + a.mass;
        if (mass_sum <= 0.0) return;

        let min_distance = this.radius + a.radius;
        let direction = new THREE.Vector3().subVectors(a.position, this.position);
        let distance = direction.length();
        if (distance <= 0.0 || distance > min_distance) return;

        direction.divideScalar(distance);
        let position_correction = (min_distance - distance) / mass_sum;
        this.position.addScaledVector(direction, -a.mass * position_correction);
        a.position.addScaledVector(direction, this.mass * position_correction);

        let normal_velocity_0 = this.velocity.dot(direction);
        let normal_velocity_1 = a.velocity.dot(direction);
        let momentum_sum = this.mass * normal_velocity_0 + a.mass * normal_velocity_1;
        let restitution = Math.min(this.restitution, a.restitution);
        let velocity_correction_0 = (momentum_sum - a.mass * (normal_velocity_0 - normal_velocity_1) * restitution) / mass_sum;
        let velocity_correction_1 = (momentum_sum - this.mass * (normal_velocity_1 - normal_velocity_0) * restitution) / mass_sum;
        this.velocity.addScaledVector(direction, velocity_correction_0 - normal_velocity_0);
        a.velocity.addScaledVector(direction, velocity_correction_1 - normal_velocity_1);
    }

    update(delta_time)
    {
        if (!this.grabbed) {
            let position = this.position;
            let velocity = this.velocity;
            velocity.addScaledVector(this.acceleration, delta_time);
            position.addScaledVector(velocity, delta_time);

            this.#boundary_check();

            this.mesh.position.copy(position);
            this.mesh.geometry.computeBoundingSphere();
        }

        this.acceleration.set(0.0, 0.0, 0.0);
    }

    add_to(scene)
    {
        scene.add(this.mesh);
    }

    grab(position, velocity)
    {
        this.grabbed = true;

        this.last_grabbed_point.set(position.x(0), position.y(0), position.z(0));
        this.velocity.set(velocity.x(0), velocity.y(0), velocity.z(0));
    }

    move(position, velocity)
    {
        if (!this.grabbed) return;

        let last_grabbed_point = this.last_grabbed_point;
        let offset = new THREE.Vector3(
            position.x(0) - last_grabbed_point.x,
            position.y(0) - last_grabbed_point.y,
            position.z(0) - last_grabbed_point.z,
        );
        this.position.add(offset);
        last_grabbed_point.set(position.x(0), position.y(0), position.z(0));
        this.velocity.set(velocity.x(0), velocity.y(0), velocity.z(0));
        this.#boundary_check();
        this.mesh.position.copy(this.position);
    }

    drop(position, velocity)
    {
        if (!this.grabbed) return;

        let last_grabbed_point = this.last_grabbed_point;
        let offset = new THREE.Vector3(
            position.x(0) - last_grabbed_point.x,
            position.y(0) - last_grabbed_point.y,
            position.z(0) - last_grabbed_point.z,
        );
        this.position.add(offset);
        last_grabbed_point.set(0.0, 0.0, 0.0);
        this.velocity.set(velocity.x(0), velocity.y(0), velocity.z(0));
        this.#boundary_check();
        this.mesh.position.copy(this.position);

        this.grabbed = false;
    }

    #update_mass()
    {
        let radius = this.radius;
        let density = this.density;
        this.mass = (4.0 / 3.0) * Math.PI * radius * radius * radius * density;
        this.inverse_mass = 1.0 / this.mass;
    }

    #create_mesh()
    {
        let geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        let material = new THREE.MeshPhongMaterial({color: this.color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        mesh.userData = this;
        mesh.layers.enable(1);
        this.mesh = mesh;
    }

    #boundary_check()
    {
        let bounds = this.bounds;
        if (bounds == undefined) return;

        let position = this.position;
        let velocity = this.velocity;
        let restitution = this.restitution;

        if (position.x < -bounds.x) {
            position.x = -bounds.x;
            velocity.x = +Math.abs(velocity.x) * restitution;
        }
        if (position.x > +bounds.x) {
            position.x = +bounds.x;
            velocity.x = -Math.abs(velocity.x) * restitution;
        }

        if (position.y < bounds.y) {
            position.y = bounds.y;
            velocity.y = Math.abs(velocity.y) * restitution;
        }

        if (position.z < -bounds.z) {
            position.z = -bounds.z;
            velocity.z = +Math.abs(velocity.z) * restitution;
        }
        if (position.z > +bounds.z) {
            position.z = +bounds.z;
            velocity.z = -Math.abs(velocity.z) * restitution;
        }
    }
}

