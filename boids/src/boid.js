import Victor from 'victor'

export default class Boid {
    constructor(position, velocity, acceleration) {
        this.position = position
        this.velocity = velocity
        this.acceleration = acceleration
    }

    move(MaxSpeed) {
        // move boids based on acceleration and velocity
        this.velocity.add(this.acceleration)
        // Check if velocity is above max speed
        if (this.velocity.length() >= MaxSpeed) {
            this.velocity.normalize()
            this.velocity.multiplyScalar(MaxSpeed)
            this.acceleration = new Victor(0, 0)
        }

        this.position.add(this.velocity)
    }

    edges(width, height) {
        // check to see if the boid has hit an edge and wrap around if it has
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.y > height) {
            this.position.y = 0
        } else if (this.position.y < 0) {
            this.position.y = height
        }
    }

    align(flock, { vision, MaxSpeed, MaxForce }) {
        // alignment: match a boid's velocity with the others around it
        let steering = new Victor(0, 0)
        let avg_velocity = new Victor(0, 0)
        let in_vision = 0
        for (let boid of flock) {
            if (boid.position.clone().subtract(this.position).length() <= vision) {
                // see if another boid is in vision of this one
                avg_velocity.add(boid.velocity)
                console.log(avg_velocity.x)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            avg_velocity
                .divideScalar(in_vision)
                .normalize()
                .multiplyScalar(MaxSpeed)
            steering = avg_velocity.subtract(this.velocity)
        }
        if (steering.magnitude() > MaxForce) {
            steering
                .normalize()
                .multiplyScalar(MaxForce)
        }

        return steering
    }

    center(flock, { vision, MaxSpeed, MaxForce }) {
        // cohesion: make each boid try to go to the center of mass of the boids around it 
        let in_vision = 0
        let steering = new Victor(0, 0)

        for (let boid of flock) {
            if (boid.position.clone().subtract(this.position) <= vision) { // see if another boid is in vision of this one
                steering.add(boid.velocity)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            steering
                .divideScalar(in_vision)
                .subtract(this.position) // how many pixels we have to move to get to center of mass
                .normalize()
                .multiplyScalar(MaxSpeed)
                .subtract(this.velocity) // change velocity to point towards center of mass
        }
        if (steering.magnitude() > MaxForce) {
            steering
                .normalize()
                .multiplyScalar(MaxForce)
        }

        return steering
    }

    separation(flock, { vision, MaxSpeed, MaxForce }) {
        // separation: make boid steer away from any other boids, with boids that are closer having a larger impact on the final turning of the boid
        let in_vision = 0
        let steering = new Victor(0, 0)
        for (let boid of flock) {
            if (boid.position.clone().subtract(this.position) <= vision && this.position != boid.position) { // see if another boid is in vision of this one
                let difference = this.position.subtract(boid.position)
                difference.divide(boid.position.divide(this.position))
                steering.add(difference)
                steering.add(boid.velocity)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            steering
                .divideScalar(in_vision)
                .normalize()
                .multiplyScalar(MaxSpeed)
                .subtract(this.velocity)
        }
        if (steering.magnitude() > MaxForce) {
            steering
                .normalize()
                .multiplyScalar(MaxForce)
        }

        return steering
    }

    update(flock, { vision, MaxSpeed, MaxForce }) {
        const align = this.align(flock, { vision, MaxSpeed, MaxForce })
        //const centerofmass = this.center(flock, { vision, MaxSpeed, MaxForce })
        //const separate = this.separation(flock, { vision, MaxSpeed, MaxForce })
        this.acceleration
            .add(align)
        //.add(centerofmass)
        //.add(separate)
    }
}

// let boids = []
// for (let i = 0; i < 5; i += 1) {
//     boids.push(
//         new Boid(
//             new Victor(
//                 Math.floor(Math.random() * 1500),
//                 Math.floor(Math.random() * 800)
//             ),
//             new Victor(
//                 Math.random() * 6,
//                 Math.random() * 6
//             ),
//             new Victor(0, 0)
//         )
//     );
// }

// while (!isNaN(boids[0].position.x)) {
//     for (let i = 0; i < 5; i += 1) {
//         const boid = boids[i];
//         // boid.update(
//         //     boids.filter((b) => b !== boid),
//         //     100, 6, 0.6
//         // );
//         boid.move(6);
//         boid.edges(1500, 800);
//     }
//     console.log(boids[0].position)
// }