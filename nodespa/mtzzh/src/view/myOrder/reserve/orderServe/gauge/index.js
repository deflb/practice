import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import Title from './title'
import Row from './row'
import { imgAddress } from '../../../../../request/baseURL';
import styles from '../index.less'
export default class Gauge extends Component {
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
                    量尺信息
                </List.Item>

              </List>
           
                <div className={styles.body}>
                    <div className={styles.desc}>
                        <div>{"测量员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel/></span></div>
                        <WhiteSpace size="xs"/>
                        <div>{"预约上门时间"} : {"2018-10-12 16:30"}</div>
                        <WhiteSpace size="xs"/>
                        <div>{"完成时间"} : {"2018-10-12 16:30"}</div>
                    </div>
                </div>
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="户型图"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px'}}>
                     <div style={{minHeight:'200px'}}>
                         <img />
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
                <WingBlank size="md">
                <Card full>
                <Card.Header
                    title="现场照片"
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
                    title="量尺清单"
                    thumb=""
                    className={styles.f2f2f2}
                    extra={null}
                />
                <Card.Body style={{padding:'8px 0'}}>
                    <div style={{minHeight:'200px'}}>
                        <Title text="客厅,餐厅"/>
                        <Row text={"入户门"} w={880} h={880} t={880} long={false}/>
                        <Row text={"直窗"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Row text={"开关"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Row noborder={true} text={"弱电箱"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Title text="主卧"/>
                        <Row text={"主卧门"} w={880} h={880} t={880} long={false}/>
                        <Row text={"直窗"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Row noborder={true} text={"开关"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Title text="次卧"/>
                        <Row text={"次卧门"} w={880} h={880} t={880} long={false}/>
                        <Row text={"直窗"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Row noborder={true} text={"开关"} w={880} h={880} t={880} a={666} d={666} long={true}/>
                        <Title text="儿童房"/>
                        <Row noborder={true} text={"儿童房门"} w={880} h={880} t={880} long={false}/>
                    </div>
                </Card.Body>
                </Card>
                </WingBlank>
            </div>
    )
    }
}
