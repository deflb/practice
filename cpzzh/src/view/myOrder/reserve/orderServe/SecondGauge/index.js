import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Icon,Pagination} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from '../gauge/title'
import Row from '../gauge/row'
import styles from '../index.less'
import { request } from '../../../../../request';
import  whichImgLink from '../../../../../utlis/whichImgLink';
import api from '../../../../../request/api';
export default class secondGauge extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{},
           current:1,
        }
    }
    componentDidMount(){
        this.init()
      
    }
    init=()=>{
        let {taskNo,orderNo} =this.props.state;
        
        request({ url: api.getTaskCompleteInfo, data: {taskNo,orderNo,taskType:'remeasure'}}).then(res => {
            this.setState({
                measureInfo:res.measureInfo||[{}]
            })
        })
    }
   
    render(){
        let {measureInfo=[{}],current} = this.state;
        let {state} = this.props;
        let info = measureInfo[current-1] ||{};
        let {rooms=[]} = info; 
       
        return(
            <div className={styles.serveDetails}>
              <List>
                <List.Item className={styles.historyTop}>
                    复尺信息
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
                         <img src={whichImgLink(info.unitsPicture)} width="100%" alt=""/>
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
               
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="复尺清单"
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
                <div style={{display:measureInfo.length<2?'none':null}}>
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
            </div>
    )
    }
}
