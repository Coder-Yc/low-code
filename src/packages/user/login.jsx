import { defineComponent, ref } from 'vue'
import './LoginPage.scss'
import { ElInput, ElButton } from 'element-plus'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

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

    const router = useRouter()
    const route = useRoute()

    const formData = ref({
      username: 'abc',
      password: '123456',
      start: 0,
      end: 100
    })

    function handleLogin() {
      const u = username.value
      const p = password.value
      // console.log(u)
      let userInfo
      axios
        .post('http://localhost:8080/login', { username: u, password: p })
        .then((res) => {
          if (res.status == '200') {
            userInfo = res.data
            router.push({
              name: 'Block'
            })
          }
        })
    }
    function handleRoute() {}

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
                  v-model={username.value}
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
                  v-model={password.value}
                ></ElInput>
              </div>

              {/* <div class="pwdbox">
                <span class="iconfont">&#xe8b2;</span>
                <input  class="pwd"  id="re_password"  v-model={repwd} type="password"  placeholder="确认密码">
                <ElInput
                  class="input"
                  type="rePassword"
                  placeholder="确认密码"
                  show-password="true"
                ></ElInput>
              </div> */}

              {/* <button type="primary" class="register_btn" onClick="register">
                Register
              </button> */}
              <ElButton class="register_btn_" onClick={handleLogin}>
                登陆
              </ElButton>
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
