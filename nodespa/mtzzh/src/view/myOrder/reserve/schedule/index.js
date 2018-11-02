import React, { Component } from 'react';
import {Steps,WhiteSpace} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import Tel from '../../../../component/tel'
import NoResult from '../../../../component/noResult';
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        steps : [],
        current:1
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取进度
        let api = '/storejps/Orders/getOrderProgress';
        let data = {orderId:996273286}
        request({ url: api, data }).then(res => {
            let steps =[];
            let{nodeList} = res;
            let current = 0;
            nodeList.forEach(item => {
                current +=Number(item.status);
                let obj = {};
                obj.title = item.nodeName;
                obj.description = <div className={styles.desc}>
                                    { item.items.map(item=>{
                                        return  <div key={item.key}>
                                        {item.key} : <span className={item.phone?styles.people:''}>{`${item.value||''} ${item.phone||""}`}<span style={{display:item.phone?null:'none'}}><Tel tel={item.phone}/></span> </span>
                                        <WhiteSpace size="xs"/>
                                        </div>
                                    })}
                                    </div>
                steps.push(obj)
            });
            
            this.setState({
                steps:steps,
                current
            })
        }).catch(err => { console.log(err) })
      
    }
    getSteps=()=>{
        return this.state.steps.map((s, i) => <Step key={i} title={s.title} description={s.description} />);
       }
    render() {
        let {current} = this.state;
        return (
            <div className={styles.schedule}>  
                <Steps current={current} direction="vertical" >
                     {this.getSteps()}
                </Steps>
            </div>
        );
    }
}