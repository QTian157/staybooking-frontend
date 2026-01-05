import logo from './logo.svg';
import './App.css';

import React from 'react';

import { Layout, Dropdown, Menu, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import LoginPage from './components/LoginPage';
import HostHomePage from './components/HostHomePage';
import GuestHomePage from './components/GuestHomePage';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import { Button } from 'antd';
 
// function App() {
//   return <div className="App"></div>
// }

// export default App;

// react component: 是函数/返回 JSX/条件	是否必须

const { Header, Content} = Layout;
class App extends React.Component {
  state = {
    authed: false,
    asHost: false,
  };

  // localStorage：“记住我是谁”
  // setState：“告诉 React 现在该怎么画页面”
  // this.setState:是每个class component都会发生的，是会和原来的state合并

  componentDidMount() { //→ 页面刷新 / 重新打开，只看localStorage UI不会变化 必须setState
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true"; // localStorage 只能存字符串, === "true" 转成布尔值
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }


  handleLoginSuccess = (token, asHost) => { // 用户刚登录
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };


  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };

  // renderContent 做业务逻辑
  // render 做布局
  // react component <ReactComponent />的职责: 1. 布局 2. 业务逻辑
  renderContent = () => { 

    // // “函数从父传给子” + “子调用函数通知父” = “callback 作为 props 传递”
    // 这是把“父组件的函数”传给子组件，让子组件在合适的时候“反向通知父组件” -> 这叫：callback 作为 props 传递。
    // 父组件 render 时把函数传下去 👉 相当于：props.handleLoginSuccess = this.handleLoginSuccess;
    // 子组件（LoginPage）接收这个函数: 在LoginPage里 this.props.handleLoginSuccess() 调用
    // 子组件在登录成功后调用它: this.props.handleLoginSuccess(token, asHost);

    // 为什么不能“在 LoginPage 里直接 setState”？
    // 因为：authed 是 父组件的 state, LoginPage 不能直接改父组件的 state
    // 这个写法在 React 里叫“提升状态”（lifting state up）
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }

    if (this.state.asHost) {
      return <HostHomePage />
    }

    return <GuestHomePage />;
  };

  // Dropdown 组件: 点击头像弹出菜单
  // Ant v6 Dropdown 组件改了 API, overlay 改成了 menu
  // 1. 删掉 Menu 的 import（你不需要 Menu 了）
  // 2. 用 menu={{ items: [...] }} 替代 overlay={...}
  // userMenu = (
  //   <Menu>
  //     <Menu.Item key="logout" onClick={this.handleLogOut}>
  //       Log Out
  //     </Menu.Item>
  //   </Menu>
  // );


  render() {
    //dropdown menu 改成这样
    const menuItems = [
      {
        key: "logout",
        label: "Log Out",
        onClick: this.handleLogOut,
      },
    ];
    return (
      <Layout style={{ height: "100vh" }}>
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stays Booking
          </div>
          {this.state.authed && (
            <div>
               <Dropdown trigger={["click"]} menu={{ items: menuItems }}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}


export default App;

// 0. <header> </header> 这个标签是 HTML5 语义化标签，表示“页面的头部区域”
  // 两个功能： 一个icone staybooking； 一个右上角的用户头像点击弹出菜单登出

// 1. vh: view height 视口高度 100vh: 视口高度的100%
// 2. flexbox: 弹性盒子布局: style ={{display: 'flex', justifyContent: 'space-between'}} 字体几等分

// true && "hello"    // → "hello"
// false && "hello"   // → false
// 规则是：
  // 左边是 true → 返回右边
  // 左边是 false → 直接返回 false

// 3. {this.renderContent()} 这个是class里的component调用自己的方法
// render{
//   return(
//     <Content>
//       {this.renderContent()}
//     </Content>
//   )
// }

// 4. <LoginPage /> 这个是react component的用法

// 5. Dropdown 组件: 点击头像弹出菜单
// overlay 属性: 菜单内容
// trigger="click": 点击触发下拉菜单(默认是hover悬停触发)

// 6. 为什么 handleLogOut / handleLoginSuccess 放在 class 里，却不是像 menuItems 一样放在 render() 里面？
// 因为 handleLogOut / handleLoginSuccess 不是“每次 render 都会变的东西”，而 menuItems 可能会用到 this.state 里的值，每次 render 都会变。
// 一句话总规则（这是 React 的“铁律”）: “行为（actions / callbacks）放 class 里；描述 UI 的临时数据放 render 里。”
  // -> menuItems: 描述 Dropdown “长什么样”/ 用一次 render/ render 结束就没意义了 👉 UI 配置
  // -> handleLogOut: 不描述 UI/ 不关心“长什么样”/ 描述“点击后发生什么”/ 关心的是：“发生了什么 → 我该怎么反应” 👉 组件行为（business logic）,多次 render 都用得到 👉 业务逻辑
  // -> handleLoginSuccess: 描述“登录成功后发生什么”/ 多次 render 都用得到 👉 业务逻辑

// 7. renderContent() 真正的逻辑结构是（用中文翻译）
  //  如果【没登录】
  //   → 显示登录页
  // 否则（已经登录了）
  //   如果【是 host】
  //     → host 页面
  //   否则
  //     → guest 页面
