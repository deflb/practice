import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from '../gauge/title'
import Row from '../gauge/row'
import { imgAddress } from '../../../../../request/baseURL';
import styles from '../index.less'
export default class SendGoods extends Component {
    constructor(props) {
        super(props)
        this.state={
           
        }
    }
 
    render(){
        const photoData  = Array.from(new Array(4)).map((_val, i) => ({
            icon: '666',
          }));
          const photoData2  = Array.from(new Array(1)).map((_val, i) => ({
            icon: '666',
          }));
        return(
            <div className={styles.serveDetail} >
              <List>
                <List.Item className={styles.historyTop}>
                    送货信息
                </List.Item>

              </List>
           
                <div className={styles.body}>
                    <div className={styles.desc}>
                        <div>{"送货员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel/></span></div>
                        <WhiteSpace size="xs"/>
                        <div>{"预约上门时间"} : {"2018-10-12 16:30"}</div>
                        <WhiteSpace size="xs"/>
                        <div>{"签收时间"} : {"2018-10-12 16:30"}</div>
                    </div>
                </div>

                <Card full className ={styles.mt_8}>
                <Card.Header
                    title="送货状况照片"
                    thumb=""
                    extra={'立即分享'}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid data={photoData}   hasLine={true}/>
                </div>
                   

                </Card.Body>
                </Card>

                <Card full className ={styles.mt_8}>
                <Card.Header
                    title="签收照片"
                    thumb=""
                    extra={'立即分享'}
                />
                <Card.Body style={{padding:'8px'}}>
                 
                
                <div style={{minHeight:'60px'}}>
                     <Grid data={photoData2}   hasLine={true}/>
                </div>
                   

                </Card.Body>
                </Card>

              
            </div>
    )
    }
}
