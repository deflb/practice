import React, { Component } from 'react';
import {Steps,WhiteSpace,List,Icon,Button} from 'antd-mobile';
import styles  from './index.less';
import NoResult from '../../../../component/noResult';
import Tel from '../../../../component/tel'
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        steps : [],
        current:1
    }
    componentDidMount(){
        this.setState({
            steps:[{
                title: <div className={styles.title}>上门量尺
                 <Button className={`${styles.btn} ${styles.mr_8}`} size="small" onClick={this.toPingjia}>查看评价</Button>
                 <Button className={`${styles.btn} ${styles.yelBtn}`} size="small" onClick={this.toServeDetail}>复尺信息</Button>
                 </div>,
                description: <div className={styles.desc}>
                                <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel /></span></div>
                                <WhiteSpace size="xs"/>
                                <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
                            </div>,
              }, {
                title: '付款',
                description: <div className={styles.desc}>
                <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}</span><Tel tel={'13065564523'}/></div>
                <WhiteSpace size="xs"/>
                <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
            </div>,
              }, {
                title: '方案设计',
                description: <div className={styles.desc}>
                <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}</span><Tel /></div>
                <WhiteSpace size="xs"/>
                <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
            </div>,
              },{
                title: '上门复尺',
                description: <div className={styles.desc}>
                <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel /></span></div>
                <WhiteSpace size="xs"/>
                <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
            </div>,
              },{
                title: '上门放样',
                description: <div className={styles.desc}>
                <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel /></span></div>
                <WhiteSpace size="xs"/>
                <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
            </div>,
              }]
        })
    }
    getSteps=()=>{
        return this.state.steps.map((s, i) => <Step key={i} title={s.title}  description={s.description} />);
       }
    backIndex=()=>{
        const { history, match } = this.props;
       
        history.push({
            pathname: '/myOrder',
            state: {}
        }) 
    }
    toPingjia=()=>{
        const { history, match } = this.props;
       
        history.push({
            pathname: match.path + '/pingjia',
            state: {}
        }) 
    }
    toServeDetail = ()=>{
        const { history, match } = this.props;
       
        history.push({
            pathname: match.path + '/serveDetail',
            state: {}
        }) 
    }
    render() {
        let {Handle,hisNum,current} = this.state;
        return (
            <div className={styles.scheduleServe}>
                <div className={styles.header}>
                     <List.Item className={styles.historyTop}> <div ><span className={styles.Handle}>{Handle}</span>
                     当前订单 : {hisNum} <Icon   onClick={this.backIndex}  className={styles.fr +" "+styles.icon} size="lg" type="down" theme="outlined" /></div></List.Item>
                </div>
                <div className={styles.body}>
                    <Steps current={current} direction="vertical" >
                        {this.getSteps()}
                    </Steps>
                </div>  
               
            </div>
        );
    }
}