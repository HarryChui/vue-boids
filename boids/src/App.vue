<template>
  <div id="app">
    <Sketch
      v-if="canvasWidth > 0 && canvasHeight > 0"
      :width="canvasWidth"
      :height="canvasHeight"
      :setup="setup"
      :draw="draw"
    >
      <BoidDraw
        v-for="(boid,i) in boids.elements"
        :key="i"
        :position="boid.position"
        :direction="boid.velocity.angleDeg()"
        :height="boids.height"
        :width="boids.width"
        :color="controls.colorBoid"
      >
      </BoidDraw>
    </Sketch>

  </div>
</template>

<script>
import Sketch from "@/components/Sketch";
import Boid from "@/boid.js";
import Victor from "victor";
import BoidDraw from "@/components/BoidDraw";

// let pos = new Victor(0, 0);
// let velo = new Victor(1, 1);
// let accel = new Victor(2, 2);
// let b = new Boid(pos, velo, accel);
// b.move();

export default {
  name: "App",
  components: {
    Sketch,
    BoidDraw,
  },
  data() {
    return {
      numBoids: 75,
      boids: {
        width: 15,
        height: 15,
        elements: [],
      },
      canvasWidth: 1800,
      canvasHeight: 900,
      controls: {
        alignment: 1.2,
        cohesion: 0.8,
        separation: 1.5,
        maxForce: 0.1,
        maxSpeed: 5,
        vision: 100,
        colorBoid: "#fff",
        //colorBackground: "#5a67d8",
        colorBackground: "#5c64ad",
      },
    };
  },
  methods: {
    setup({ ctx, width, height }) {
      ctx.fillStyle = this.controls.colorBackground;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < this.numBoids; i += 1) {
        this.boids.elements.push(
          new Boid(
            new Victor(
              Math.floor(Math.random() * width),
              Math.floor(Math.random() * height)
            ),
            new Victor(
              Math.random() * this.controls.maxSpeed,
              Math.random() * this.controls.maxSpeed
            ),
            new Victor()
          )
        );
      }
    },
    draw({ ctx, width, height }) {
      ctx.fillStyle = this.controls.colorBackground;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < this.numBoids; i += 1) {
        const boid = this.boids.elements[i];
        boid.update(
          this.boids.elements.filter((b) => b !== boid),
          {
            vision: this.controls.vision,
            MaxSpeed: this.controls.maxSpeed,
            MaxForce: this.controls.maxForce,
          }
        );
        boid.move(this.controls.maxSpeed);
        boid.edges(width, height);
        this.boids.elements[i] = boid;
      }
    },
  },
};
</script>
