<template lang="html">
  <el-dialog
    title="回复客户"
    :visible.sync="visible"
    width="90%"
  >
  <div class="fallback-customer" el="fallbackCustomer">
    <div class="fallback-customer-list">
      <div v-for="item in data" :class="item.isReply ? 'fallback-message reply' : 'fallback-message'">
        <div class="fallback-message-hd">
          <span class="fl">
            {{item.sendName}}
          </span>
          <span class="fr">
            {{item.replyTime}}
          </span>
        </div>
        <div class="fallback-message-bd" v-html="item.message">
        </div>
      </div>
    </div>
    <div class="fallback-customer-bar">
      <el-form>
        <el-form-item label="回复标题">
          <el-input v-model="subject"></el-input>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input type="textarea" v-model="email"></el-input>
        </el-form-item>
      </el-form>
      <div class="fallback-customer-bar-ft">
        <span class="fallback-err-text fl" v-if="errorText!==''" v-html="errorText"></span>
        <el-button
          type="primary"
          class="fr"
          v-loading="submitLoading"
          @click="reply"
        >回复</el-button>
      </div>
    </div>
  </div>
  </el-dialog>
</template>

<script>
  import {Loading} from 'element-ui';
  import format from '@/lib/format';
  import CustomerQuesition from '@/pages/customerQuesition/services';

  const customerQuesition = new CustomerQuesition();

  export default {
    data() {
      return {
        visible: false,
        submitLoading: false,
        subject: '',
        emailContent: '',
        errorText: '',
        quesitionData: {},
        data: []
      }
    },
    methods: {
      reply() {
        if (this.email === '') {
          this.errorText = '请输入回复内容';
          return;
        }
        const params = {
          emailId: this.quesitionData.processOrder.emailId,
          shopId: this.quesitionData.processOrder.shopId,
          subject: `Re: ${this.subject}`,
          message: this.email
        }
        const id = this.quesitionData.processOrder.id;
        this.submitLoading = true;
        customerQuesition.replyQuesitionByProcess(id, params).then((res) => {
          this.loadData();
          this.subject = '';
          this.email = '';
          this.$emit('onReply');
          this.submitLoading = false;
        }).catch(() => {
          this.submitLoading = false;
        });
      },
      show(quesitionData) {
        this.visible = true;
        this.data = [];
        this.quesitionData = quesitionData;
        this.email = '';
        this.data = [];
        this.loadData();
      },
      loadData() {
        let loading;

        const params = {
          custEmailAddr: this.quesitionData.processOrder.emailFrom,
          shopEmailAddr: this.quesitionData.processOrder.shopEmail,
        };
        const emailId = this.quesitionData.processOrder.emailId;
        setTimeout(() => {
          loading = Loading.service({
            target: this.$el.querySelector('.fallback-customer')
          });
        });
        customerQuesition.getReplyList(emailId).then((res) => {
          let data = [];
          let sData = res.data.data.data || [];
          sData = sData.sort((p, n) => {
            if (p.fromCust.receiveTime > n.fromCust.receiveTime) {
              return 1;
            } else if (p.fromCust.receiveTime < n.fromCust.receiveTime) {
              return -1;
            } else {
              return 0;
            }
          });
          sData.map((d) => {
            const {fromCust, reply} = d;
            data.push({
              subject: fromCust.subject,
              sendName: fromCust.sendName,
              message: fromCust.message,
              time: fromCust.receiveTime,
              isReply: false
            });
            reply.map((r) => {
              data.push({
                subject: r.subject,
                sendName: r.sendName,
                message: r.message,
                time: r.sendTime,
                isReply: true
              });
            });
          });
          data = data.map((d) => {
            d.time = format.toDateTime(d.time);
            return d;
          });
          this.data = data;
          setTimeout(() => {
            const listDom = this.$el.querySelector('.fallback-customer-list');
            listDom.scrollTop = listDom.scrollHeight;
          });
          loading.close();
        }).catch(() => {
          loading.close();
        });
      }
    },
    computed: {
      email: {
        set(value) {
          if (value) {
            this.errorText = '';
          }
          this.emailContent = value;
        },
        get() {
          return this.emailContent;
        }
      }
    }
  }
</script>

<style lang="less">
  .fallback-customer {
    display: flex;
    height: 400px;
  }
  .fallback-customer-list {
    flex: 1;
    margin-right: 15px;
    overflow: auto;
  }
  .fallback-customer-bar {
    width: 400px;
  }
  .fallback-message {
    overflow: hidden;
    float: left;
    clear: both;
    min-width: 300px;
    max-width: 80%;
    border: #D3DCE6 1px solid;
    border-radius: 2px;
    line-height: 27px;
    margin-bottom: 30px;
    &.reply {
      float: right;
      background: #20A0FF;
      color: #fff;
      border: 0;
      .fallback-message-bd {
        margin-right: 30px;
      }
    }
    .fallback-message-hd {
      padding: 0 15px;
      border-bottom: #D3DCE6 1px solid;
      overflow: hidden;
      font-weight: 900;
    }
    .fallback-message-bd {
      padding: 5px 15px;
      font-size: 16px;
      line-height: 30px;
    }
  }
  .fallback-customer-bar {
    textarea {
      height: 201px;
    }
    .fallback-err-text {
      margin-top: 10px;
      color: #FF4949;
    }
    .el-button {
      margin-top: 10px;
    }
  }
</style>
