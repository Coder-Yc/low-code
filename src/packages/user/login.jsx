import { defineComponent, ref } from 'vue'
import './LoginPage.scss'
import { ElInput } from 'element-plus'

export default defineComponent({
  name: 'LoginRegisterPage',
  setup() {
    const activeTab = ref('login')
    const username = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const registerUsername = ref('')
    const registerPassword = ref('')
    const rePassword = ref('')

    function handleLogin() {
      console.log(username.value, password.value, rememberMe.value)
    }

    function handleRegister() {
      console.log(registerUsername.value, registerPassword.value)
    }

    return () => {
      return (
        <div class="container">
          <div class="loginbox">
            <div class="loginbox-in">
              <div class="userbox">
                <span class="iconfont">&#xe6a0;</span>
                <ElInput
                  class="input"
                  type="text"
                  v-model={username.value}
                  placeholder="请输入账号"
                ></ElInput>
              </div>

              <div class="pwdbox">
                <span class="iconfont">&#xe8b2;</span>
                {/* <input  class="pwd"  id="password" v-model={pwd} type="password"  placeholder="密码"> */}
                <ElInput
                  class="input"
                  type="password"
                  placeholder="请输入密码"
                  show-password="true"
                ></ElInput>
              </div>

              <div class="pwdbox">
                <span class="iconfont">&#xe8b2;</span>
                {/* <input  class="pwd"  id="re_password"  v-model={repwd} type="password"  placeholder="确认密码"> */}
                <ElInput
                  class="input"
                  type="rePassword"
                  placeholder="确认密码"
                  show-password="true"
                ></ElInput>
              </div>

              <button type="primary" class="register_btn" onClick="register">
                Register
              </button>
            </div>

            <div class="background">
              <div class="title">Welcome to WH System Management Center</div>
            </div>
          </div>
        </div>
      )
    }
  }
})
