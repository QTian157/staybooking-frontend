import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login, register } from "../utils";

// 用在App.js里的renderContent里
// 功能：login、signup/ asHost/ submit
// <space> 能似的ant design的component的margin隔开一定距离

class LoginPage extends React.Component {
  formRef = React.createRef(); // 不会reRender周期 👉 ref = “直接拿到某个组件实例的钥匙”, 把formRef绑定到Form上
  state = {
    asHost: false,
    loading: false,
  };

  // onFinish 只有在 Form submit 时才会触发。
  // 你现在用的是手动提交，所以它不会被用到。
  onFinish = () => {
    console.log("finish form");
  };


  handleLogin = async () => {

    // Implement login logic here
    // 怎么从Form里拿username和password？
    const formInstance = this.formRef.current; // 当前这个 Form 的“实例对象”

    try {
      await formInstance.validateFields(); // 看所有 Form.Item 的 rules，抛错就catch，如果都 OK → 正常返回
    } catch (error) {
      return;
    }

    // 👉 loading: true, 告诉界面“我正在登录，请等一下”
    // React 收到这个信息后，会： 1. 合并 state 2. 重新执行 render() 3. UI 根据 loading 的值变化
    this.setState({
      loading: true,
    });

    // 真正拿数据: formInstance.getFieldsValue(true)
    // const resp = await login(formInstance.getFieldsValue(true), asHost);
    // 等价于：
    // const formData = {
    //     username: "...",
    //     password: "..."
    // };

    // ① 读当前身份: const { asHost } = this.state;
    // ② 真正的登录请求（核心): const resp = await login(formData, asHost);
    // 👉 login() 里会 JSON.stringify(formData) 发给后端

    // ③ 登录成功 → 通知父组件: this.props.handleLoginSuccess(resp.token, asHost);

    // 几乎所有异步操作都长这样：
    // setLoading(true);
    
    //-------------------------------------------------
    // try {
    // await asyncTask();
    // success();
    // } catch (error) {
    // showError();
    // } finally {
    // setLoading(false);
    // }
    // -------------------------------------------------

    try {
      const { asHost } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      this.props.handleLoginSuccess(resp.token, asHost);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  handleRegister = async () => {
    const formInstance = this.formRef.current;


    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }


    this.setState({
      loading: true,
    });


    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    });
  };


  render() {
    return (
      // 上下margin是20px，左右是auto居中
      <div style={{ width: 500, margin: "20px auto" }}> 
        <Form ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asHost}
            onChange={this.handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button
            onClick={this.handleLogin}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Log in
          </Button>
          <Button
            onClick={this.handleRegister}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>
      </div>
    );
  }
}


export default LoginPage;

// 1. Form 是怎么“记住 username / password 的”？
// Form 会自动记住用户输入的值，因为 Form.Item 会将输入值绑定到对应的字段名上。->
/* <Form.Item
  name="username"
  rules={[{ required: true, message: "Please input your username!" }]}
>
  <Input /> */
//  🔴 重点：name="username"
// “这个输入框的值，存到 Form 里，key 叫 username / password”
// 所以 Form 内部其实维护了一个对象：{username: "用户输入的值",}

// 2. <Input disabled={this.state.loading} />
// 这个 Input 组件的 disabled 属性，控制这个输入框“能不能输入”。
// 当 loading=true 时，disabled=true，输入框变灰，用户不能输入。
// 当 loading=false 时，disabled=false，输入框恢复正常，用户可以输入。