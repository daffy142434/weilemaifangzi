export default {
  data() {
    return {
      visible: false,
      loading: false,
    };
  },
  methods: {
    show(...args) {
      this.visible = true;
      if (this.afterShow) {
        this.afterShow(...args);
      }
    },
    close(...args) {
      this.visible = false;
      if (this.afterClose) {
        this.afterClose(...args);
      }
    }
  }
}
