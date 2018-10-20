<template lang="html">
  <el-dialog
    :title="title || '回复客户'"
    width="90%"
    :visible.sync="visible"
    @close="close"
  >
  <div class="fallback-customer" el="fallbackCustomer">
    <div
      class="fallback-customer-mail"
      v-loading="loading"
    >
      <div class="customer-mail">
        <div class="customer-mail-header">
          <strong><span :title="quesitionData.emailSubject">{{quesitionData.emailSubject}}</span></strong>
          <span class="customer-mail-title" :title="quesitionData.receiveTime" v-datetime="quesitionData.receiveTime"></span>
        </div>
        <div class="customer-mail-content">
          <div v-html="oldEmailContent"></div>
          <div class="accessory-list" v-if="quesitionData.accessoryList && quesitionData.accessoryList.length">
            附件：
            <a :href="accessory.accessoryUrl" target="_blank" v-for="accessory in quesitionData.accessoryList" :key="accessory.accessoryName">
              <i class="el-icon-document"></i>
              {{accessory.accessoryName}}
            </a>
          </div>
        </div>
      </div>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item v-for="(reply, index) in replyList" :name="index" :key="reply.emailSubject">
          <template slot="title">
            <strong>
              <span :title="reply.emailSubject">{{reply.emailSubject}}</span>
            </strong>
            <span class="fallback-time" :title="reply.replyTime" v-datetime="reply.replyTime"></span>
          </template>
          <div v-html="reply.emailContent"></div>
          <div class="accessory-list" v-if="reply.accessoryList && reply.accessoryList.length">
            附件：
            <a :href="accessory.accessoryUrl" target="_blank" v-for="accessory in reply.accessoryList" :key="accessory.accessoryName">
              <i class="el-icon-document"></i>
              {{accessory.accessoryName}}
            </a>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="fallback-customer-bar" v-if="!hideReply">
      <el-form ref="form" :model="form" :rules="rules">
        <div style="margin-bottom: 6px;">
          客户邮箱：{{quesitionData.emailFrom}}
        </div>
        <div class="fallback-resubject-title">
          <el-input type="text" v-model="form.emailSubject"></el-input>
        </div>
        <el-input type="textarea" v-model="form.emailContent"></el-input>
      </el-form>
      <div class="fallback-customer-bar-ft">
        <el-button
          type="primary"
          class="fr"
          :loading="submitLoading"
          @click="reply"
        >回复</el-button>
      </div>
    </div>
    <div class="fallback-accessory" id="accessory" v-if="!hideReply">
      <el-upload
        name="uploadFile"
        multiple
        :action="uploadAction"
        :data="uploadParams"
        :file-list="fileList"
        :on-success="handleUploadSuccess"
        :on-remove="handleRemoveFile"
        :on-progress="handleProcess"
      >
        <el-button type="primary" size="mini">上传文件</el-button>
      </el-upload>
    </div>
  </div>
  </el-dialog>
</template>

<script>
import {Loading} from 'element-ui';
import format from '@/lib/format';
import CustomerQuesition from '@/pages/customerQuesition/services';

const customerQuesition = new CustomerQuesition();

let uploadAction;

if (process.env.NODE_ENV === 'development') {
  uploadAction = '/api/file/upload';
} else {
  uploadAction = '/file/upload';
}

