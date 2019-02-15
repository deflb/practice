import React, {Component} from 'react';
import {List,WhiteSpace,Card,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less'
import whichImgLink from '../../../../../utlis/whichImgLink';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class SendGoods extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
           loading:true
        }
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    componentDidMount(){
        let {title} =this.props.state;
        document.title = title;
        this.init()
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'delivery'}}).then(res => {
            this.setState({
                deliveryInfo:res.deliveryInfo||{},
                loading:false
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
        let {deliveryInfo={},loading} = this.state,
        {state,title}=this.props;
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

                <Card full className ={styles.mt_8}>
                <Card.Header
                    title="送货状况照片"
                    thumb=""
                    extra={''}//立即分享
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                {deliveryInfo.deliveryPictures&&deliveryInfo.deliveryPictures.length>0&&!loading?
                     <Grid data={this.getPhoto(deliveryInfo.deliveryPictures)}  
                     columnNum={3}
                     itemStyle={{margin:'8px 0 0 8px ',}}
                     renderItem={(el,index)=>{
                         return <img width="100%" alt="" className={styles.iconImg} key={index+'iconImg3'}
                                onClick={()=>{
                                    preview([{url:el.icon}])
                                }}
                                onError={()=>{
                                    el.icon = ""
                                }}
                                src={el.icon}/>
                     }} 
                     hasLine={false}
                     />:
                     <div className="tc greyColor textFontSize">暂无数据</div>
                    }
                </div>
                   

                </Card.Body>
                </Card>

                <Card full className ={styles.mt_8}>
                <Card.Header
                    title="签收照片"
                    thumb=""
                    extra={''}//立即分享
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                {deliveryInfo.receiptPictures&&deliveryInfo.receiptPictures.length>0?
                     <Grid data={this.getPhoto(deliveryInfo.receiptPictures)}  
                     columnNum={3}
                     itemStyle={{margin:'8px 0 0 8px ',}}
                     renderItem={(el,index)=>{
                         return <img width="100%"  alt="" className={styles.iconImg} key={index+'iconImg3'}
                         onClick={()=>{
                            preview([{url:el.icon}])
                        }}
                        onError={()=>{
                            el.icon = ""
                        }}
                         src={el.icon}/>
                     }} 
                     hasLine={false}/>:
                     <div className="tc greyColor textFontSize">暂无数据</div>
                    }
                </div>
                   

                </Card.Body>
                </Card>

              
            </div>
    )
    }
}
