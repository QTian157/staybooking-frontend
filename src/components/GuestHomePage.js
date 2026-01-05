import React, { useEffect, useState } from 'react';
import { message, Tabs, List, Card, Image, Carousel, Form, Button, InputNumber, DatePicker,Typography,Tooltip, Modal, Space} from "antd";
// import Text from "antd/lib/typography/Text";
import { StayDetailInfoButton } from "./HostHomePage";
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";
import { searchStays, bookStay, getReservations, cancelReservation} from '../utils';

const {TabPan} = Tabs;
const {Text} = Typography;

// SearchStays component骨架
// renderItem 怎么把数组形的datasorce转化成render可用的JXS -> (item) => { return <JSX />}
// class SearchStays extends React.Component {
//     render(){
//         return(
//             <>
//                 <Form></Form>
//                 <List
//                     style={{marginTop: "20"}}
//                     dataSource={[]}
//                     renderItem={(item) => {
//                         <List.Item>
//                             <Card
//                                 key={item.id}
//                                 title={旁边的info button}
//                             />
                            
//                         </List.Item>
//                     }}
//                 />
//             </>
//         )
//     }
// }

// SearchStays component进阶
// class SearchStays extends React.Component {
//     state = {
//         loading: false,
//     }

//     search = async() => {};

//     render(){
//         return(
//             <>
//                 <Form onFinish ={this.search} layout={"inline"}>
//                     <Form.Item 
//                         label="Guest Number"
//                         name="guest_number"
//                         rules={[{required: true , message: "Please input guest number"}]}
//                     >
//                         <InputNumber min={1}/>
//                     </Form.Item>
//                     <Form.Item 
//                         label="Checkin Date"
//                         name="checkin_date"
//                         rules={[{required: true , message: "Please input checkin date"}]}
//                     >
//                         <DatePicker />
//                     </Form.Item>
//                     <Form.Item 
//                         label="Checkout Date"
//                         name="checkout_date"
//                         rules={[{required: true , message: "Please input checkout date"}]}
//                     >
//                         <DatePicker />
//                     </Form.Item>
//                     <Form.Item >
//                         <Button 
//                             htmlType = "submit"
//                         > 
//                             Submit
//                         </Button>
//                     </Form.Item>

//                 </Form>
//                 <List
//                     style={{marginTop: 20}}
//                     loading={this.state.loading}
//                     grid={{
//                     gutter: 16,
//                     xs: 1,
//                     sm: 3,
//                     md: 3,
//                     lg: 3,
//                     xl: 4,
//                     xxl: 4,
//                     }}
//                     dataSource={this.state.data}
//                     renderItem={(item) => (
//                     <List.Item >
//                         <Card
//                         key={item.id}
//                         title={
//                             <div style={{ display: "flex", alignItems: "center" }}>
//                             <Text ellipsis={true} style={{ maxWidth: 150 }}>
//                                 {item.name}
//                             </Text>
//                             <StayDetailInfoButton stay={item} />
//                             </div>
//                         }
//                         actions={[]}
//                         extra={null}
//                         >
                       
//                         {(item.images ?? []).length === 0 ? (
//                             <div style={{ textAlign: "center", padding: 40 }}>
//                             No images
//                             </div>
//                         ) : (
//                             <Carousel
//                             dots={false}
//                             arrows={true}
//                             prevArrow={<LeftCircleFilled />}
//                             nextArrow={<RightCircleFilled />}
//                             >
//                             {(item.images ?? []).map((image) => (
//                                 <div key={image.id ?? image.url}>
//                                 <Image src={image.url} width="100%" />
//                                 </div>
//                             ))}
//                             </Carousel>
//                         )}

//                         </Card>
//                     </List.Item>
//                     )}
//                 />
//             </>
//         )
//     }
// }

class SearchStays extends React.Component {
  state = {
    data: [],
    loading: false,
    searched: false,
  };


