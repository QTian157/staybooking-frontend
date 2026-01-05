import { message, Tabs, List, Card, Image, Carousel, Button, Tooltip, Modal, Space} from "antd";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { getStaysByHost, deleteStay, getReservationsByStay } from "../utils";

import { InfoCircleOutlined } from "@ant-design/icons";
import UploadStay from "./UploadeStay";


class ReservationList extends React.Component {
  state = {
    loading: false,
    reservations: [],
  };


  componentDidMount() {
    this.loadData();
  }


  loadData = async () => {
    this.setState({
      loading: true,
    });


    try {
      const resp = await getReservationsByStay(this.props.stayId);
      this.setState({
        reservations: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    const { loading, reservations } = this.state;


    return (
      <List
        loading={loading}
        dataSource={reservations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>Guest Name: {item.guest.username}</Text>}
              description={
                <>
                  <Text>Checkin Date: {item.checkin_date}</Text>
                  <br />
                  <Text>Checkout Date: {item.checkout_date}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}


class ViewReservationsButton extends React.Component {
  state = {
    modalVisible: false,
  };


  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };


  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
 
  // visible={modalVisible} ant design 4.23 之后改成 open={modalVisible}
  render() {
    const { stay } = this.props;
    const { modalVisible } = this.state;


    const modalTitle = `Reservations of ${stay.name}`;


    return (
      <>
        <Button onClick={this.openModal} shape="round">
          View Reservations
        </Button>
        {modalVisible && (
          <Modal
            title={modalTitle}
            centered={true}
            open={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList stayId={stay.id} />
          </Modal>
        )}
      </>
    );
  }
}



class RemoveStayButton extends React.Component {
  state = {
    loading: false,
  };


  handleRemoveStay = async () => {
    const { stay, onRemoveSuccess } = this.props;
    this.setState({
      loading: true,
    });


    try {
      await deleteStay(stay.id);
      onRemoveSuccess();
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveStay}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Stay
      </Button>
    );
  }
}



const { TabPane } = Tabs;

// 这里除了host， guest也需要看 所以要export出去
export class StayDetailInfoButton extends React.Component{
  state={
    modalVisible: false,
  }

  openModal =() => {
    this.setState({
      modalVisible: true,
    })
  }
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    })
  }
    render() {
        const { modalVisible } = this.state;

        const stay = this.props.stay ?? {};
        const {
          name,
          description,
          address,
          guest_number,

        } = stay;

        const guestNum = guest_number ??  "N/A";
        return (
          <>
            <Tooltip title="View Stay Details">
              <Button 
              onClick={this.openModal}
              style={{ border: "none"}}
              size="large"
              icon={<InfoCircleOutlined />}
              />
            </Tooltip>
            <Modal
              title={name ?? "Stay Details"}
              centered
              open={modalVisible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong>Description</Text>
                <Text type="secondary">{description ?? "N/A"}</Text>

                <Text strong>Address</Text>
                <Text type="secondary">{address ?? "N/A"}</Text>

                <Text strong>Guest Number</Text>
                <Text type="secondary">{guestNum}</Text>
              </Space>
            </Modal>
          </>
        )
    }
}

// 这个不需要export 因为不是shared
// 需要在didMount里load data
// class MyStays extends React.Component{
//     state = {
//         loading: false,
//         data:[],
//     }

//     componentDidMount(){
//         this.loadData();
//     }

//     loadData = async () =>{

//     }
//     render(){
//         return (
//             <List
//                 loading={this.state.loading}
//                 dataSource={this.state.data}
//                 renderItem={(item) =>(
//                     <Card></Card>
//                 )}
//             />
//         )
//     }
// }
class MyStays extends React.Component {
  state = {
    loading: false,
    data: [],
  };


  componentDidMount() {
    this.loadData();
  }

  // load数据
    // 1. call API之前 loading：true
    // 2. call API成功，拿到数据，存到state里
    // 3. call API失败，弹error message
    // 4. finally loading：false
  loadData = async () => {
    this.setState({
      loading: true,
    });

    // 等同于await getStaysByHost().then(...).catch(...).finally(...)
    //   getStaysByHost().then(resp =>{
    //     this.setState(
    //         data: resp,
    //     )
    //   }).catch(error => {

    //   }).finally(() => {
        
    //   });
    try {
      const resp = await getStaysByHost(); // 调用 utils 里的 API
      this.setState({
        data: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    return (
      <List
        loading={this.state.loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={this.state.data}
        renderItem={(item) => (
          <List.Item >
            <Card
              key={item.id}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Text ellipsis={true} style={{ maxWidth: 150 }}>
                    {item.name}
                  </Text>
                  <StayDetailInfoButton stay={item} />
                </div>
              }
              actions={[<ViewReservationsButton stay ={item} />]}
              extra={<RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />}
            >
              {/* {
                <Carousel
                  dots={false}
                  arrows={true}
                  prevArrow={<LeftCircleFilled />}
                  nextArrow={<RightCircleFilled />}
                >
                  {item.images.map((image, index) => (
                    <div key={index}>
                      <Image src={image.url} width="100%" />
                    </div>
                  ))}
                </Carousel>
              }
               */}
              
              {(item.images ?? []).length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  No images
                </div>
              ) : (
                <Carousel
                  dots={false}
                  arrows={true}
                  prevArrow={<LeftCircleFilled />}
                  nextArrow={<RightCircleFilled />}
                >
                  {(item.images ?? []).map((image) => (
                    <div key={image.id ?? image.url}>
                      <Image src={image.url} width="100%" />
                    </div>
                  ))}
                </Carousel>
              )}

            </Card>
          </List.Item>
        )}
      />
    );
  }
}


class HostHomePage extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <TabPane tab="My Stays" key="1">
          <div>
            <MyStays />
          </div>
        </TabPane>
        <TabPane tab="Upload Stay" key="2">
          <div>
            <UploadStay />
          </div>
        </TabPane>
      </Tabs>
    );
  }
}


export default HostHomePage;
// 1. host home page 功能
    // 1. 展示 host 的 stays 列表 -> My Stays tab
    // 2. 上传新的 stay -> Upload Stay tab

    // Add component “StayDetailInfoButton” to this file
    // Add component “MyStays” to this file
    // Copy paste the whole “imports” area

    // 3. 功能: StayDetailInfoButton 组件
        // 1. 在 Card 里加一个 Info 按钮
        // 2. 点击 Info 弹出对话框 Modal，展示 stay 详情
        // 3. stay 详情包括：name, description, address, guest_number

    // 4. add delete stay 功能: Remove button on each stay card
        // 1. 在 Card 里加一个 Remove 按钮
        // 2. 点击 Remove 弹出确认对话框 Modal.confirm
        // 3. 确认删除后，调用 API 删除 stay
        // 4. 删除成功后，刷新 stays 列表
    // 5. add Reservations Button - reservation list



// 2. tabs component
    // antd 的 Tabs 组件
    // destroyInactiveTabPane: 切换 tab 时，销毁不活跃的 tab 内容，释放内存
    // <Tabs> 里放 <TabPane> 组件，每个 TabPane 代表一个标签页
        // tab 属性：标签页标题
        // key 属性：唯一标识每个标签页
    // defaultActiveKey 属性：默认激活的标签页 key
    // destroyInactiveTabPane 属性：切换标签页时，销毁不活跃的标签页内容，释放内存

// 3. Carousel component
    // antd 的 Carousel 组件
    // dots 属性：是否显示指示点
    // arrows 属性：是否显示左右箭头
    // prevArrow 和 nextArrow 属性：自定义左右箭头组件

// 4. item.images ?? []: 如果 item.images 是 null 或 undefined👉 用 [], 否则 👉 用 item.images
//    item.images && []:A && B -> 如果 A 是 truthy 👉 返回 B, 否则 👉 返回 A

// 5. <Button /> 和 <Button></Button> 的区别
    // <Button />: 自闭合标签，适用于没有子元素的情况 -> 不显示结构
    // <Button></Button>: 非自闭合标签，适用于有子元素的情况