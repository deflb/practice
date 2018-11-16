import React, { Component } from 'react';
import {Steps,WhiteSpace,List,Icon,Button,ActivityIndicator} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import Tel from '../../../../component/tel'
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        steps : [],
        current:1,
        isLoading:true
    }
    componentDidMount(){
        
        this.init()
    }
    init=()=>{
        let {location={}} = this.props,{state={}}=location;
        let {orderId,orderNo} = state;
        request({ url: api.getOrderserve, data: { pageNo: 1, pageSize: 10,orderId} }).then(res => {
          let {list}  = res;
          
            let steps = [];
            let current = 0;
            list.forEach((item,index)=>{
                current +=item.status;
                let child = {
                    title: <div className={styles.title}>{item.servicePrj}
                     <Button className={`${styles.btn} mr-8`} size="small" onClick={this.toPingjia.bind(this,item.fid)}>查看评价</Button>
                     <Button className={`${styles.btn} ${styles.yelBtn}`} size="small" onClick={this.toServeDetail.bind(this,item)}>{item.servicePrj.slice(-2)}信息</Button>
                     </div>,
                    description: <div className={styles.desc}>
                                   <WhiteSpace/>
                                    <div><span className="mr-8">{item.execRoleName} : </span>
                                    <span className={styles.people}>
                                    <span className="mr-8">{`${item.execUserName}`}</span>
                                    <span className="mr-8">{` ${item.mobilePhone}`}</span>
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
                orderNo
            })
        }).catch(err => { console.log(err) 
            this.setState({
                isLoading:false
            })
        })
    }
    getDate=(date)=>{
        if(!date||date<150000000){
            return date
        }
        return new Date(date).toLocaleString().replace(/\//g,'-').slice(0,-10)
    }
    getSteps=()=>{
        return this.state.steps.map((s, i) => <Step key={i} title={s.title}  description={s.description} />);
       }
    backIndex=()=>{
        const { history} = this.props;
       
        history.push({
            pathname: '/myOrder',
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
        history.push({
            pathname: match.path + '/serveDetail',
            state: param
        }) 
    }
    render() {
        let {Handle,orderNo,current,isLoading} = this.state;
        return (
            <div className={styles.scheduleServe}>
                <div className={styles.header}>
                     <List.Item className={styles.historyTop}> <div ><span className={styles.Handle}>{Handle}</span>
                     当前订单 : {orderNo} <Icon   onClick={this.backIndex}  className={"fr "+styles.icon} size="lg" type="down" theme="outlined" /></div></List.Item>
                </div>
                <div className={styles.body}>
                    <Steps current={current} direction="vertical" >
                        {this.getSteps()}
                    </Steps>
                </div>  
                <ActivityIndicator animating={isLoading} size="large" toast/>
            </div>
        );
    }
}