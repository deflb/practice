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
        //获取售后列表
        request({ url: api.getStoreList, data: { pageNo: 1, pageSize: 10 } }).then(res => {
            const { list } = res;
            this.setState({ orderList: list||[] })
        }).catch(err => { console.log(err) })
      
    }
    toPj =(e)=>{
        e.stopPropagation();
        const { history, match } = this.props;
        history.push({
            pathname: '/myOrder/detail/serve/pingjia',
            state:{}
        })
    }
    render() {
        let {height} = this.state;
        return (
            <div className={styles.serveDetail} style={{height}}>
                {/* <Design/> */}
                {/* <Gauge/> */}
                {/* <Putsample/> */}
                {/* <SecondGauge/> */}
                {/* <SendGoods/> */}
                <TakeGoods/>
                <div className ={styles.detailFooter} onClick={this.toPj}>评价</div>
             </div>
        );
    }
}