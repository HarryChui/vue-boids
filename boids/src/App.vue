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
        :color="colorBoid"
      >
      </BoidDraw>
    </Sketch>
    <JsPanel
      :visible="panel_info.show"
      :options="panel_info.options"
      @close="show = false"
    >
      <div>
        <b-field
          v-for="([control,value],index) in Object.entries(controls)"
          :key='index'
          :label='control'
          style="padding-right:10px; padding-left:10px;"
        >
          <b-numberinput
            type="is-dark"
            v-model="controls[control]"
            :placeholder="value"
          ></b-numberinput>
        </b-field>
      </div>
    </JsPanel>
  </div>
</template>

<script>
import Sketch from "@/components/Sketch";
import Boid from "@/boid.js";
import Victor from "victor";
import BoidDraw from "@/components/BoidDraw";

export default {
  name: "App",
  components: {
    Sketch,
    BoidDraw,
  },
  data() {
    return {
      numBoids: 75,
      colorBoid: "#fff",
      colorBackground: "#5c64ad",
      boids: {
        width: 15,
        height: 15,
        elements: [],
      },
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      controls: {
        Alignment: 1.2,
        Cohesion: 0.8,
        Separation: 1.5,
        Max_Force: 0.1,
        Max_Speed: 5,
        Vision: 100,
      },
      panel_info: {
        show: true,
        options: {
          animateIn: "animated zoomIn faster",
          animateOut: "animated zoomOut faster",
          headerTitle: "Control Panel",
          theme: "#313169 fillcolor #b1b4ba",
          header: false,
          position: {
            my: "right-top",
            at: "right-top",
            offsetY: "5vh",
            offsetX: "-5vh",
          },
          //panelSize: "20vh 30vh",
        },
      },
    };
  },
  methods: {
    setup({ ctx, width, height }) {
      ctx.fillStyle = this.colorBackground;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < this.numBoids; i += 1) {
        this.boids.elements.push(
          new Boid(
            new Victor(
              Math.floor(Math.random() * width),
              Math.floor(Math.random() * height)
            ),
            new Victor(
              Math.random() * this.controls.Max_Speed,
              Math.random() * this.controls.Max_Speed
            ),
            new Victor()
          )
        );
      }
    },
    draw({ ctx, width, height }) {
      ctx.fillStyle = this.colorBackground;
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < this.numBoids; i += 1) {
        const boid = this.boids.elements[i];
        boid.update(
          this.boids.elements.filter((b) => b !== boid),
          {
            vision: this.controls.Vision,
            MaxSpeed: this.controls.Max_Speed,
            MaxForce: this.controls.Max_Force,
          }
        );
        boid.move(this.controls.Max_Speed);
        boid.edges(width, height);
        this.boids.elements[i] = boid;
      }
    },
  },
};
</script>