import React, { Component } from 'react';
import {Icon ,List} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
import nothingImg from '../../../../assets/icon/no_data@3x.png'
import addIcon from '../../../../assets/icon/add@3x.png'
export default class myAfterSale extends Component {
    state = {
        historyList:[],
        orderId:'',
        orderNo:''
    }
    componentWillMount(){
        this.init();
    }
    init=()=>{
        //获取售后列表 
        this.setState({
            isLoading:true
        })
        request({ url: api.getStoreList, data: { pageNo: 1, pageSize: 1000000 } }).then(res => {
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
            this.toDetail({orderId,orderNo})
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
    toDetail=({orderId,orderNo})=>{
        const { history, match } = this.props;
        if(!orderId){
            return
        }
        history.push({
            pathname: match.path + '/detail',
            state: {orderId,orderNo}
        })
    }
   
    render() {
        let {historyList} =this.state;
        return (<div className={styles.myAfterSale}>  
                {historyList.length===0?
               
                    <div className ={styles.nothing}>
                    <img src={nothingImg} alt="" width="150"/></div>
             
               :
                 <div className={styles.historyList} >
                    <List.Item className={styles.mb_8+' '+styles.historyTop}>
                    全部售后单 
                      <Icon className={styles.fr +" "+styles.icon} type="up" theme="outlined" size ="lg" onClick={this.toDetail} />
                    </List.Item>
                    <div className={styles.body} >
                    {this.state.historyList.map((item,index)=>{
                        return <div className={styles.hisItem} key ={item.fclaimno+'idx' +index}
                         onClick={(e)=>{
                            e.stopPropagation();
                             this.choose(item)}}>售后单 :{item.fclaimno} <div className={styles.fr +" "+styles.checkIcon}>{item.checked?<Icon type="check-circle" size="md" />:''}</div></div>
                    })}
                    </div>  
                </div>
                } 

                <div onClick={this.toAdd} className={styles.plusBtn+' highFontSizeC'}><img src={addIcon} width="100%" alt=""/></div>
            </div>
        );
    }
}