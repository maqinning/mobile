<template>
  <div class='login'>
     <van-nav-bar  class="toutiao-nav-bar" title="登录" />
     <div class='username input-item'>
       <span class='phone'></span>
       <input v-model="phone" ref='username' placeholder="请输入手机号"  type="number" />
     </div>
     <div class='password input-item'>
        <span class='pwd'></span>
       <input v-model="pwd" ref='pwd' placeholder="请输入密码" type="number" />
       <span class='getCode' @click="getCode" :disabled="haveSendMessage">{{ codeMessage }}</span>
     </div>
     <div class='btn-ok'>
       <van-button class='btn-login' type="info" @click="login">登录</van-button>
     </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      phone: '',
      pwd: ''
    }
  },
  mounted () {
    if (this.userToken) {
      // this.$router.push({ path: '/' }) // 如果存在token则跳转到主页
    }
  },
  computed: {
    ...mapGetters([
      'userToken',
      'codeMessage'
    ]),
    ...mapState({
      lastSeconds: state => state.login.lastSeconds,
      haveSendMessage: state => state.login.sendCode
    })
  },
  methods: {
    // vuex中的mutations
    ...mapMutations([
      'secondsCut',
      'reloadCodeSuccess'
    ]),
    ...mapActions([
      'loginUser', // 将 `this.loginUser(amount)` 映射为 `this.$store.dispatch('loginUser', amount)`
      'sendCode'
    ]),
    /****
     * 登录
     *  *****/
    login () {
      if (this.testPhone() && this.testPwd()) {
        // 基本验证通过
        this.loginUser({ mobile: this.phone, code: this.pwd }) // 调用登录方法
      }
    },
    async getCode () {
      // 获取手机号，
      if (this.testPhone()) {
        await this.sendCode({ mobile: this.phone }) // 发送短信验证码
        this.$toast.success('发送成功')
        let _this = this
        let call = () => {
          if (_this.lastSeconds === 0) {
            _this.$store.commit('reloadCodeSuccess') // 重置状态
          } else {
            _this.$store.commit('secondsCut') // 秒数递减
            setTimeout(call, 1000) // 继续循环执行
          }
        }
        call()
      }
    },
    testPhone () {
      // 验证手机号
      let pattern = /^1[34578]\d{9}$/ // 手机号正则表达式
      if (!pattern.test(this.phone)) {
        this.$toast('手机号格式不正确!')
        return false
      }
      return true
    },
    testPwd () {
      // 验证验证码
      let pwdpattern = /^\d{6}$/ // 验证码正则表达式
      if (!pwdpattern.test(this.pwd)) {
        this.$toast('验证码格式不正确!')
        return false
      }
      return true
    }
  }
}
</script>

<style lang='less' scoped>
  .login {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  .input-item {
    width: 100%;
    height:50px;
    position: relative;
    input {
      height: 100%;
      width: 100%;
      border:none;
      background-color: #ffffff;
      border-radius: 4px;
      padding:15px 35px;
      box-sizing: border-box;
    }
   .username-input {
       border-bottom: 1px solid #CCCCCC;
   }
   .phone,.pwd {
     background-image: url('/assets/img/phone.png');
     position: absolute;
     width:20px;
     height:20px;
     background-size: 20px;
     margin-top:15px;
     margin-left:10px;
   }
   .pwd {
     background-image: url('/assets/img/password.png');
   }
   .getCode {
     text-align: center;
     position: absolute;
     margin-right: 10px;
     right:0;
     bottom:10px;
     background-color:#BEBEBE;
     border-radius: 40px;
     padding: 3px 10px;
     height:23px;
     line-height: 23px;
     cursor: pointer;
     background-color: #ededed;
     font-size:11px;
     color: #666666;

   }
  }
  .btn-ok {
    width: 100%;
    margin-top: 30px;
    .btn-login {
      width:90%;
      height:50px;
      border-radius: 4px;
      border:none;
      box-sizing: border-box;
    }
  }
   .password {
       margin-top:0;
    }
    .username {
      border-bottom:  0.5px solid #EEEEEE;
    }
    input::-webkit-input-placeholder{
     color: #c0c0c0;
     font-size: 13px;
    }
}
</style>
