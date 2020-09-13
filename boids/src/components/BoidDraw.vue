<script>
export default {
  inject: ["getCanvas", "getNumIterations"],
  props: {
    position: Object,
    direction: Number,
    width: Number,
    height: Number,
    color: {
      type: String,
      default: "black",
    },
  },
  methods: {
    display() {
      const ctx = this.canvas.ctx;
      ctx.save();
      ctx.beginPath();
      // ctx.arc(this.position.x, this.position.y, this.width, 0, 2 * Math.PI);
      // ctx.stroke();

      ctx.translate(this.position.x, this.position.y);

      //ctx.rotate()
      ctx.rotate(this.direction + Math.PI / 2);

      ctx.strokeStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.lineTo(0, this.height / 3);
      ctx.lineTo(0, -this.height / 2);
      ctx.lineTo(-this.width / 2, this.height / 2);
      ctx.lineTo(0, this.height / 3);
      ctx.stroke();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.restore();
    },
  },
  computed: {
    canvas() {
      return this.getCanvas();
    },
    iterationCount() {
      return this.getNumIterations();
    },
  },
  watch: {
    iterationCount: {
      handler: "display",
      immediate: true,
    },
  },
  render() {
    return null;
  },
};
</script>