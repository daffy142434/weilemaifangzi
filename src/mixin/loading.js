export default {
  methods: {
    checkLoadingByPromise(p) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        return p.then((res) => {
          this.loading = false;
          resolve(res);
        }).catch((err) => {
          this.loading = false;
          reject(err);
        });
      });
    }
  }
}
