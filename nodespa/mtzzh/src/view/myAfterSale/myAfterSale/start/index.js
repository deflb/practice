import React, { Component } from 'react';
import {Icon ,List} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import api from '../../../../request/api';
export default class myAfterSale extends Component {
    state = {
        historyList:[],
    id:''
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取售后列表 
        request({ url: api.getStoreList, data: { pageNo: 1, pageSize: 10 } }).then(res => {
            const { list } = res;
            this.setState({ historyList: list||[] })
        }).catch(err => { console.log(err) })
      
    }
    choose=(current)=>{
        let {historyList,id} = this.state;
        let arr =[]
            historyList.forEach(item=>{
                item.checked = false;
                if(item.fclaimid === current.fclaimid){
                    item.checked = true;
                    id = item.fclaimid;
                }
                arr.push(item)
            })
            this.setState({
                historyList:arr,
                id
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
            <div className={styles.myAfterSale}>  
                {this.state.historyList.length===0?
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
                <div className={styles.plusBtn}><Icon type="plus" onClick={this.toAdd}/></div>
            </div>
        );
    }
}