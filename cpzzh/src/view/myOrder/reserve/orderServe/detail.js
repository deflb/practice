import React, { Component } from 'react';
import {} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
// import { imgAddress } from '../../../../request/baseURL';
import Design from './design'//设计
import Gauge from './gauge'//测量
import SecondGauge from './SecondGauge'//测量
import Putsample from './putSample'//安装
import SendGoods from './sendGoods'
import TakeGoods from './takeGoods'

export default class serveDetail extends Component {
    state = {
       height:1000
    }
    componentDidMount(){
        const hei = document.documentElement.clientHeight
        this.setState({ height: hei })
        this.init();
    }
    init(){
      
        request({ url: api.getStoreList, data: { pageNo: 1, pageSize: 10 } }).then(res => {
            const { list } = res;
            this.setState({ orderList: list||[] })
        }).catch(err => { console.log(err) })
      
    }
    toPj =(e)=>{
        e.stopPropagation();
        const { history,location } = this.props,{state}=location;
        history.push({
            pathname: '/myOrder/detail/serve/pingjia',
            state:{fservicePrjId:state.fservicePrjId}
        })
    } 
    getDate=(date)=>{
        if(!date||date<150000000){
            return date
        }
        return new Date(date).toLocaleString().replace(/\//g,'-').slice(0,-10)
    }
    renderDetail=()=>{
        let {location} =this.props,{state}=location;
        switch(state.taskType){
            case 1:
            return <Gauge {...this.props} state={state} getDate={this.getDate} />
            case 2:
           return <Design {...this.props}  state={state} getDate={this.getDate}/>
            case 3: 
           return <SecondGauge {...this.props}  state={state} getDate={this.getDate}/>
          
            case 4:
           return <Putsample {...this.props}  state={state} getDate={this.getDate}/>
            case 5:
           return <SendGoods {...this.props}  state={state} getDate={this.getDate}/>
            case 6:
           return <TakeGoods {...this.props} state={state} getDate={this.getDate}/>
           default:
           return <Gauge {...this.props} state={state} getDate={this.getDate} />
        //    <div className="tc greyColor mt-8">错误的任务类型...</div>
        }
    }
    render() {
        let {height} = this.state;
        let {location={}} = this.props,{state={}}=location;
        return (
            <div className={styles.serveDetail} style={{height}}>
               {
                  this.renderDetail(state.taskType,state.taskNo)
               }
                <div className ={styles.detailFooter} onClick={this.toPj}>评价</div>
             </div>
        );
    }
}