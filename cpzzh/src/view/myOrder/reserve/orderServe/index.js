import React, { Component } from 'react';
import {Steps,WhiteSpace,List,Icon,Button,Toast} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import Tel from '../../../../component/tel'
import { formatDate } from '../../../../utlis';
import { connect } from 'react-redux';
const Step = Steps.Step;
export default connect(state => ({
    userInfo: state.userInfo
}))(class reserveStep extends Component {
    state = {
        steps : [],
        current:0,
        isLoading:true,
        isOnly:false
    }
    componentDidMount(){
        let {location={}} = this.props,{state={}}=location;
        let {orderId,orderNo} = state;
       
        
        if(orderId){
            this.init(orderId,orderNo)
        }else{
            const {userInfo } =this.props;
            if(userInfo.customerId){
            request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 100,fcstid:userInfo.customerId } }).then(res => {
                const { list } = res;
                if(list.length>0){
                    let {orderId,orderNo} = list[0]
                    if(orderId)
                    this.init(orderId,orderNo)

                    if(list.length===1){
                        this.setState({isOnly:true})
                    }
                }else{
                    this.setState({
                        isLoading:false,
                        isNothing:true
                    })
                }
            }).catch(err => { console.log(err) })
        }else{
            this.setState({isLoading:false})
        }
           
        }
      
    }
    init=(orderId,orderNo)=>{
       
        request({ url: api.getOrderserve, data: { pageNo: 1, pageSize: 100,orderId} }).then(res => {
          let {list}  = res;
          
            let steps = [];
            let current = 0;
            list.forEach((item,index)=>{
                current +=item.status;
                let child = {
                    status:item.status,
                    taskType:item.taskType,
                    title: <div className={item.status===0?(styles.title+' greyColor'):styles.title}>
                            <span className={styles.text+' normalFontSizeC'}>{item.servicePrj}</span>
                            <div className={styles.btnBox+" fr"}>
                                <Button style={{display:item.status?null:'none'}} 
                                className={`${styles.btn} ${styles.yelBtn} mr-8 `} 
                                size="small" onClick={this.toServeDetail.bind(this,item)}>
                                <span className="textFontSize">查看详情</span></Button>
                                <Button style={{display:item.fstate?null:'none'}}
                                 className={`${styles.btn} `} size="small" 
                                 onClick={this.toPingjia.bind(this,item.fid)}>
                                 <span className="textFontSize">查看评价</span></Button>
                                 <Button style={{display:!item.fstate&&item.status?null:'none'}}
                                 className={`${styles.pjbtn} ${styles.btn}`} size="small" 
                                 onClick={this.topj.bind(this,item)}>
                                 <span className="textFontSize">评价</span></Button>
                            </div>
                   
                     </div>,
                    description: <div className={styles.desc}>
                                   <WhiteSpace/>
                                    <div className={styles.flex}>
                                    <span className="mr-8">{item.execRoleName} : </span>
                                    <span className={styles.people}>
                                    <span className="mr-8">{`${item.execUserName||""}`}</span>
                                    <span >{` ${item.mobilePhone||""}`}</span>
                                    <span >{item.mobilePhone?<Tel tel={item.mobilePhone}/>:null}</span></span></div>
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
                steps:steps,
                isLoading:false,
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
        let icon =s.status===2?(<i className='iconfont icon-check-circle greenColor' />):<i className='iconfont icon-time uncheckedIcon ' style={{width:'20px',height:'20px'}}/>
        if(s.status===0){
            icon = <i className='iconfont  ungoing ' style={{width:'20px',height:'20px'}}/>
        }
        return icon
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
    topj =(item)=>{
        const { history ,match} = this.props;
        let url = '/pingjia';
        let param = Object.assign({},item);
            param.fid = item.fid;
            param.taskType = this.getSbType(item.taskType) ;
        history.push({
            pathname:match.path  + url,
            state:param
        })
    } 
    getSbType(num){
        let taskType;
        switch(num){
            case 1:
            taskType=0;
            break;
            case 2:
            taskType=3;
            break;
            case 3:
            taskType=1;
            break;
            case 4:
            taskType=2;
            break;
            case 5:
            taskType=6;
            break;
           
            case 6:
            taskType=7;
            break;
            case 7:
            default:
            taskType=4
        }
        return taskType;
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
        let {Handle,orderNo,steps,isLoading,isOnly,isNothing} = this.state;
        return (
            <div className={styles.scheduleServe}>
            
                <div className={styles.header} style={{display:steps.length===0&&!isLoading?'none':null}}>
                     <List.Item className={styles.historyTop}> <div className="normalFontSizeC"><span className={styles.Handle}>{Handle}</span>
                     当前订单 : {orderNo} <Icon style={{display:isOnly?'none':null}}  onClick={this.backIndex}  className={"fr "+styles.icon} size="lg" type="down" theme="outlined" /></div></List.Item>
                </div>
                <div style={{display:isNothing&&!isLoading?null:"none"}} className ={styles.nothing}>暂无订单服务</div>
                <div className={styles.body} >
                    <Steps direction="vertical" >
                        {this.getSteps()}
                    </Steps>
                </div>  
            </div>
        );
    }
})