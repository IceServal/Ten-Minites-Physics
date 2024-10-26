class Water_Config
{
    constructor()
    {
        this.size = new THREE.Vector3();
        this.spacing = 0.0;

        this.wave_speed = 2.0;
        this.position_damping = 1.0;
        this.velocity_damping = 0.3;
        this.displacement_damping = 0.5;

        this.smooth_step = 2;
    }
};

class Water
{
    constructor()
    {
        this.size = new THREE.Vector3();
        this.height = 0.0;
        this.spacing = 0.0;
        this.position_damping = 0.0;
        this.velocity_damping = 0.0;
        this.displacement_damping = 0.0;

        this.smooth_step = 0;

        this.grid_size = new THREE.Vector2();
        this.num_grids = 0.0;
        this.num_vertices = 0.0;

        this.heights = new Float32Array();
        this.velocities = new Float32Array();
        this.displacements = new Float32Array();

        this.mesh = new THREE.Mesh();

        this.grid_scratch = new Float32Array();
        this.vertex_scratch = new Float32Array();
    }

    static from(config)
    {
        let result = new Water();
        result.size = config.size.clone();
        result.height = result.size.y;
        result.spacing = config.spacing;
        result.wave_speed = config.wave_speed;
        result.position_damping = config.position_damping;
        result.velocity_damping = config.velocity_damping;
        result.displacement_damping = config.displacement_damping;

        result.smooth_step = config.smooth_step;

        result.grid_size = new THREE.Vector2(
            Math.floor(result.size.x / config.spacing),
            Math.floor(result.size.z / config.spacing),
        );
        if (
            false
            || result.grid_size.x * config.spacing != result.size.x
            || result.grid_size.y * config.spacing != result.size.z
        ) {
            console.log("Water grids can not fit water size perfectly!");
        }

        result.num_grids = result.grid_size.x * result.grid_size.y;
        result.num_vertices = (result.grid_size.x + 1) * (result.grid_size.y + 1);

        result.heights = new Float32Array(result.num_grids);
        result.velocities = new Float32Array(result.num_grids);
        result.displacements = new Float32Array(result.num_grids);
        result.heights.fill(result.height);
        result.velocities.fill(0.0);
        result.displacements.fill(0.0);

        result.grid_scratch = new Float32Array(result.num_grids);
        result.vertex_scratch = new Float32Array(result.num_vertices);

        {
            let num_grids = result.num_grids;
            let num_vertices = result.num_vertices;
            let grid_size = result.grid_size;
            let positions = new Float32Array(num_vertices * 3);
            let uvs = new Float32Array(num_vertices * 2);
            let origin_position = result.#grid_position(0, 0, new THREE.Vector2());
            let spacing = result.spacing;
            let k = 0;
            let l = 0;
            let height = result.size.y;
            for (let j = 0; j <= grid_size.y; j++) {
                let origin_position_x = origin_position.x;
                for (let i = 0; i <= grid_size.x; i++) {
                    positions[k++] = origin_position_x;
                    positions[k++] = height;
                    positions[k++] = origin_position.y;

                    uvs[l++] = i / grid_size.x;
                    uvs[l++] = j / grid_size.y;

                    origin_position_x += spacing;
                }
                origin_position.y += spacing;
            }

            let indices = new Uint32Array(num_grids * 2 * 3);
            let m = 0;
            for (let j = 0; j < grid_size.y; j++) {
                let index_base = j * (grid_size.x + 1);
                for (let i = 0; i < grid_size.x; i++) {
                    let index_00 = index_base++;
                    let index_10 = index_00 + 1;
                    let index_01 = index_00 + (grid_size.x + 1);
                    let index_11 = index_01 + 1;
                    indices[m++] = index_00;
                    indices[m++] = index_01;
                    indices[m++] = index_11;
                    indices[m++] = index_00;
                    indices[m++] = index_11;
                    indices[m++] = index_10;
                }
            }

            let geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            let material = new THREE.ShaderMaterial(
                {
                    uniforms: {
                        background: {
                            value: framebuffer.texture,
                        },
                    },
                    vertexShader: document.getElementById("water-vertex-shader").textContent,
                    fragmentShader: document.getElementById("water-fragment-shader").textContent,
                },
            );
            result.mesh = new THREE.Mesh(geometry, material);
            result.#update_mesh();
        }

        return result;
    }

