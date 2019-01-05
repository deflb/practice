import React, { Component } from 'react';
import {Steps,WhiteSpace,List,Icon,Button,Toast} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import Tel from '../../../../component/tel'
import { formatDate } from '../../../../utlis';
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        steps : [],
        current:0,
        isLoading:true
    }
    componentDidMount(){
        
        this.init()
    }
    init=()=>{
        let {location={}} = this.props,{state={}}=location;
        let {orderId,orderNo} = state;
        if(orderId)
        request({ url: api.getOrderserve, data: { pageNo: 1, pageSize: 1000,orderId} }).then(res => {
          let {list}  = res;
          
            let steps = [];
            let current = 0;
            list.forEach((item,index)=>{
                current +=item.status;
                let child = {
                    status:item.status,
                    title: <div className={styles.title}>
                            <span className={styles.text+' normalFontSizeC'}>{item.servicePrj}</span>
                            <div className={styles.btnBox}>
                                <Button style={{display:item.status?null:'none'}} className={`${styles.btn} ${styles.yelBtn} mr-8 `} size="small" onClick={this.toServeDetail.bind(this,item)}><span className="textFontSizeC">查看详情</span></Button>
                                <Button style={{display:item.fstate?null:'none'}} className={`${styles.btn} `} size="small" onClick={this.toPingjia.bind(this,item.fid)}><span className="textFontSizeC">查看评价</span></Button>
                            </div>
                   
                     </div>,
                    description: <div className={styles.desc}>
                                   <WhiteSpace/>
                                    <div><span className="mr-8">{item.execRoleName} : </span>
                                    <span className={styles.people}>
                                    <span className="mr-8">{`${item.execUserName||""}`}</span>
                                    <span className="mr-8">{` ${item.mobilePhone||""}`}</span>
                                    <span className="ml-8">{item.mobilePhone?<Tel tel={item.mobilePhone}/>:null}</span></span></div>
                                    <WhiteSpace />
                                    <div>
                                    <span className="mr-8">{item.status>0?"完成时间":(current===index?"预约时间":"计划时间")} :</span>
                                     {item.status>0?this.getDate(item.finishDate):(current===index?
                                        this.getDate(item.appointDate):this.getDate(item.planDate))}</div>
                                    <WhiteSpace/>
                                </div>,
                  };
                  steps.push(child)
            })
            
            this.setState({
                steps:steps,isLoading:false,
                orderNo,
                current
            })
        }).catch(err => { console.log(err) 
            this.setState({
                isLoading:false
            })
        })
    }
    getDate=(date)=>{
        if(!date){
            return ""
        }
        if(date<150000000){
            return date
        }
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
    getIcon=(s)=>{
        return s.status?(<i className='iconfont icon-check-circle greenColor' />):<i className='iconfont icon-time uncheckedIcon ' style={{width:'20px',height:'20px'}}/>
     }
    
    getSteps=()=>{
      
        return this.state.steps.map((s, i) => <Step key={i} status={"wait"} title={s.title} description={s.description}  icon={this.getIcon(s)} />);
       }
    backIndex=()=>{
        const { history,match} = this.props;
       
        history.push({
            pathname:match.path.slice(0,-13),
            state: {}
        }) 
    }
    toPingjia=(fid)=>{
        const { history, match } = this.props;
       
        history.push({
            pathname: match.path + '/pingjiaResult',
            state: {fid:fid}
        }) 
    }
    toServeDetail = (item)=>{
        const { history, match } = this.props;
       let{orderNo} = this.state;
       let param = Object.assign({},item);
            param.orderNo = orderNo;
            param.fservicePrjId = String(param.fservicePrjId)
            param.taskNo = Number(param.taskNo)
        if(!param.taskNo){
            Toast.fail("暂无信息", 0.7);
            return
        }    
        history.push({
            pathname: match.path + '/serveDetail',
            state: param
        }) 
    }
    
    render() {
        let {Handle,orderNo,steps} = this.state;
        return (
            <div className={styles.scheduleServe}>
                <div className={styles.header}>
                     <List.Item className={styles.historyTop}> <div className="normalFontSizeC"><span className={styles.Handle}>{Handle}</span>
                     当前订单 : {orderNo} <Icon   onClick={this.backIndex}  className={"fr "+styles.icon} size="lg" type="down" theme="outlined" /></div></List.Item>
                </div>
                <div style={{display:steps.length===0?null:"none"}} className ={styles.nothing}>暂无订单服务</div>
                <div className={styles.body} >
                    <Steps direction="vertical" >
                        {this.getSteps()}
                    </Steps>
                </div>  
            </div>
        );
    }
}