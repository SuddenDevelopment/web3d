'use client';
import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import { ToolOutlined } from "@ant-design/icons";

export function Toolbox({sceneData}) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        console.log(sceneData);
    }, [sceneData]);
    return (
        <div style={{position:'absolute', zIndex:10, top:0, right:0, border:'3px solid #888', borderRadius:'3px',color:'#fff'}}>
            { visible &&
                <Drawer
                    title="Toolbox"
                    placement="right"
                    closable={true}
                    onClose={() => setVisible(false)}
                    open={visible}
                    width={350}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>
            }
            { !visible &&
                <button onClick={() => setVisible(true)} style={{borderRadius:'3px'}}><ToolOutlined /></button>
            }
        </div>
    );
}