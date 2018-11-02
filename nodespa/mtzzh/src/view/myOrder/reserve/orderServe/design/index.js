import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less'
export default class Design extends Component {
    constructor(props) {
        super(props)
        this.state={
           
        }
    }
 
    render(){
        return(
            <div className={styles.serveDetail}>
              <List>
                <List.Item className={styles.historyTop}>
                    方案信息
                </List.Item>

              </List>
           
                <div className={`${styles.body}`}>
                    <div className={styles.desc}>
                        <div>{"设计员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel/></span></div>
                        <WhiteSpace size="xs"/>
                        <div>{"开始时间"} : {"2018-10-12 16:30"}</div>
                        <WhiteSpace size="xs"/>
                        <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
                    </div>
                </div>
                <WingBlank className={styles.mt_16}>
                <Card full  >
               
                <Card.Body>
                 
                   <div style={{height:'300px'}}></div>

                </Card.Body>
                </Card>
                <div className={styles.mt_16} style={{borderBottom:'1px dashed #ccc'}}></div>
                </WingBlank>
               
                <WingBlank className={styles.mt_16} >
                <Card full >
               
                <Card.Body>
                 
                <div style={{height:'300px'}}></div>

                </Card.Body>
                </Card>
                </WingBlank>
            </div>
    )
    }
}
