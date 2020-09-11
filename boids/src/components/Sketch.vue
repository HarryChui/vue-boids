<template>
  <div>
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
    ></canvas>
    <slot v-if="ctx"></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      getCanvas: () => this.canvas,
      getNumIterations: () => this.iterations,
    };
  },
  props: {
    width: Number,
    height: Number,
    setup: {
      type: Function,
      default: () => {},
    },
    draw: {
      type: Function,
      default: null,
    },
    iteration_limit: {
      type: Number,
      default: Infinity,
    },
  },
  data() {
    return {
      element: null,
      ctx: null,
      iterations: 0,
    };
  },
  methods: {
    tick() {
      if (this.ctx && this.iterations < this.iteration_limit) {
        this.draw(this.canvas);
        this.iterations += 1;
      }
      requestAnimationFrame(this.tick);
    },
  },
  computed: {
    canvas() {
      return {
        element: this.element,
        ctx: this.ctx,
        width: this.width,
        height: this.height,
      };
    },
  },
  mounted() {
    this.element = this.$refs.canvas;
    this.ctx = this.element.getContext("2d");
    this.setup(this.canvas);
    if (this.draw !== null) {
      requestAnimationFrame(this.tick);
    }
  },
  beforeDestroy() {
    this.tick = () => {};
  },
};
</script>

<style scoped>
canvas {
  display: block;
}
</style>