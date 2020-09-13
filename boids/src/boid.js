import Victor from 'victor'

Victor.prototype.limitMagnitude = function(max) {

    if (this.length() > max) {
        this.normalize();
        this.multiply({ x: max, y: max });
    }

};

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
        let in_vision = 0
        let sum = new Victor()
        for (let boid of flock) {
            const distance = this.position.distance(boid.position)
            if (distance <= vision) { // see if another boid is in vision of this one
                sum.add(boid.velocity)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            sum.divide({ x: in_vision, y: in_vision })
            sum.normalize()
            sum.multiply({ x: MaxSpeed, y: MaxSpeed })
            sum.subtract(this.velocity)
            sum.limitMagnitude(MaxForce)
        }

        return sum
    }

    center(flock, { vision, MaxSpeed, MaxForce }) {
        // cohesion: make each boid try to go to the center of mass of the boids around it 
        let in_vision = 0
        let sum = new Victor(0, 0)

        for (let boid of flock) {
            const distance = this.position.distance(boid.position)
            if (distance <= vision) { // see if another boid is in vision of this one
                sum.add(boid.position)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            sum
                .divideScalar(in_vision)
                .subtract(this.position) // how many pixels we have to move to get to center of mass
                .normalize()
                .multiplyScalar(MaxSpeed)
                .subtract(this.velocity) // change velocity to point towards center of mass
                .limitMagnitude(MaxForce)
        }

        return sum
    }

    separation(flock, { vision, MaxSpeed, MaxForce }) {
        // separation: make boid steer away from any other boids, with boids that are closer having a larger impact on the final turning of the boid
        let in_vision = 0
        let avg_vector = new Victor()
        for (let boid of flock) {
            const distance = this.position.clone().distance(boid.position)
            if (distance <= vision && distance > 0) { // see if another boid is in vision of this one
                const thisposition = this.position.clone()
                const difference = thisposition.subtract(boid.position)
                difference.divide({ x: distance, y: distance })
                avg_vector.add(difference)
                in_vision += 1
            }
        }
        if (in_vision > 0) {
            avg_vector.divide({ x: in_vision, y: in_vision })
            avg_vector.normalize()
            avg_vector.multiply({ x: MaxSpeed, y: MaxSpeed })
            avg_vector.subtract(this.velocity)
            avg_vector.limitMagnitude(MaxForce)
        }

        return avg_vector
    }

    update(flock, { vision, MaxSpeed, MaxForce, alignment, cohesion, sep }) {
        const align = this.align(flock, { vision, MaxSpeed, MaxForce }).multiplyScalar(alignment)
        const centerofmass = this.center(flock, { vision, MaxSpeed, MaxForce }).multiplyScalar(cohesion)
        const separate = this.separation(flock, { vision, MaxSpeed, MaxForce }).multiplyScalar(sep)
        this.acceleration
            .add(align)
            .add(centerofmass)
            .add(separate)
    }
}
