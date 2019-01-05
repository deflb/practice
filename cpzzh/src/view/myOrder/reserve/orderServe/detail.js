import React, { Component } from 'react';
import {} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import Design from './design'//设计
import Gauge from './gauge'//测量
import SecondGauge from './SecondGauge'//测量
import Putsample from './putSample'//安装
import SendGoods from './sendGoods'
import TakeGoods from './takeGoods'
import Other from './others'
import { formatDate } from '../../../../utlis';

export default class serveDetail extends Component {
    state = {
        fstate:0
    }
    componentDidMount(){
      
            let {location={}} = this.props,{state={}}=location;
            this.setState({
                              fstate:state.fstate,
                              fid:state.fid
                          })
           if(!this.state.fstate)
            request({ url: api.getOrderserve, data: { pageNo: 1, pageSize: 10,orderId:state.orderId} }).then(res => {
              let {list}  = res;
              list.forEach(item=>{
                  if(item.taskNo===state.taskNo){
                      this.setState({
                          fstate:item.fstate,
                          fid:item.fid
                      })
                  }
              })
            })
    }
 
    toPj =(e)=>{
        e.stopPropagation();
        const { history,location ,match} = this.props,{state}=location;
        let url;
        if(!this.state.fstate){
            url = '/pingjia'
        }else{
            url = '/pingjiaResult'
        }
        let param = Object.assign({},state);
            param.fid = this.state.fid;
            param.taskType = this.getSbType(state.taskType) ;
        history.push({
            pathname:match.path.slice(0,-12) + url,
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
    getDate=(date)=>{
        if(!date||date<150000000){
            return date
        }
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
  
    renderDetail=()=>{
        let {location} =this.props,{state}=location;
        switch(String(state.taskType)){
            case '1':
            return <Gauge {...this.props} state={state} getDate={this.getDate} />
            case '3': 
            return <SecondGauge {...this.props}  state={state} getDate={this.getDate}/>
             case '4':
            return <Putsample {...this.props}  state={state} getDate={this.getDate}/>
            case '2':
            return <Design {...this.props}  state={state} getDate={this.getDate}/>
            case '5':
           return <SendGoods {...this.props}  state={state} getDate={this.getDate}/>
            case '6':
           return <TakeGoods {...this.props} state={state} getDate={this.getDate}/>
           case '7':
           default:
           return <Other {...this.props}  state={state} getDate={this.getDate}/>
        }
    }
    render() {
        let {location={}} = this.props,{state={}}=location;
        return (
            <div className={styles.serveDetail}>
                <div className={styles.serveDetailBody}  >
               {
                  this.renderDetail(state.taskType,state.taskNo)
               }
               </div>
                <div  className ={styles.detailFooter} onClick={this.toPj}>{this.state.fstate?'查看评价':"评价"}</div>
             </div>
        );
    }
}