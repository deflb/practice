import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Icon,Pagination} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from './title'
import Row from './row'
import styles from '../index.less'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
import { crmFileAddress } from '../../../../../request/baseURL';
export default class Gauge extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
           current:1,
        }
    }
    componentDidMount(){
        this.init()
        // let data = {
        //     customerId: 25298,
        //     measureInfo: [
        //             {
        //                 rooms: [
        //                     {
        //                         prop: {
        //                             "层高": "2800",
        //                             "脚踢线": "100"
        //                         },
        //                         walls: [
        //                             {
        //                                 components: [
        //                                     {
        //                                         sizes: {
        //                                             "厚": "240",
        //                                             "右沿边距": "2235",
        //                                             "宽": "880",
        //                                             "左沿边距": "1355",
        //                                             "距地": "0",
        //                                             "高": "2050"
        //                                         },
        //                                         name: "1-入户门"
        //                                     }
        //                                 ],
        //                                 fixPictures: [
        //                                     "string1",
        //                                     "string2",
        //                                     "string3",
        //                                     "string4",
        //                                     "string5"
        //                                 ],
        //                                 livePictures: [
        //                                     "string1",
        //                                     "string2",
        //                                     "string3",
        //                                     "string4",
        //                                     "string5"
        //                                 ],
        //                                 prop: {
        //                                     "墙长": "3536"
        //                                 },
        //                                 name: "01A墙面"
        //                             }
        //                         ],
        //                         name: "房间-1"
        //                     }
        //                 ],
        //                 unitName: "908",
        //                 unitsPicture: "http://192.168.5.77/group2/M00/00/15/wKgFTVsXjI6ABBkUAARmpA-syYI881.png"
        //             }
        //         ],
        //         taskNo: 2697,
        //         taskProgress: {
        //             index: 0,
        //             mainProcess: "A02",
        //             processType: "AssignOrderProcess",
        //             status: 1,
        //             subProcess: "A0204"
        //         },
        //         taskType: "measure"
        //     }
        // this.setState({data})
       
    }
    init=()=>{
        let {taskNo,orderNo,taskType} =this.props.state;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType}}).then(res => {
            this.setState({
                data:res
            })
        })
    }
   
    render(){
        let {data={},current} = this.state,{measureInfo=[{}]}=data;
        let {state} = this.props;
        let info = measureInfo[current-1] ||{};
        let {rooms=[]} = info; 
     
        return(
            <div className={styles.serveDetail}>
              <List>
                <List.Item className={styles.historyTop}>
                    量尺信息
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
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title={`户型图`}
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                     <div style={{minHeight:'200px'}}>
                    <div className="tc">{info.unitName}</div>
                         <img src={crmFileAddress + api.crmFileUrl(info.unitsPicture)} width="100%" alt=""/>
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
               
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="量尺清单"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px 0'}}>
                    <div style={{minHeight:'200px'}}>
                    {
                        rooms.map((item,index)=>{
                            return <div key={item.name+''+index}>
                                     <Title text={item.name} prop={item.prop}/>
                                     {item.walls.map((child,idx)=>{
                                         return  <Row key={child.name+''+idx} 
                                                     state={child}/>
                                     })}
                                    
                       
                                     </div>
                        })
                    }
                       
                        
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
                <Pagination total={measureInfo.length}
                    className={styles.pagination}
                    simple={true}
                    current={current}
                    onChange={(current)=>{
                       this.setState({current})
                    }}
                    locale={{
                        prevText: (<span  className="arrow-align"><Icon type="left" /></span>),
                        nextText: (<span  className="arrow-align"><Icon type="right" /></span>),
                    }}
                    />
            </div>
    )
    }
}
