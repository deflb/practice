import React, { Component } from 'react';
import {TextareaItem, Button, Toast ,} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../request';
import api from '../../request/api';
import {socketIp,fileaddress,imgAddress} from '../../request/baseURL';
import { connect } from 'react-redux';
import {formatDate, toHMS } from '../../utlis';
import yuYin from '../../assets/icon/u2257.png'
import jianPan from '../../assets/icon/u2273.png'
import addImg from '../../assets/icon/u2248.png'
import closeImg  from '../../assets/icon/u1319.png'
import greenImg from '../../assets/icon/u2309.png'
import yellowImg from '../../assets/icon/u2313.png'
// import redImg from '../../assets/icon/u2317.png'
import severImg from '../../assets/icon/online_service_icon@3x.png'
import customerImg from '../../assets/icon/u827.png'
let socket;
export default connect(state => ({
    userInfo: state.userInfo,
    routeState: state.routeState,
}))(class layim extends Component {
    state = {
        orderId:'',
        orderNo:'',
        isYY:false,
        msgArr:[],
        userInfo:{},
        serverUser:{}
    }
    componentDidMount(){
       
        let data = `{"cmd":17,"customerId":0}`;
        this.socket(data);
    }
  
    leftIcon=()=>{
        let {isYY} =this.state;
        let src = isYY?jianPan:yuYin
        return <img className={styles.leftImg} alt="" width="80%" src={src}/>
    }
    rightIcon(){
        let {addfile} =this.state;
        let img = <img className={styles.leftImg} alt="" width="80%" src={addfile?closeImg:addImg}/>
        return img
    }
    changeLeft=()=>{
        let {isYY} =this.state;
        this.setState({
            isYY:!isYY,
            addfile:false
        })
    }
    changeRight=()=>{
        let {addfile} =this.state;
        this.setState({
            addfile:!addfile
        })
    }
    dataList = [
        { url: greenImg, title: '照片' },
        { url: yellowImg, title: '拍照' },
        // { url: redImg, title: '语音通话' },
      ].map(obj => ({
        icon: <img src={obj.url} alt={obj.title} style={{ width: 36 }} />,
        title: obj.title,
      }));
    socket=(param)=>{
        const { routeState } = this.props,
        { search } = routeState;
        let customerId = this.props.userInfo.customerId;
        if(search){
            let getUuid =  search.match(/(\?|&)id=([^&]*)/)
            customerId =getUuid ? getUuid[2] : customerId;
        }//方便测试地址后拼接?id=xxx
        if(!customerId){
            Toast.fail('客户参数不能为空')
            return 
        }
        const  http ="ws:"+socketIp+"?serviceType=1&source=1&customerId="+customerId
        socket = new WebSocket(http);
        let that = this;
        // var port = document.getElementById("port").value;
        // username = document.getElementById("username").value;
        socket.onopen = function(e){
            socket.send(param)
        };
        
        socket.onmessage = function(e){
        
        var data = e.data;
        var dataObj = JSON.parse(data);//转换为json对象
        // var paramObj = JSON.parse(param);
        let serverUser  ;
            switch(dataObj.command){
                case 9://加入群组的消息通知处理;
                break;
            case 10:
              serverUser = dataObj.data;
                break;
          
            case 12://聊天发送状态;

                break;
            case 14://聊天发送状态;

            break;
            case 18://获取用户信息响应处理;
               if(dataObj.data){
                   socket.close()
                    that.setState({
                    userInfo:dataObj.data
                   })
                   that.getServiceuser(dataObj.data.customerId)
               } else{
                    let {msgArr} = that.state;
                    msgArr.push({
                        msg:`<p>获取不到用户数据,请重试</p>`,
                        left:true,
                        time:new Date().getTime()
                    })
                    that.setState({
                        msgArr
                    })

               }
               
                break;
            case 20:
                if (dataObj.code === 10016) {//处理离线消息;
                    if (dataObj.data) {
                       
                    }
                } else if (dataObj.code === 10018) {//处理历史消息;

                }
                break;
            case 22://获取获取客服信息响应处理;
                if (dataObj.code === 10022) {//获取客服失败
                    let {msgArr} = that.state;
                    msgArr.push({
                        msg:`<p>获取客服失败</p>`,
                        left:true,
                        time:new Date().getTime()
                    })
                    that.setState({
                        msgArr
                       })

                } else if (!dataObj.data.online) {   //客服不在线
                    let serverUser = dataObj.data;
                    let {msgArr} = that.state;
                        msgArr.push({
                            msg:`<p>${serverUser.messageReminder}</p>`,
                            left:true,
                            iswait:true,
                            time:new Date().getTime()
                        })
                        that.setState({
                            msgArr
                           })

                } else if (dataObj.code) { //获取客服信息
                   let serverUser = dataObj.data;
                   if(serverUser.user){
                       let {msgArr} = that.state;
                            msgArr.push({
                                msg:serverUser.messageWelcome,
                                left:true,
                                time:new Date().getTime()
                            })
                            console.log(msgArr)
                       that.setState({
                        msgArr,
                        serverUser:serverUser.user
                       })
                    }else{
                        let {msgArr} = that.state;
                        // console.log(serverUser.waitUser)
                        msgArr.push({
                        msg:`<p>前方还有${serverUser.waitUser}人在排队</p>`,
                            left:true,
                            iswait:true,
                            time:new Date().getTime()
                        })
                        that.setState({
                            msgArr
                           })
                    }
                   

                }
                break;
            case 23:
            if(dataObj){
                that.setState({
                    isOver:true
                })
                let data =`{
                    "from": "${customerId}",
                    "to": "${dataObj.data}",
                    "cmd":"14",
                }
                `;
               
                 that.socket(data);
            }
           
            break;
            case 68:
            serverUser = dataObj.data;
            if(serverUser){
                let {msgArr} = that.state;
                     msgArr.push({
                         msg:serverUser.messageWelcome,
                         left:true,
                         time:new Date().getTime()
                     })
                     console.log(msgArr)
                that.setState({
                 msgArr,
                 serverUser:serverUser.user
                })
             }
            break;
            case 69:
            let {msgArr} = that.state;
            msgArr.push({
                msg:`<p>前方还有${serverUser.waitUser}人在排队</p>`,
                left:true,
                iswait:true,
                time:new Date().getTime()
            })
            that.setState({
                msgArr
               })
            break;
            case 70://接收到聊天响应处理;
            let {userInfo} =that.state;
           //&&dataObj.data.to===userInfo.id
            if (dataObj.data.msgType === 0) {  //文字
                let {msgArr} = that.state;
                if(dataObj.data.from===userInfo.id){
                    msgArr.push({
                        msg:dataObj.data.content,
                        left:false,
                        time:dataObj.data.createTime
                    })  
                    that.setState({
                        msgArr
                       })
                    return
                }
                msgArr.push({
                    msg:dataObj.data.content,
                    left:true,
                    time:dataObj.data.createTime
                })
                that.setState({
                    msgArr
                   })
                return
            } else if (dataObj.data.msgType === 1) { //图片
                let {msgArr} = that.state;
                if(dataObj.data.from===userInfo.id){
                    msgArr.push({
                        msg:dataObj.data.content,
                        left:false,
                        isImg:true,
                        time:dataObj.data.createTime
                    })  
                    that.setState({
                        msgArr
                       })
                    return
                }
                msgArr.push({
                    msg:dataObj.data.content,
                    left:true,
                    isImg:true,
                    time:dataObj.data.createTime
                })
                that.setState({
                    msgArr
                   })
                return
            }
           
            break;
              
            default:
            return null
            }
        
        };
        // socket.onclose=function (){
        //     Toast.fail('连接已关闭')
        // }
    }
    mshSend=(contents={},msgType)=>{
        let {serverUser,content,userInfo,isOver} = this.state;
        let type = msgType?msgType:'0';
        let text = contents.url?contents.url:content;
        if(Number(msgType)===6){
            text = contents
        }
      
        let data =`{
            "from": "${userInfo.id}",
            "to": "${serverUser.id}",
            "cmd":"11",
            "createTime": "${new Date().getTime()}",
            "msgType": "${type}",
            "chatType":"2",
            "sendUserType":"1",
            "serviceType":"1",
            "content": "${text}",
            "name":"${contents.fileName}"
        }
        `;
       
      
        if(!isOver){
            socket.close();
            this.socket(data);
            this.setState({
                content:''
            })
        }
        this.autoScroll()
       
    }
    autoScroll =()=>{//滚动条自动
        if(document.getElementsByClassName(styles.content)[0])
        setTimeout(()=>{
            var top = document.getElementsByClassName(styles.content)[0].scrollHeight;
            document.getElementsByClassName(styles.content)[0].scrollTo(0,top+100)
         
        },100)
    }
    getTalkList=(id)=>{
       
        let d =`{"cmd":60,"type":"0","customerId":"${id||this.state.userData.id}"}`;
        this.socket(d);
    }
   
    getServiceuser=(data)=> {
        var datas = `{"cmd":21,"customerId": "${data}"}`;
        this.socket(datas);
    }
    getMsg=(list)=>{
        return list.map((item,index)=>{
            return <div key={item.time+"msg"+index} className={item.left?styles.leftMsg:styles.rightMsg}>
                        <div className={styles.attar+' left'}><img src={item.left?severImg:customerImg} width="100%" alt=""/></div>
                        <div className={styles.flex1}>
                            <div className="overflow">{item.isImg?<img className={styles.msgContent} src={imgAddress + item.msg} width="60%" alt=""/>:<div className={styles.msgContent} dangerouslySetInnerHTML={{ __html: item.msg }}></div>}</div>
                            <div className={styles.time}>{formatDate(item.time)} {toHMS(item.time)}{item.iswait?<span className="blueColor tc" onClick={this.toReply}>去留言</span>:''}</div>
                            
                        </div>
                        <div className={styles.attar+' right'}><img src={item.left?severImg:customerImg} width="100%" alt=""/></div>
                    </div>
        })
    }
    toPj=()=>{
        Toast.fail('评价功能暂不可用')
    }
    toReply=()=>{
        const { history, match } = this.props;
       
        history.push({
            pathname: match.path + '/reply',
            state: {}
        })
    }
    btnUpload=(e)=> {
        var files = e.target.files;
        var file = files[0];
        var read = new FileReader();
        read.readAsDataURL(file);
        //提交上传到服务器
        this.submitUpload(file)
        //清空上传图片
        var  input = document.getElementById('uploadIMG');
        input.value ="";
    }
    
     submitUpload=(result)=> {
        var formData = new FormData();
        formData.append("file", result);
        let that = this;
        request({
            url: api.fileUpload, data: formData,
            config: {
                baseURL: fileaddress
            }
        }).then(res => { 
            that.mshSend(res,1)
         }).catch(err => { })
    }
    render() {
        let {addfile,isYY,serverUser,isOver} =this.state;
        return (
        <div className={styles.container} >
      
                <div className={styles.content}>
                <div className="textFontSize greyColor tc">{serverUser.nick?serverUser.nick+'为您服务':''}</div>
                {this.getMsg(this.state.msgArr)}
                </div>
                {isOver?<div>
                    <div className="textFontSize greyColor tc">本次服务结束</div>
                    <div className="tc">感谢您的咨询，请给本次服务做个评价吧,<span className="blueColor" onClic={this.toPj}>立即评价</span></div>
                    </div>
                    :null}
                <div className={styles.footer+' textFontSize'}>
                   
                        <div className={styles.leftIcon} onClick={this.changeLeft}>
                            {this.leftIcon()}
                        </div>
                        {isYY?<Button className={styles.input}>按住说话</Button>:
                        <TextareaItem className={styles.input}
                                focus={'true'}
                                disabled={isOver}
                                onFocus={()=>{
                                    this.setState({ 
                                        addfile:false,
                                    })
                                }}
                                onChange={(e)=>{
                                    let value = e.trim();
                                    this.setState({
                                        content:value
                                    })
                                }}
                                value={this.state.content}
                               
                                placeholder="在这里输入想说的话..."/>
                            }
                       {this.state.content?<Button onClick={this.mshSend} className={styles.greenBtn} size="small">发送</Button>: 
                       <div className={styles.rightIcon} onClick={this.changeRight}>
                            {this.rightIcon()}
                        </div>
                        }
                </div>
                <div style={{overflow:'hidden',padding:'8px 16px',display:addfile?null:'none'}}>
                            {this.dataList.map((item,index)=>{
                                return <div key={item.title+index}  className="fl tc pl-16 ml-8">
                                            <div className={styles.fileInputbox} >{item.icon}<input onChange={this.btnUpload} className={styles.fileInput} accept="image/*" type="file" id="uploadIMG" title=" "/></div>
                                            <div className="textFontSize">{item.title}</div>
                                        </div>
                            })}
                        </div>
            
            </div>
        );
    }
})