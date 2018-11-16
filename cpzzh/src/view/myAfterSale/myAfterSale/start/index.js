import React, { Component } from 'react';
import {Icon ,List,ActivityIndicator} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
export default class myAfterSale extends Component {
    state = {
        historyList:[],
        orderId:'',
        orderNo:''
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取售后列表 
        this.setState({
            isLoading:true
        })
        request({ url: api.getStoreList, data: { pageNo: 1, pageSize: 10 } }).then(res => {
            const { list } = res;
            this.setState({ historyList: list||[],isLoading:false })
        }).catch(err => { console.log(err)
            this.setState({
                isLoading:false
            })
        })
      
    }
    choose=(current)=>{
        let {historyList,orderNo,orderId} = this.state;
        let arr =[]
            historyList.forEach(item=>{
                item.checked = false;
                if(item.fclaimid === current.fclaimid){
                    item.checked = true;
                    orderNo = item.fclaimno;
                    orderId = item.fclaimid;
                }
                arr.push(item)
            })
            this.setState({
                historyList:arr,
                orderNo,
                orderId
            })
    }
    toAdd=()=>{
        const { history, match } = this.props;
        let {orderId,orderNo} = this.state;
        history.push({
            pathname: match.path + '/apply',
            state: {orderId,
                    orderNo
            }
        })
    }
    toDetail=()=>{
        const { history, match } = this.props;
        let {orderId,orderNo} = this.state;
        if(!orderId){
            return
        }
        history.push({
            pathname: match.path + '/detail',
            state: {orderId,orderNo}
        })
    }
    render() {
        let {isLoading=true,historyList} =this.state;
        return (
            <div className={styles.myAfterSale}>  
                {historyList.length===0&&!isLoading?
               
                    <div className ={styles.nothing}>暂无售后记录</div>
             
               :
                 <div className={styles.historyList}>
                    <List.Item className={styles.mb_8+' '+styles.historyTop}>
                    全部售后单 
                      <Icon className={styles.fr +" "+styles.icon} type="up" theme="outlined" size ="lg" onClick={this.toDetail} />
                    </List.Item>
                    {this.state.historyList.map((item,index)=>{
                        return <div className={styles.hisItem} key ={item.fclaimno +index}
                         onClick={(e)=>{
                            e.stopPropagation();
                             this.choose(item)}}>售后单 :{item.fclaimno} <div className={styles.fr +" "+styles.checkIcon}>{item.checked?<Icon type="check-circle" size="md" />:''}</div></div>
                    })}
                </div>
                } 
                <ActivityIndicator animating={isLoading} size="large" toast/>

                <div className={styles.plusBtn}><Icon type="plus" onClick={this.toAdd}/></div>
            </div>
        );
    }
}