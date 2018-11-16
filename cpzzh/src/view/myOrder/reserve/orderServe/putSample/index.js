import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid,Pagination,Icon} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from '../gauge/title'
import Col from './col'
import { crmFileAddress } from '../../../../../request/baseURL';
import styles from '../index.less'
import { request } from '../../../../../request';
import api from '../../../../../request/api';
export default class PutSample extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
           current:1,
        }
    }
    componentDidMount(){
        // let data ={
        //     customerId: 72416,
        //     markInfos: [
        //             {
        //                 markDrawing: [
        //                     {
        //                         img: "https://beta.3vjia.net//UpFile_ConstructionImage/C00002433/201810/6f28acfae1244eb1bfb0c2cd1d76bd1a.png",
        //                         name: "房间-111B墙面"
        //                     }
        //                 ],
        //                 rooms: [
        //                     {
        //                         components: [
        //                             {
        //                                 actDeep: 0,
        //                                 actHeight: 0,
        //                                 actWidth: 0,
        //                                 actmeasureno: "11B0101",
        //                                 deep: 390,
        //                                 height: 2400,
        //                                 name: "GQG-ZG-007-316140013",
        //                                 objId: "138025",
        //                                 remark: "",
        //                                 width: 1000
        //                             }
        //                         ],
        //                         photos: [],
        //                         isMark: "0",
        //                         needMark: "1",
        //                         proxyNumber: "11B",
        //                         roomCode: "11",
        //                         roomName: "房间-1",
        //                         wallCode: "01B",
        //                         wallName: "11B墙面"
        //                     }
        //                 ],
        //                 unitName: "4"
        //             },
        //             {
        //                 markDrawing: [
        //                     {
        //                         img: "https://beta.3vjia.net//UpFile_ConstructionImage/C00002433/201810/6f28acfae1244eb1bfb0c2cd1d76bd1a.png",
        //                         name: "66666666"
        //                     }
        //                 ],
        //                 rooms: [
        //                     {
        //                         components: [
        //                             {
        //                                 actDeep: 0,
        //                                 actHeight: 0,
        //                                 actWidth: 0,
        //                                 actmeasureno: "11B0101",
        //                                 deep: 390,
        //                                 height: 2400,
        //                                 name: "GQG-ZG-007-316140013",
        //                                 objId: "138025",
        //                                 remark: "",
        //                                 width: 1000
        //                             }
        //                         ],
        //                         photos: [1,122,34],
        //                         isMark: "0",
        //                         needMark: "1",
        //                         proxyNumber: "11B",
        //                         roomCode: "11",
        //                         roomName: "房间-1",
        //                         wallCode: "01B",
        //                         wallName: "11B墙面"
        //                     }
        //                 ],
        //                 unitName: "4"
        //             }
        //         ],
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
        let {taskNo,orderNo,taskType} =this.props;
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType}}).then(res => {
            this.setState({
                data:res
            })
        })
    }
    getPhoto =(ImgList=[])=>{
        return Array.from(ImgList).map((_val, i) => ({
            icon: crmFileAddress + api.crmFileUrl(_val.img),
            name:_val.name
          }));  
    }
    getRoomPhotos =(ImgList=[])=>{
        return Array.from(ImgList).map((_val, i) => ({
            icon: crmFileAddress + api.crmFileUrl(_val),
          }));  
    }
    render(){
        let {data={},current} = this.state,{markInfos=[]}=data;
        let info = markInfos[current-1] ||{};
        let {rooms=[]} = info;
        let{state} = this.props;
        
        return(
            <div className={styles.serveDetail}>
              <List>
                <List.Item className={styles.historyTop}>
                    放样信息
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
                    title="放样照片"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div >
                     <Grid data={this.getPhoto(info.markDrawing)} 
                      itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                      renderItem={(el,index)=>{
                          return <img  alt={el.name} className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                      }} 
                     hasLine={false}/>
                </div>
                   

                </Card.Body>
                </Card>
                </WingBlank >

               
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="放样清单"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px 0'}}>
                    <div >
                    {rooms.map((item,index)=>{
                        return <div key={item.roomCode+''+{index}}> 
                                <Title text={`${item.roomName}${item.wallName}`}/>
                                    {item.components.map((child,index)=>{
                                        return  <Col key={child.objId+''+index} text={child.name} state={child} isPut={item.isMark}/>
                                    })}
                                    <Grid data={this.getRoomPhotos(item.photos)} 
                                        itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                                        renderItem={(el,index)=>{
                                            return <img  alt={el.name} className={styles.iconImg} key={index+'iconI'} src={el.icon}/>
                                        }} 
                                    hasLine={false}/>
                             </div>
                    })}
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
                <Pagination total={markInfos.length}
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
