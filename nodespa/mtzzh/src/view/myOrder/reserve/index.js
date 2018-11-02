import React, { Component } from 'react';
import {Icon ,List} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
export default class reserve extends Component {
    state = {
        orderList:[],
        id:''
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取订单列表
        request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 10 } }).then(res => {
            const { list } = res;
            
            this.setState({ orderList: list||[] })
        }).catch(err => { console.log(err) })
      
    }
    choose=(current)=>{
        let {orderList,id} = this.state;
        let arr =[];
        
            orderList.forEach(item=>{
                item.checked = false;
                
                if(item.orderId === current.orderId){
                    item.checked = true;
                    id = item.orderId
                }
               
                arr.push(item)
            })
            this.setState({
                orderList:arr,
                id:id
            })
    }
    toAdd=()=>{
        const { history, match } = this.props;
        history.push({
            pathname: match.path + '/apply',
            state: {}
        })
    }
    toDetail=()=>{
        const { history, match } = this.props;
        let {id} = this.state;
        if(!id){
            return
        }
        history.push({
            pathname: match.path + '/detail',
            state: {id:id}
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
                    全部订单 <Icon className={styles.fr +" "+styles.icon} type="up" size ="lg" theme="outlined" onClick={this.toDetail} /></List.Item>
                    {this.state.orderList.map((item,index)=>{
                        return <List.Item className={styles.hisItem} key ={item.orderNo +index}
                                        onClick={(e)=>{
                                       e.stopPropagation();
                                        this.choose(item)}}>
                                        销货单 :{item.orderNo}
                                          <div className={styles.fr +" "+styles.checkIcon}>{item.checked?
                                          <Icon type="check-circle" size="md" />:''}</div>
                             
                                </List.Item>
                    })}
                </div>
                } 
            </div>
        );
    }
}