  search = async (query) => {
    this.setState({
      loading: true, 
      searched: true,
    });
    
    // query是form给的，当submit 的时候会传过来
    try {
      const resp = await searchStays(query); // 调用 utils.js 里的 searchStays 方法进行前后端通信
      // this.setState({
      //   data: resp,
      // });
      // 这么改 如果没有搜到stay 会弹个info
      // message.info 是 antd 里的一个全局提示方法（toast / notification）。
      if (!resp || resp.length === 0) {
        message.info("No stays found");
      }
      this.setState({ data: resp || [] });
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
      <>
        <Form onFinish={this.search} layout="inline">
          <Form.Item
            label="Guest Number"
            name="guest_number"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            label="Checkin Date"
            name="checkin_date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Checkout Date"
            name="checkout_date"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <List
          style={{ marginTop: 20 }}
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
          locale={{
            emptyText: this.state.searched
              ? "No stays found"
              : "Please fill the form and click Submit to search",
          }}
          renderItem={(item) => (
            <List.Item>
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
                extra={<BookStayButton stay={item} />}
              >
                {
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
              </Card>
            </List.Item>
          )}
        />
      </>
    );
  }
}

// class BookStayButton extends React.Component {
//     state ={
//         loading: false,
//         modalVisible: false,
//     }

//     handleCancle = () => {
//         this.setState({
//             modalVisible: false,
//         });
//     };

//     handleBookStay = () => {
//         this.setState({
//             modalVisible: true,
//         });
//     };
//     render(){
//         return(
//             <></> 
//         );
//     }
// }

class BookStayButton extends React.Component {
  state = {
    loading: false,
    modalVisible: false,
  };


  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };


  handleBookStay = () => {
    this.setState({
      modalVisible: true,
    });
  };


  handleSubmit = async (values) => {
    const { stay } = this.props;
    this.setState({
      loading: true,
    });


    try {
      await bookStay({
        checkin_date: values.checkin_date.format("YYYY-MM-DD"),
        checkout_date: values.checkout_date.format("YYYY-MM-DD"),
        stay: {
          id: stay.id,
        },
      });
      message.success("Successfully book stay");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    const { stay } = this.props;
    return (
      <>
        <Button onClick={this.handleBookStay} shape="round" type="primary">
          Book Stay
        </Button>
        <Modal
          destroyOnClose={true}
          title={stay.name}
          open={this.state.modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Form
            preserve={false}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={this.handleSubmit}
          >
            <Form.Item
              label="Checkin Date"
              name="checkin_date"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Checkout Date"
              name="checkout_date"
              rules={[{ required: true }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
              >
                Book
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

// MyReservations component class
// class MyReservations extends React.Component {
//   state = {
//     loading: false,
//     data: [],
//   };


//   componentDidMount() {
//     this.loadData();
//   }


//   loadData = async () => {
//     this.setState({
//       loading: true,
//     });


//     try {
//       const resp = await getReservations();
//       this.setState({
//         data: resp,
//       });
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       this.setState({
//         loading: false,
//       });
//     }
//   };


//   render() {
//     return (
//       <List
//         style={{ width: 1000, margin: 0 }}
//         loading={this.state.loading}
//         dataSource={this.state.data}
//         renderItem={(item) => (
//           <List.Item actions={[
//             <CancelReservationButton onCancelSuccess={this.loadData} reservationId={item.id} />,
//           ]}>
//             <List.Item.Meta
//               title={<Text>{item.stay.name}</Text>}
//               description={
//                 <>
//                   <Text>Checkin Date: {item.checkin_date}</Text>
//                   <br />
//                   <Text>Checkout Date: {item.checkout_date}</Text>
//                 </>
//               }
//             />
//           </List.Item>
//         )}
//       />
//     );
//   }
// }

function MyReservations() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getReservations();
      setData(resp);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <List
      style={{ width: 1000, margin: 0 }}
      loading={loading}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <CancelReservationButton
              onCancelSuccess={loadData}
              reservationId={item.id}
            />,
          ]}
        >
          <List.Item.Meta
            title={<Text>{item.stay.name}</Text>}
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


class CancelReservationButton extends React.Component {
  state = {
    loading: false,
  };


  handleCancelReservation = async () => {
    const { reservationId, onCancelSuccess } = this.props;
    this.setState({
      loading: true,
    });


    try {
      await cancelReservation(reservationId);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }


    onCancelSuccess();
  };


  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleCancelReservation}
        danger={true}
        shape="round"
        type="primary"
      >
        Cancel Reservation
      </Button>
    );
  }
}



class GuestHomePage extends React.Component {

    render(){
        return(
            <Tabs defaultActiveKey='1' destroyInactiveTabPane>
                <TabPan tab="Search Stays" key="1">
                    <SearchStays />
                </TabPan>
                <TabPan tab="My Reservations" key="2">
                    <MyReservations />
                </TabPan>
            </Tabs>
        )
    }
}
export default GuestHomePage;

// 1. List, List.Item, Card

// 2. filter search: Form: 人数，日期checkin/checkout/ button search