    add_to(scene)
    {
        scene.add(this.mesh);
    }

    enable_rendering(enable)
    {
        this.mesh.visible = enable;
    }

    interact_with_balls(balls, gravity)
    {
        let displacements = this.displacements;
        let old_displacements = this.grid_scratch;
        old_displacements.set(displacements);
        displacements.fill(0.0);

        let spacing = this.spacing;
        let heights = this.heights;
        let grid_size = this.grid_size;
        let area_force = -1.0 * spacing * spacing * gravity;
        let force = new THREE.Vector3();
        for (let b = 0; b < balls.length; b++) {
            let ball = balls[b];
            let radius = ball.radius;
            let center = ball.position;
            let grid_index = this.#grid_index_range(new THREE.Vector2(center.x, center.z), radius);
            for (let i = grid_index.x; i < grid_index.z; i++) {
                for (let j = grid_index.y; j < grid_index.w; j++) {
                    let grid_position = this.#grid_position(i, j);
                    let relative_x = grid_position.x - center.x;
                    let relative_z = grid_position.y - center.z;
                    let tangent_radius_squared = radius * radius - relative_x * relative_x - relative_z * relative_z;
                    if (tangent_radius_squared <= 0.0) continue;

                    let tangent_radius = Math.sqrt(tangent_radius_squared);
                    let top = center.y + tangent_radius;
                    let bottom = center.y - tangent_radius;
                    let index = i + j * grid_size.x;
                    let height = heights[index];
                    let displacement = (height > top ? 2.0 * tangent_radius : height - bottom);
                    if (displacement <= 0.0) continue;

                    displacements[index] += displacement;
                    force.set(0.0, displacement * area_force, 0.0);
                    ball.apply_water_force(force);
                }
            }
        }
        let x = grid_size.x;
        let y = grid_size.y;
        let smooth_step = this.smooth_step;
        for (let s = 0; s < smooth_step; s++) {
            if (s % 2) {
                for (let i = 0; i < x; i++) {
                    for (let j = 0; j < y; j++) {
                        let sum = 0.0;
                        let count = 0;
                        let index = i + j * x;
                        if (i != 0) {
                            sum += displacements[index - 1];
                            count++;
                        }
                        if (i != x - 1) {
                            sum += displacements[index + 1];
                            count++;
                        }
                        if (j != 0) {
                            sum += displacements[index - x];
                            count++;
                        }
                        if (j != y - 1) {
                            sum += displacements[index + x];
                            count++;
                        }
                        displacements[index] = sum / count;
                    }
                }
            } else {
                for (let i = x - 1; i >= 0; i--) {
                    for (let j = y - 1; j >= 0; j--) {
                        let sum = 0.0;
                        let count = 0;
                        let index = i + j * x;
                        if (i != 0) {
                            sum += displacements[index - 1];
                            count++;
                        }
                        if (i != x - 1) {
                            sum += displacements[index + 1];
                            count++;
                        }
                        if (j != 0) {
                            sum += displacements[index - x];
                            count++;
                        }
                        if (j != y - 1) {
                            sum += displacements[index + x];
                            count++;
                        }
                        displacements[index] = sum / count;
                    }
                }
            }
        }
        let displacement_damping = this.displacement_damping;
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {
                let index = i + j * x;
                let delta = displacements[index] - old_displacements[index];
                heights[index] += displacement_damping * delta;
            }
        }
    }

    update_surface(delta_time)
    {
        let heights = this.heights;
        let old_heights = this.grid_scratch;
        old_heights.set(heights);

        let grid_size = this.grid_size;
        let velocities = this.velocities;
        let position_damping = this.position_damping;
        let velocity_damping = this.velocity_damping;
        let position_factor = Math.min(position_damping * delta_time, 1.0);
        let velocity_factor = Math.max(0.0, 1.0 - velocity_damping * delta_time);
        let spacing = this.spacing;
        let wave_speed = Math.min(this.wave_speed, 0.5 * spacing / delta_time);
        let acceleration_factor = wave_speed * wave_speed / spacing / spacing;
        let x = grid_size.x;
        let y = grid_size.y;
        for (let i = 0; i < x; i++) {
            let plus_i = Math.min(i + 1, x - 1);
            let minus_i = Math.max(i - 1, 0);
            for (let j = 0; j < y; j++) {
                let plus_j = Math.min(j + 1, y - 1);
                let minus_j = Math.max(j - 1, 0);

                let index_mm = i + j * x;
                let index_lm = minus_i + j * x;
                let index_rm = plus_i + j * x;
                let index_mf = i + plus_j * x;
                let index_mb = i + minus_j * x;
                let gradient = 0.25 * (old_heights[index_lm] + old_heights[index_rm] + old_heights[index_mf] + old_heights[index_mb]) - old_heights[index_mm];

                let velocity = velocities[index_mm];
                let acceleration = acceleration_factor * 4.0 * gradient;
                velocity += acceleration * delta_time;
                velocity *= velocity_factor;
                velocities[index_mm] = velocity;

                heights[index_mm] += position_factor * gradient + velocity * delta_time;
            }
        }
        this.#update_mesh();
    }

    #grid_position(i, j, offset = new THREE.Vector2(0.5, 0.5))
    {
        let size = this.size;
        let spacing = this.spacing;
        let x_0 = -0.5 * size.x;
        let y_0 = -0.5 * size.z;
        return new THREE.Vector2(x_0 + (i + offset.x) * spacing, y_0 + (j + offset.y) * spacing);
    }

    #grid_index_range(center, radius)
    {
        let origin = this.#grid_position(0, 0);
        let spacing = this.spacing;
        let grid_size = this.grid_size;
        let min = new THREE.Vector2(0, 0);
        let max = new THREE.Vector2(grid_size.x - 1, grid_size.y - 1);
        let min_index = center.clone().subScalar(radius).sub(origin).divideScalar(spacing).floor().clamp(min, max);
        let max_index = center.clone().addScalar(radius).sub(origin).divideScalar(spacing).ceil().clamp(min, max);
        return new THREE.Vector4(min_index.x, min_index.y, max_index.x, max_index.y);
    }

    #update_mesh()
    {
        let heights = this.heights;
        let vertex_heights = this.vertex_scratch;
        let grid_size = this.grid_size;
        vertex_heights.fill(0.0);
        for (let j = 0; j < grid_size.y; j++) {
            let index_base_0 = j * grid_size.x;
            let index_base_1 = j * (grid_size.x + 1);
            for (let i = 0; i < grid_size.x; i++) {
                let index = index_base_0++;
                let average_height = 0.25 * heights[index];

                let index_00 = index_base_1++;
                let index_10 = index_00 + 1;
                let index_01 = index_00 + (grid_size.x + 1);
                let index_11 = index_01 + 1;

                vertex_heights[index_00] += average_height;
                vertex_heights[index_10] += average_height;
                vertex_heights[index_01] += average_height;
                vertex_heights[index_11] += average_height;
            }
        }
        let num_vertices = this.num_vertices;
        for (let i = 0; i <= grid_size.x; i++) {
            vertex_heights[i] *= 2.0;
            vertex_heights[num_vertices - i - 1] *= 2.0;
        }
        for (let j = 0, index_base = 0; j <= grid_size.y; j++, index_base += grid_size.x + 1) {
            let index_l = index_base;
            let index_r = index_base + grid_size.x;
            vertex_heights[index_l] *= 2.0;
            vertex_heights[index_r] *= 2.0;
        }

        const positions = this.mesh.geometry.attributes.position.array;
        for (let i = 1, j = 0; i < positions.length; i += 3, j++) {
            positions[i] = vertex_heights[j];
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeBoundingSphere();
    }
};

