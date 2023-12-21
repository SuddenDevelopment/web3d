'use client';
import { Button, Card, Checkbox, Col, Form, Input, InputNumber, List, message, Modal, Upload, Row, Select, Space, Tabs} from 'antd';
import { DeleteOutlined, FileImageOutlined, LinkOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';



const onUpload = (info) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}


export default function Home() {
    const [pages, setPages] = useState([]);
    const [showModal, setModal] = useState(false);
    const [objFormFields, setFormFields] = useState({});
    const [objForm] = Form.useForm();
    const getPages = () => {
        fetch('/api/page')
            .then(response => response.json())
            .then(data => setPages(data));
    };
    const onOk = () => {
        setModal(false);
        getPages();
    };
    const tabPage = (
        <>
            <List 
                style={{margin:'1rem'}}
                header={
                <Row>
                    <Col span={12}>
                        <h3>My Web3D Assets</h3>
                    </Col>
                    <Col span={12} style={{textAlign:'right'}}>
                            <Button onClick={() => setModal(true)}>Upload New Model + Create Page</Button> 
                    </Col>
                </Row>}
                grid={{ gutter: 16, column: 4 }}
                dataSource={pages}
                renderItem={(file) => (
                <List.Item>
                    <Card title={file}>
                        <Space>
                            <a href={`r3f_${file}`}><LinkOutlined /></a>
                            <FileImageOutlined />
                        </Space>
                    </Card>
                </List.Item>
                )}>
            </List>
            <Modal
                title="Create New Page"
                onCancel={() => setModal(false)}
                onOk={onOk}
                open={showModal}>
                <Form
                    form={objForm}
                    initialValues={{
                        template: 'stage',
                        ambient: 1,
                        exposure: 0.1,
                        precision: 3,
                        instances: true,
                        camera: true,
                        shadows: true,
                        orbit: false,
                        transform: false
                      }}>
                    <Form.Item label="Page Name" name="name">
                        <Input 
                            allowClear
                            placeholder="Enter Page Name: a-z 0-9 only"
                        />
                    </Form.Item>
                    <Form.Item label="Template" name="template">
                        <Select>
                            <Select.Option value="stage">Stage</Select.Option>
                            <Select.Option value="scene">Scene</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="ambient" label="Ambient Light Intensity">
                        <InputNumber min={0} max={1000} />
                    </Form.Item>
                    <Form.Item name="precision" label="Precision">
                        <InputNumber min={1} max={9} />
                    </Form.Item>
                    <Form.Item name="exposure" label="Lighting Multiplier">
                        <InputNumber min={.0001} max={1000} />
                    </Form.Item>
                    <Form.Item name="instances" valuePropName="checked">
                        <Checkbox>Create Instances</Checkbox>
                    </Form.Item>
                    <Form.Item name="camera" valuePropName="checked">
                        <Checkbox>Use Camera</Checkbox>
                    </Form.Item>
                    <Form.Item name="shadows" valuePropName="checked">
                        <Checkbox>Use Shadows</Checkbox>
                    </Form.Item>
                    <Form.Item name="transform" valuePropName="checked">
                        <Checkbox>Transform for Web</Checkbox>
                    </Form.Item>
                    <Form.Item name="orbit" valuePropName="checked">
                        <Checkbox>Use Orbit Controls</Checkbox>
                    </Form.Item>
                    
                </Form>
                <Upload
                    data={()=>objForm.getFieldsValue()}
                    onChange={onUpload}
                    action='api/model'
                    multiple={false}
                    maxCount={1}
                    name='model'>
                    <Button type="primary" icon={<UploadOutlined />}>Choose a .gltf or .glb File</Button>
                </Upload>
            </Modal>
            </>);

    const tabHelp = (
        <>
        <div>
            This is a compilation of projects and efforts. This is just to make sense of it for beginners. When you find the limitations of what is here you will want some of the following links.
        </div>
        <h2>References</h2>
        <ul>
            <li>< a href="https://nodejs.org/en" target="_blank">Node.js</a>: 
                Node.js is what the server side components and everything for building is based on. It is a server side javascript runtime.
            </li>
            <li>< a href="https://nextjs.org/" target="_blank">Next.js:</a> 
                Next is a framework on top of node that handles routing and a number of other conveniences over having to configure Express yourself.
            </li>
            <li>< a href="https://threejs.org/" target="_blank">Three.js:</a>
                Three.js is a javascript library for rendering 3D graphics in a browser. It is the foundation of all the 3D stuff here.
            </li>
            <li>< a href="https://react.dev/" target="_blank">React:</a>
                React is a javascript library for building user interfaces. It is the foundation of all the 2D stuff here. It is also the foundation for React 3 Fiber.
            </li>
            <li>< a href="https://github.com/pmndrs/react-three-fiber" target="_blank">React 3 Fiber AKA R3F:</a>
                R3F is a library for using Three.js with React. It makes three.js accessible and composable.
            </li>
            <li>< a href="https://vercel.com/" target="_blank">Vercel:</a>
                Vercel is a hosting platform for Next.js. This is where we publish the easiest.
            </li>
            <li>< a href="https://www.blender.org/" target="_blank">Blender:</a>
                Blender is a 3D modeling and animation tool. This is the best tool to convert files and prepare them for the web.
            </li>
            <li>< a href="https://docs.blender.org/manual/en/2.80/addons/io_scene_gltf2.html" target="_blank">GLTF:</a>
                This explains the GLTF features supported in Blender. This is necessary to understand for materials.
            </li>
            <li>< a href="https://www.cgtrader.com/" target="_blank">CGTrader:</a>
                The best place to look for gltf compatible assets
            </li>         
        </ul>
        <div>
            <h2>What do we next?</h2>
            Come to the Discord and let me know. Here is what I have in mind
        <ul>
            <li>A Scene Editor like <a href="https://triplex.dev/">triplex.dev</a></li>
            <li>AN Animation tool like <a href="https://www.theatrejs.com/">theater.js</a></li>
            <li>Material tools nodeToy, material library</li>
        </ul>
        Want to contribute? submit a PR!</div>
        <div>Quicklink to videos: <a href="https://www.youtube.com/playlist?list=PL3byLw6d0rESiG4U1_XmxxJdJ-ErJFcaf">YOUTUBE</a></div>
        <div>
            <h2>Recommended Blender Addons</h2>
            <ul>
                <li><a href="https://blendermarket.com/products/simplebake---simple-pbr-and-other-baking-in-blender-2?ref=963">SimpleBake: help bake textures for materials</a></li>
                <li><a href="https://blendermarket.com/products/kit-ops-pro-asset--kitbashing-addon?ref=963">KitOps: general purpose foundational workflow helper</a></li>
            </ul>
        </div>
        </>
    );
    
    const arrTabs = [
        {
          key: '1',
          label: 'PAGES',
          children: tabPage,
        },{
          key: '2',
          label: 'HELP',
          children: tabHelp,
        }
      ];
    useEffect(getPages, []);

        return (
            <Tabs 
                defaultActiveKey="1" 
                type="card"
                items={arrTabs}
            />
        );
}