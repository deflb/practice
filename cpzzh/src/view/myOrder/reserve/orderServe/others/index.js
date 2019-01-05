import React, {Component} from 'react';
import {List,WhiteSpace} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less'
import whichImgLink from '../../../../../utlis/whichImgLink'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
export default class Others extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{}
        }
    }
    componentDidMount(){
       
        // this.init()
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'other'}}).then(res => {
            this.setState({
                deliveryInfo:res.deliveryInfo||{}
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val),
          }));  
    }
    render(){
        let {state}=this.props;
        return(
            <div className={styles.serveDetails} >
              <List>
                <List.Item className={styles.historyTop}>
                    其他信息
                </List.Item>

              </List>
           
              <div className={styles.body}>
                    <div className={styles.desc}>
                        <div><span className="mr-8">{state.execRoleName} :</span> 
                        <span className={styles.people}>
                        <span className="mr-8">{state.execUserName}</span>
                        <span className="mr-8">{state.mobilePhone}</span>
                        <span className="mr-8" style={{display:state.mobilePhone?null:'none'}}><Tel tel={state.mobilePhone}/></span>
                        </span>
                    </div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.props.getDate(state.appointDate)}</div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.props.getDate(state.finishDate)}</div>
                    </div>
                </div>

               
                 
                
           


              
            </div>
    )
    }
}
