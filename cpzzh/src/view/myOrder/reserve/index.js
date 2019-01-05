import React, { Component } from 'react';
import {Icon ,List } from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
import { connect } from 'react-redux';
export default connect(state => ({
    userInfo: state.userInfo
}))(class reserve extends Component {
    state = {
        orderList:[], 
        id:''
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取订单列表
       const {userInfo } =this.props;
        if(!userInfo.customerId){
            request({ url: api.userInfo }).then(res => {
                request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 1000000,fcstid:res.customerId } }).then(res => {
                    const { list } = res;
                    this.setState({ orderList: list||[] ,isLoading:false})
                }).catch(err => { console.log(err) })
            })
        }else{
            request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 1000000,fcstid:userInfo.customerId } }).then(res => {
                        const { list } = res;
                        this.setState({ orderList: list||[] ,isLoading:false})
                    }).catch(err => { console.log(err) })
                    this.setState({
                        isLoading:false
                    })
        }
    }
    choose=(current)=>{
        let {orderList,id,orderId} = this.state;
        let arr =[];
        let offical = true;
            orderList.forEach(item=>{
                item.checked = false;
                
                if(item.orderId === current.orderId){
                    item.checked = true;
                    id = item.orderNo;
                    orderId = item.orderId
                    if(item.fordtype==="3"){
                        offical = false;
                    }
                }
               
                arr.push(item)
            })
            this.setState({
                orderList:arr,
                id:id,
                orderId,
                offical
            })
            this.toDetail({id,orderId,offical})
    }
    toAdd=()=>{
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/apply',
            state: {}
        })
    }
    toDetail=({id,orderId,offical})=>{
        const { history, match } = this.props;
        if(!id){
            return
        }
        history.push({
            pathname: match.path + '/detail',
            state: {id,orderId,offical}
        })
    }
  
    render() {
        return (
            <div className={styles.myorder}>  
                {this.state.orderList.length===0?
                <div className ={styles.nothing}>暂无订单</div>
               :
                 <div className={styles.orderList}> 
                    <List.Item className={styles.mb_8+' '+styles.historyTop}>
                    全部订单 <Icon className={"fr  "+styles.icon} type="up" size ="lg" theme="outlined" onClick={this.toDetail} /></List.Item>
                    <div className={styles.body} >
                    {this.state.orderList.map((item,index)=>{
                        return <div className={styles.hisItem} key ={item.orderNo +index}
                                        onClick={(e)=>{
                                        e.stopPropagation();
                                        this.choose(item)}}>
                                        {item.fordtype==="3"?"预订单":'销货单'} : <span className="shallowGreyColor">{item.orderNo}</span>
                                          <div className={"fr "+styles.checkIcon}>{item.checked?
                                          <Icon type="check-circle" size="md" />:null}</div>
                             
                                </div>
                    })}
                    </div>
                </div>
                } 
            </div>
        );
    }
})