export default {
  props: ['title', 'hideReply'],
  data() {
    return {
      uploadAction,
      visible: false,
      loading: false,
      submitLoading: false,
      oldEmailContent: '',
      activeName: 0,
      subject: '',
      replyList: [],
      fileList: [],
      uploadParams: {
        businessType: 'reply_acc'
      },
      form: {
        emailSubject: '',
        emailContent: '',
      },
      rules: {
        emailContent: [{required: true, message: '请填写邮箱内容'}]
      },
      quesitionData: {},
      data: [
      ]
    }
  },
  mounted() {
  },
  methods: {
    reply() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        const id = this.quesitionData.id;
        const params = {
          ...this.form,
        };
        this.fileList.map((file, index) => {
          params[`accessoryList[${index}].replyId`] = file.replyId;
          params[`accessoryList[${index}].accessoryPath`] = file.savePath;
          params[`accessoryList[${index}].accessoryUrl`] = file.viewUrl;
          params[`accessoryList[${index}].accessoryName`] = file.fileName;
        });
        this.submitLoading = true;
        customerQuesition.replyQuesition(id, params).then((res) => {
          this.submitLoading = false;
          this.loadData();
          this.email = '';
          this.$emit('onReply');
          this.fileList = [];
          this.form.emailContent = '';
          this.$message({
            type: 'success',
            message: '回复成功'
          })
        }).catch(() => {
          this.submitLoading = false;
        });
      });
    },
    loadData() {
      const id = this.quesitionData.id;
      this.loading = true;
      customerQuesition.getReplyList(id).then((res) => {
        this.quesitionData = res.data.data;
        this.oldEmailContent = res.data.data.emailContent;
        this.replyList = res.data.data.replyList;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleProcess() {
      this.uploadFileListElement.scrollTop = this.uploadFileListElement.scrollHeight;
    },
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        this.$message({
          type: 'warning',
          message: res.msg
        });
        return;
      }
      const url = res.data.viewUrl;
      this.fileList.push({
        replyId: this.quesitionData.id,
        url,
        name: file.name,
        uid: file.uid,
        savePath: res.data.savePath,
        viewUrl: res.data.viewUrl,
        fileName: res.data.fileName
      });
      setTimeout(() => {
        this.uploadFileListElement.scrollTop = this.uploadFileListElement.scrollHeight;
      });
    },
    handleRemoveFile(file, fileList) {
      this.fileList = this.fileList.filter(f => f.uid !== file.uid);
    },
    show(quesitionData) {
      this.visible = true;
      this.data = [];
      this.quesitionData = quesitionData;
      this.subject = quesitionData.emailSubject;
      this.form.emailSubject = `Re: ${quesitionData.emailSubject}`;
      this.email = '';
      this.data = [];
      this.loadData();
      setTimeout(() => {
        const accessory = document.getElementById('accessory');
        this.uploadFileListElement = accessory.querySelector('.el-upload-list');
      });
    },
    close() {
      this.$refs.form.resetFields();
      this.fileList = [];
      this.form.emailContent = '';
    }
  }
}
</script>

<style lang="less">
.fallback-customer {
  display: flex;
  height: 400px;
}
.fallback-customer-mail {
  flex: 1;
  margin-right: 15px;
  overflow: auto;
  .customer-mail {
    border-radius: 6px;
    margin: 0 20px 10px 0;
    color: #fff;
    background: #888;
    &-header {
      padding: 10px;
      background: #666;
      border-radius: 6px 6px 0 0;
      line-height: 24px;
      .customer-mail-title {
        color: #e6e6e6;
        margin-left: 6px;
      }
    }
    &-content {
      padding: 10px;
    }
    .accessory-list {
      background: #666;
      margin-top: 10px;
      a {
        color: #fff;
        background: #999;
      }
    }
  }
  .fallback-customer-mail-header {
    div {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .fallback-customer-mail-content {
    padding: 10px;
    margin-top: 10px;
  }
  .el-collapse {
    border: 0;
    &-item {
      background: #409EFF;
      color: #fff;
      border-radius: 6px;
      margin-left: 20px;
      margin-bottom: 10px;
      &__header, &__wrap {
        background: none;
        border: 0;
        padding: 6px 10px;
        color: #fff;
      }
      &__header {
        color: #fff !important;
        height: auto;
        line-height: 22px;
      }
      &__wrap {
        background: #3482d2;
        border-radius: 0 0 6px 6px;
      }
      &__content {
        color: #fff;
      }
    }
  }
  .accessory-list {
    padding: 10px;
    margin-top: 10px;
    border-radius: 6px;
    background: #2e6bad;
    line-height: 32px;
    a {
      display: inline-block;
      color: #fff;
      background: #6e91b9;
      border-radius: 10px;
      line-height: 24px;
      padding: 0 10px;
      margin: 0 6px;
    }
  }
}
.fallback-customer-bar {
  width: 36%;
  min-width: 360px;
}
.fallback-accessory {
  width: 200px;
  padding-left: 10px;
  height: 333px;
  overflow: hidden;
  position: relative;
  top: 24px;
  .el-upload__input {
    position: absolute;
    left: -9999px;
  }
  .el-icon-close-tip {
    display: none !important;
  }
  .el-upload-list {
    height: 289px;
    overflow: auto;
  }
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
  margin-top: -12px;
  textarea {
    height: 283px;
  }
  .fallback-err-text {
    margin-top: 10px;
    color: #FF4949;
  }
  .el-button {
    margin-top: 10px;
  }
}
.fallback-time {
  color: #d0d7de;
  margin-left: 6px;
}
.fallback-resubject-title {
  font-weight: 900;
  margin-bottom: 10px;
}
.fallback-customer-mail {
  .el-collapse-item__header {
    overflow: hidden;
  }
}
</style>
