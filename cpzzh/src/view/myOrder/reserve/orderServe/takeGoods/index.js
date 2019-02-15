import React, {Component} from 'react';
import {List,WhiteSpace,Card,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import whichImgLink from '../../../../../utlis/whichImgLink';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class SendGoods extends Component {
    constructor(props) {
        super(props)
        this.state={
        }
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    componentDidMount(){
        let {title } = this.props;
        document.title = title;
        this.init()
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'install'}}).then(res => {
            this.setState({
                installInfo:res.installInfo||{}
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val),
          }));  
    }
    render(){
        let {installInfo={}} = this.state,
        {state,title} =this.props;
        return(
            <div className={styles.serveDetails} >
              <List>
                <List.Item className={styles.historyTop}>
                    {title}
                </List.Item>

              </List>
           
              <div className={styles.body}>
                    <div className={styles.desc}>
                        <div><span className="mr-8">{state.execRoleName} :</span> 
                        <span className={styles.people}>
                        <span className="mr-8">{state.execUserName}</span>
                        <span className="mr-8">{state.mobilePhone}</span>
                        <span className="mr-8" style={{display:state.mobilePhone?null:'none'}}><Tel tel={state.mobilePhone}/></span>
                        </span>
                    </div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.props.getDate(state.appointDate)}</div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.props.getDate(state.finishDate)}</div>
                    </div>
                </div>

                <Card full className ={"mt-8"}>
                <Card.Header
                    title="安装前拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 0 0 8px ',}}
                          renderItem={(el,index)=>{
                              return <img  alt="" width="100%" className={styles.iconImg}  key={index+'iconImg3'}
                              onClick={()=>{
                                preview([{url:el.icon}])
                            }}
                              src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.uninstallPhotos)}/>
                </div>
                   

                </Card.Body>
                </Card>

              <Card full className ={styles.mt_2}>
                <Card.Header
                    title="安装中拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 0 0 8px  ',}}
                          renderItem={(el,index)=>{
                              return <img  alt="" width="100%" className={styles.iconImg} key={index+'iconImg3'}
                              onClick={()=>{
                                preview([{url:el.icon}])
                            }}
                              src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.installingPhotos)} />
                </div>
                   

                </Card.Body>
                </Card>
                <Card full className ={styles.mt_2}>
                <Card.Header
                    title="安装后拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 0 0 8px ',}}
                          renderItem={(el,index)=>{
                              return <img  alt="" width="100%" className={styles.iconImg} key={index+'iconImg3'} 
                              onClick={()=>{
                                preview([{url:el.icon}])
                            }}
                              src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.installedPhotos)}/>
                </div>
                   

                </Card.Body>
                </Card>
                <Card full className ={styles.mt_2}>
                <Card.Header
                    title="现场及异常状况"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px',paddingLeft:'16px',color:'#999'}}>
                     现场安装一切正常,数据精确,没有异常
                </div>
                   

                </Card.Body>
                </Card>
            </div>
    )
    }
}
