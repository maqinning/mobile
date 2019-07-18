<template>
<div class="personal-info background">
<van-nav-bar
  class="toutiao-nav-bar"
  title="个人信息"
  right-text="保存"
  left-arrow
  @click-left="$router.go(-1)"
  @click-right="saveProfile"

/>
<van-cell  @click="showImg" class="text-left" title="头像"  size="large" is-link>
  <div>
  <img class='head-img' :src="userProfile.photo" slot="right-icon" name='' />
  </div>
</van-cell>
<van-cell @click="showEdit" class="text-left" title="昵称" :value="nickName" size="large" is-link/>
<van-cell @click="showIntro" class="text-left" title="介绍" :value="intro" size="large" is-link/>
<div class="split"></div>
<van-cell @click="showSex" class="text-left" title="性别" :value="sexName" size="large" is-link/>
<van-cell @click="showDate" class="text-left" title="生日" :value="birthday" size="large" is-link/>
<van-actionsheet
  v-model="showPicker"
  :actions="[{name:'男'},{name:'女'}]"
  cancel-text="取消"
  @select="onSelectSex"
/>
<van-popup v-model="showDatePicker" position="bottom">
<van-datetime-picker
  :min-date="minDate"
  v-model="currentDate"
  type="date"
  @cancel="showDatePicker = false"
  @confirm="dateOk"
/>
</van-popup>
<van-popup :lazy-render="false" v-model="showEditNickName" class="nickName" position="bottom">
   <form action="" @submit="nickOK">
     <van-field
       ref="myNickName"
       v-model="nickName"
       placeholder="请输入您的昵称"
       size="large"
       required
      />
   </form>
</van-popup>
<van-popup :lazy-render="false" v-model="showEditIntro" class="intro" position="bottom">
   <form action="" @submit="introOK">
     <van-field
       ref="myIntro"
       v-model="intro"
       placeholder="请输入您的个人介绍"
       size="large"
       type='textarea'
       :autosize="{ maxHeight: 100, minHeight: 50}"
      />
   </form>
</van-popup>
<van-dialog
  v-model="showUploadImg"
  :showConfirmButton="false"
  className="head-upload"
>
<div class='upload-body'>
<van-button type="default">
  <van-uploader :after-read="onReadImg" accept="image/gif, image/jpeg, image/png">
  从相册选择
</van-uploader></van-button>
<van-button @click="tips" type="default">拍照</van-button>
<van-button @click="showUploadImg = false" type="default">取消</van-button>
</div>
</van-dialog>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { ImagePreview, Dialog } from 'vant'
import { getFullDate } from '@/utils/date'
export default {
  computed: {
    ...mapState({
      userProfile: state => state.user.userProfile,
      userInfo: state => state.user.userInfo
    }),
    sexName () {
      return this.sex ? '女' : '男'
    }
  },
  data () {
    return {
      showPicker: false,
      showDatePicker: false,
      showEditNickName: false,
      showEditIntro: false,
      showUploadImg: false,
      currentDate: null,
      nickName: '',
      intro: '',
      sex: 0,
      birthday: null,
      minDate: new Date('1920-11-11')
    }
  },
  async created () {
    await this.getUserInfo() // 拉取个人信息
    await this.getUserProfile() // 拉取个人信息
    this.nickName = this.userProfile.name // 用户名
    this.sex = this.userProfile.gender // 性别
    this.birthday = this.userProfile.birthday // 生日
    this.intro = this.userInfo.intro
  },
  methods: {
    ...mapActions(['getUserInfo', 'editUserPhoto', 'getUserProfile', 'editUserProfile']),
    showSex () {
      this.showPicker = true
    },
    onSelectSex (item, index) {
      // 选择性别 index为0时 为男 为1 时 为女
      this.showPicker = false
      this.sex = index
    },
    showDate () {
      this.currentDate = this.birthday ? new Date(this.birthday) : new Date() // 如果没有默认给当前时间
      this.showDatePicker = true
    },
    showEdit () {
      this.showEditNickName = true
      this.$refs.myNickName && this.$refs.myNickName.focus() // 自动对焦
    },
    showIntro () {
      this.showEditIntro = true
      this.$refs.myIntro && this.$refs.myIntro.focus() // 自动对焦
    },
    showImg () {
      // 编辑图片
      this.showUploadImg = true
    },
    nickOK (event) {
      // 编辑昵称完成
      event.preventDefault()
      this.showEditNickName = false // 关闭编辑昵称
    },
    introOK (event) {
      event.preventDefault()
      this.showEditIntro = false // 关闭介绍弹窗
    },
    dateOk () {
      // 时间选择完毕
      this.showDatePicker = false
      this.birthday = getFullDate(this.currentDate) // 将当前的时间给生日
    },
    tips () {
      this.$toast('拍照需要原生端提供sdk能力')
      this.showUploadImg = false
    },
    onReadImg ({ file }) {
      this.showUploadImg = false
      // 读取完图片之后
      ImagePreview({
        images: [URL.createObjectURL(file)],
        showIndex: false,
        onClose: () => {
          Dialog.confirm({
            message: '是否设置该图片为头像'
          }).then(async () => {
            let fd = new FormData()
            fd.append('photo', file, file.name)
            this.$toast.loading()
            await this.editUserPhoto(fd) // 上传图片
            this.$toast.clear()
            this.$toast.success('更新成功')
          }).catch()
        }
      })
    },
    async  saveProfile () {
      // 保存个人资料
      this.$toast.loading()
      let data = { name: this.nickName, gender: this.sex, birthday: this.birthday, intro: this.intro }
      this.editUserProfile(data) // 更新用户个人资料
      this.$toast.clear()
      this.$toast.success('更新成功')
    }

  }
}
</script>

<style lang="less" scoped>
  .personal-info {
    .head-img {
      width:26px;
      height:26px;
      border-radius: 13px;
    }
    .head-upload {
      background: transparent;
      .upload-body {
        display: flex;
        flex-direction: column;
      }
    }
    .nickName {
      width:100%;
    .nick-text-area {
       width:90%;
       height:50px;
       border-radius: 4px;
       margin:20px auto;
       padding:10px 20px;
       box-sizing: border-box;
       font-size:18px;
     }
     .btnok {
       width:90%;
     }
    }
    .intro {
      .van-field {
       border:0.5px solid #edeff3;
      }
    }
  }
</style>
