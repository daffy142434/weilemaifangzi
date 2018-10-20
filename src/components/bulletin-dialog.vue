<template lang="html">
  <el-dialog
    class="bulletin-dialog"
    title="系统公告"
    width="60%"
    :visible.sync="visible"
    @close="close"
  >
    <div class="bulletin-list">
      <div class="bulletin-item" v-for="item in data" :style="item.style">
        <h1>
          {{item.bulletinTitle}}
        </h1>
        <div>
          <span class="gray" v-datetime="item.bulletinTime"></span>
          <span class="el-icon-loading" v-if="item.loading"></span>
          <el-tag type="success" size="mini" v-if="item.isRead">已读</el-tag>
        </div>
        <div class="bulletin-content">
          {{item.bulletinContent}}
        </div>
      </div>
    </div>
    <el-button @click="move(-1)" v-if="!isStart" class="page-button page-left-button el-icon-arrow-left"></el-button>
    <el-button @click="move(1)" v-if="!isEnd" class="page-button page-right-button el-icon-arrow-right"></el-button>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="readAll" :loading="loading">全部已读</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import SystemBulletin from '@/pages/systemBulletin/services';
import Delay from '@/lib/delay';

const systemBulletin = new SystemBulletin();
const delay = new Delay();

export default {
  data() {
    return {
      visible: false,
      loading: false,
      index: 0,
      isStart: false,
      isEnd: false,
      data: [{}],
    }
  },
  methods: {
    load() {
      systemBulletin.getUnRead().then((res) => {
        const data = res.data.data || [{}];

        if (data && data.length) {
          this.data = data.map((d, index) => {
            d.style = this.getStyle(index);
            d.isRead = false;
            d.loading = false;
            return d;
          });
          this.move(0);
          this.show();
        }
      });
    },
    move(v) {
      let curIndex = this.index + v;

      if (curIndex <= 0) {
        curIndex = 0;
        this.isStart = true;
      } else {
        this.isStart = false;
      }
      if (curIndex >= this.data.length - 1) {
        curIndex = this.data.length - 1;
        this.isEnd = true;
      } else {
        this.isEnd = false;
      }
      this.data = this.data.map((d, index) => {
        const v = index - curIndex;
        d.style = this.getStyle(v);
        return d;
      });
      this.index = curIndex;
      this.setBulletinReadStatusByIndex(curIndex);
    },
    setBulletinReadStatusByIndex(index) {
      const bulletin = this.data[index];
      const {id} = bulletin;

      if (bulletin.isRead) {
        return;
      }
      bulletin.loading = true;
      const timestamp = Date.now();
      const delayValue = 1000;
      delay.start();
      systemBulletin.setReadStatus({bulletinIdList: [id].join(',')}).then(() => {
        delay.end(delayValue, () => {
          bulletin.isRead = true;
          bulletin.loading = false;
        });
      }).catch(() => {
        delay.end(delayValue, () => {
          bulletin.loading = false;
        });
      });
    },
    getStyle(v) {
      if (v == 0) {
        return "left: 0;";
      } else {
        return `left: ${v}00%;`;
      }
    },
    readAll() {
      this.loading = true;
      const bulletinIdList = [];
      this.data.map(d => !d.isRead && bulletinIdList.push(d.id)).join(',');
      systemBulletin.setReadStatus({bulletinIdList: bulletinIdList.join(',')}).then(() => {
        this.visible = false;
        this.$message({
          type: 'success',
          message: '已读所有公告'
        });
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  }
}
</script>

<style lang="less">
.bulletin-dialog {
  .el-dialog__body {
    padding: 10px 60px;
    line-height: 23px;
    position: relative;
    h1 {
      margin: 0 0 10px;
    }
  }
  .page-button {
    font-size: 36px;
    position: absolute;
    top: 50%;
    margin-top: -18px;
    color: #666;
    background: transparent;
    border-color: #666;
    padding: 10px 0;
    &:active {
      border-color: #999;
      color: #999;
    }
  }
  .page-left-button {
    left: 10px;
  }
  .page-right-button {
    right: 10px;
  }
}
.bulletin-list {
  height: 360px;
  position: relative;
  overflow: hidden;
  .bulletin-item {
    position: absolute;
    width: 100%;
    width: 100%;
    transition: all .3s;
    h1 {
      font-size: 28px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
