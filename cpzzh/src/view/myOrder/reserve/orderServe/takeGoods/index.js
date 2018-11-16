import React, {Component} from 'react';
import {List,WhiteSpace,Card,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import { crmFileAddress } from '../../../../../request/baseURL';
import styles from '../index.less'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
export default class SendGoods extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{}
        }
    }
    componentDidMount(){
        // let data= {
        //     customerId: 34448,
        //     installInfo: {
        //         completeTime: 85106,
        //         customerConfirmPhotos: [
        //                 "string1",
        //                 "string2",
        //                 "string3",
        //                 "string4",
        //                 "string5"
        //             ],
        //             customerRecordings: [
        //                 "string1",
        //                 "string2",
        //                 "string3",
        //                 "string4",
        //                 "string5"
        //             ],
        //             installedPhotos: [
        //                 "string1",
        //                 "string2",
        //                 "string3",
        //                 "string4",
        //                 "string5"
        //             ],
        //             installingPhotos: [
        //                 "string1",
        //                 "string2",
        //                 "string3",
        //                 "string4",
        //                 "string5"
        //             ],
        //             staffName: "刘全有",
        //             staffPhone: "1646644584",
        //             uninstallPhotos: [
        //                 "string1",
        //                 "string2",
        //                 "string3",
        //                 "string4",
        //                 "string5"
        //             ]
        //         },
        //         taskNo: 2699,
        //         taskProgress: {
        //             "index": 0,
        //             "mainProcess": "A08",
        //             "processType": "AssignOrderProcess",
        //             "status": 1,
        //             "subProcess": "A0803"
        //         },
        //         taskType: "mark"
        //     }
        // this.setState({data})
        this.init()
    }
    init=()=>{
        let {taskNo,orderNo,taskType} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType}}).then(res => {
            this.setState({
                data:res
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        return Array.from(ImgList).map((_val, i) => ({
            icon: crmFileAddress + api.crmFileUrl(_val),
          }));  
    }
    render(){
        let {data} = this.state,{installInfo={}}=data,{state} =this.props;
        return(
            <div className={styles.serveDetail} >
              <List>
                <List.Item className={styles.historyTop}>
                    安装信息{data.sss}
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

                <Card full className ={"mt-8"}>
                <Card.Header
                    title="安装前拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                          renderItem={(el,index)=>{
                              return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.uninstallPhotos)}/>
                </div>
                   

                </Card.Body>
                </Card>

              <Card full className ={styles.mt_2}>
                <Card.Header
                    title="安装中拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                          renderItem={(el,index)=>{
                              return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.installingPhotos)} />
                </div>
                   

                </Card.Body>
                </Card>
                <Card full className ={styles.mt_2}>
                <Card.Header
                    title="安装后拍照"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid columnNum={3}
                          itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                          renderItem={(el,index)=>{
                              return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                          }} 
                          hasLine={false}
                         data={this.getPhoto(installInfo.installedPhotos)}/>
                </div>
                   

                </Card.Body>
                </Card>
                <Card full className ={styles.mt_2}>
                <Card.Header
                    title="现场及异常状况"
                    thumb=""
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px',paddingLeft:'16px',color:'#999'}}>
                     现场安装一切正常,数据精确,没有异常
                </div>
                   

                </Card.Body>
                </Card>
            </div>
    )
    }
}
