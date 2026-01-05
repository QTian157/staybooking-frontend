

// class UploadStay extends React.Component {
//     handleSubmit = async (values) => {
//         console.log('Form values:', values);
//         const formData = new FormData();
//         formData.append()"","");
//         formData.append()"","");
//         formData.append()"","");
//         formData.append()"","");
//     }


//     render(){
//         const { handleSubmit} = this;
//         return (
//             <Form onFinish ={handleSubmit}>
//                 <Form.Item name="name" label="Name">
//                     <Input placeholder="Stay Name"/>
//                 </Form.Item>
//                 <Form.Item name="address" label="Address">
//                     <Input placeholder="Stay Address"/>
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                     <Input.TextArea placeholder="Stay Description"/>
//                 </Form.Item>
//                 <Form.Item name="guest_number" label="Guest Number">
//                     <InputNumber placeholder="Stay guest_number"/>
//                 </Form.Item>
//                 <Form.Item name="picture" label="Picture">
//                     <Input placeholder="Stay Image"/>

//                 </Form.Item>
//                 <Form.Item>
//                     <Button htmlType="submit">Submit</Button>
//                 </Form.Item>
//             </Form>
//         )
//     }
// }
// export default UploadStay;

import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadStay } from "../utils";


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


class UploadStay extends React.Component {
  state = {
    loading: false,
  };


  fileInputRef = React.createRef(); // 创建一个ref来引用文件输入元素 之前的login/register.js也是类似的
                                    // React.createRef() -> 专属于UploadStay组件的

  // FormData 拼装流程
  handleSubmit = async (values) => {
    const formData = new FormData(); // 创建一个新的FormData对象，用于存储表单数据
    const { files } = this.fileInputRef.current; // 通过ref获取文件输入元素的当前值，并解构出files属性
      // ✅ 这里才是需要 optional chaining 的地方


    // 验证文件数量: 因为下面用原生的input type="file"，所以不能用Form.Item的rules来验证
    // 只能在这里手动验证
    if (!files || files.length === 0) {
        message.error("Please select at least 1 picture.");
        return;
    }
    if (files.length > 5) {
      message.error("You can at most upload 5 pictures.");
      return;
    }
    
    // 验证每个文件大小
    // 限制每个图片最大5MB
    const maxSizeMB = 5;
    for (const f of files) {
        if (f.size > maxSizeMB * 1024 * 1024) {
            message.error(`Each image must be <= ${maxSizeMB}MB`);
            return;
        }
    }
    // 将文件添加到FormData对象中
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]); 
    }


    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("guest_number", String(values.guest_number)); // 转成字符串更稳


    this.setState({
      loading: true,
    });
    try {
      await uploadStay(formData);
      message.success("upload successfully");

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
      <Form
        {...layout}
        name="nest-messages"
        onFinish={this.handleSubmit}
        style={{ maxWidth: 1000, margin: "auto" }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Stay Name"/>
        </Form.Item>
        <Form.Item name="address" label="Address" rules={[{ required: true }]}>
          <Input placeholder="Stay Address"/>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea placeholder="Stay Description" autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
        <Form.Item
          name="guest_number"
          label="Guest Number"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber placeholder="Stay Guest Number"/>
        </Form.Item>
        <Form.Item name="picture" label="Picture" rules={[{ required: true }]}>
          <input
            type="file"
            accept="image/png, image/jpeg"
            ref={this.fileInputRef} // 使用ref引用文件输入元素
            multiple={true}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


export default UploadStay;

// 1. 浏览器的FormData对象允许你构建一组键/值对，表示表单字段和它们的值，可以使用它来轻松地发送包含文件上传的表单数据。
    // -> 使用React的ref来引用文件输入元素，以便在提交表单时访问所选的文件。
    // -> 在提交表单时，检查所选文件的数量，并将其附加到FormData对象中，然后将其他表单字段也附加进去。
    // -> 使用Ant Design的message组件来显示成功或错误消息，提升用户体验。

// 2.如何选择file input的文件并将其添加到FormData对象中？
    // -> 使用React的ref来引用文件输入元素，然后在提交表单时访问该引用以获取所选的文件列表。
    // -> 遍历文件列表，并使用FormData的append方法将每个文件添加到FormData对象中。

// 3.如何限制用户上传的文件数量？
    // -> 在提交表单时，检查文件输入元素的files属性的长度。如果超过限制数量，则显示错误消息并阻止表单提交。 

// 4. onFinish={this.handleSubmit} 这个语法是怎么理解的？
    // -> 这是React中传递函数作为属性的常见方式。onFinish是Ant Design Form组件的一个属性，它接受一个函数作为值。
    // -> 当表单提交且验证通过时，Form组件会调用这个函数。在这里，this.handleSubmit是UploadStay组件中的一个方法，它将在表单提交时被调用。
    // -> 这种语法确保了当表单提交时，handleSubmit方法能够正确地访问组件的状态和属性，因为它是通过this引用的。
        // <Form onFinish={this.handleSubmit}> 这意味着当表单提交时，handleSubmit方法将被调用，并且可以访问组件的上下文。
        // <Button htmlType="submit" loading={this.state.loading}>Submit</Button> 这个按钮的htmlType属性设置为"submit"，表示这是一个提交按钮。