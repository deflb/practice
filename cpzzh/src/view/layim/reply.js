import React, { Component } from 'react';
import {InputItem, Button, Toast, TextareaItem ,} from 'antd-mobile';
import styles  from './index.less';
import {socketIp,} from '../../request/baseURL';
import { connect } from 'react-redux';
import routerBase from '../../router/routerBase';
let socket;
export default connect(state => ({
    userInfo: state.userInfo
}))(class reply extends Component {
    state = {
        name:"",
        tel:'',
        content:''
    }
    componentDidMount(){
      
    }
    socket=(param)=>{
        const  http ="ws:"+socketIp+"?serviceType=1&source=1&customerId="+this.props.userInfo.customerId
        socket = new WebSocket(http);
        let that = this;
        socket.onopen = function(e){
            socket.send(param)
        };
        
        socket.onmessage = function(e){
        
        var data = e.data;
        var dataObj = JSON.parse(data);//转换为json对象
    
            switch(dataObj.command){
             case 59:
                Toast.success(dataObj.msg)
                that.toLayIm()
             break;
              
            default:
            return null
            }
        
        };
       
    }
    toLayIm=()=>{
        const { history } = this.props;
        history.replace(routerBase + '/personalCenter')
    }
    commit=()=>{
        let {name,tel,content} =this.state;
        let data = `{"cmd":58,
                    "name":"${name}",
                    "phone":"${tel}",
                    "reminder":"${content}"}`;
        this.socket(data)
    }
    render() {
        let {name,tel,content} =this.state;
        return (
        <div className={styles.reply} >
            <div className="redColor mt-8 mb-32 tc">当前暂无客服在线，如需帮助请留言</div>
            <div className="mb-32">
                <label><span className="redColor">*</span>姓名</label>
                <InputItem 
                    name={name} 
                    onChange={(v)=>{
                        this.setState({
                            name:v
                        })
                    }}
                 className={styles.InputItem}/>
            </div>
            <div className="mb-32">
                <label><span className="redColor">*</span>手机</label>
                <InputItem 
                 onChange={(v)=>{
                    this.setState({
                        tel:v
                    })
                }}
                tel={tel} className={styles.InputItem}/>
            </div>
            <div className="mb-32">
                <label><span className="redColor">*</span>留言</label>
                <TextareaItem 
                     onChange={(v)=>{
                        this.setState({
                            content:v
                        })
                    }}
                content={content} rows={3} className={styles.InputItem}></TextareaItem>
            </div>
            <div className="btn">
                <Button type="primary" onClick={this.commit}>提交</Button>
            </div>
         </div>
        );
    }
})