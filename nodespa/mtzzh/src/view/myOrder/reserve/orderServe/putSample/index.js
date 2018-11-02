import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from '../gauge/title'
import Col from './col'
import { imgAddress } from '../../../../../request/baseURL';
import styles from '../index.less'
export default class PutSample extends Component {
    constructor(props) {
        super(props)
        this.state={
           
        }
    }
 
    render(){
        const photoData  = Array.from(new Array(8)).map((_val, i) => ({
            icon: '666',
          }));
        return(
            <div className={styles.serveDetail}>
              <List>
                <List.Item className={styles.historyTop}>
                    放样信息
                </List.Item>

              </List>
           
                <div className={styles.body}>
                    <div className={styles.desc}>
                        <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel/></span></div>
                        <WhiteSpace size="xs"/>
                        <div>{"预约上门时间"} : {"2018-10-12 16:30"}</div>
                        <WhiteSpace size="xs"/>
                        <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
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
                 
                
                <div style={{minHeight:'160px'}}>
                     <Grid data={photoData}   hasLine={true}/>
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
                    <div style={{minHeight:'200px'}}>
                        <Title text="客厅,餐厅0101A墙面"/>
                        <Col text={"门洞"} isPut={false}/>
                        <Col text={"门洞"} isPut={false}/>
                        <Col text={"门洞"} isPut={false}/>
                        <Col text={"门洞"} isPut={false}/>
                        <Title text="主卧0101B墙面"/>
                        <Col text={"门洞"} isPut={false}/>
                        <Col text={"门洞"} isPut={false}/>
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
            </div>
    )
    }
}
