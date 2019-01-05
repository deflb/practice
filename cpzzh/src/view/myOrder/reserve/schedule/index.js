import React, { Component } from 'react';
import {Steps,WhiteSpace} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../../request';
import Tel from '../../../../component/tel'
import api from '../../../../request/api';
import { formatDate } from '../../../../utlis';
// import NoResult from '../../../../component/noResult';
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        steps : [],
        current:1
    }
    componentDidMount(){
        this.init();
    }
    getDate=(date)=>{
        if(!date){
            return ""
        }
        if(typeof date==="string"){
            return date
        }
        if(Number(date)<15000000){
            return date
        } 
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
    init(){
        //获取进度
        let {location={}} = this.props,{state={}}=location;
        console.log(this.props)
        let data = {orderId:state.id}
        request({ url: api.getOrderProgress, data }).then(res => {
            let steps =[];
            let{nodeList} = res;
            let current = 0;
            nodeList.forEach(item => {
                current +=Number(item.status);
                let obj = {};
                obj.title = <span className="normalFontSizeC">{item.nodeName}</span>;
                obj.status = item.status;
                obj.description = <div className={styles.desc}>
                                    { item.items.map(item=>{
                                        return  <div key={item.key}>
                                        {item.key} : <span className={item.phone?styles.people:''}>{`${this.getDate(item.value)} ${item.phone||""}`}<span style={{display:item.phone?null:'none'}}><Tel tel={item.phone}/></span> </span>
                                        <WhiteSpace size="xs"/>
                                        
                                        </div>
                                    })}
                                    </div>;
               
                    steps.push(obj)
                         
               
            });
            
         
            this.setState({
                steps:steps,
                current
            })
        }).catch(err => { console.log(err) })
      
    }
    getIcon=(s)=>{
        return s.status?(<i className='iconfont icon-check-circle greenColor' />):<i className='iconfont icon-time uncheckedIcon ' />
     }
    
    getSteps=()=>{
      
        return this.state.steps.map((s, i) => <Step key={i} status={"wait"} title={s.title} description={s.description}  icon={this.getIcon(s)} />);
       }
     
    render() {
     
        return (
            <div className={styles.schedule} >  
                <Steps >
                     {this.getSteps()}
                </Steps>
            </div>
        );
    }
}