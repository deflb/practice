import React, {Component} from 'react';
import {List,WhiteSpace,Card,WingBlank,Grid,Badge, Button,Toast} from 'antd-mobile'
import Tel from '../../../../../component/tel'
import styles from '../index.less';
import { crmFileAddress } from '../../../../../request/baseURL';
import { request } from '../../../../../request';
import api from '../../../../../request/api';
export default class Design extends Component {
    constructor(props) {
        super(props)
        this.state={
           data:{}
        }
    }
    componentDidMount(){
        // let data ={
        //     customerId: 75456,
        //     designInfo: {
        //         designTime: 1540288768130,
        //         projectList: [
        //                 {
        //                     name: "旗舰店全景效果专修图v1.1",
        //                     number: "19568819",
        //                     overallView: "",
        //                     renders: [
        //                         "https://3vj-render.3vjia.com/UpFile_Render/C00002433/DesignSchemeRenderFile/201810/31/19568819/f52ba8f35ea5410d9c1e16c4379c7af1.jpg",
        //                         "https://3vj-render.3vjia.com/UpFile_Render/C00002433/DesignSchemeRenderFile/201810/23/19568819/552db20a78a148018faab6829f475fdc.jpg"
        //                     ]
        //                 }
        //             ],
        //             status: "客户已确图"
        //         },
        //         taskNo: 897151604,
        //         taskProgress: {
        //             "index": 1,
        //             "mainProcess": 1,
        //             "processType": 1,
        //             "status": 1,
        //             "subProcess": 1
        //         },
        //         taskType: "design"
        //     }

        //     this.setState({data})
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
    getDate=(date,isLong)=>{
        if(!date||date<150000000){
            return date
        }
        if(isLong){
            return new Date(date).toLocaleString().replace(/\//g,'-') 
        }
        return new Date(date).toLocaleString().replace(/\//g,'-').slice(0,-10)
    }
    getPhoto =(ImgList=[])=>{
        return Array.from(ImgList).map((_val, i) => ({
            icon: crmFileAddress + api.crmFileUrl(_val),
          }));  
    }
    toOverall=(url)=>{
        if(!url){
            Toast.fail('暂无全景图', 1);
            return
        }
        const { history } = this.props;
        history.push({
            pathname: url,
            state: {}
        })
    }
    toShare=(content)=>{
        if(!content){
            Toast.fail('暂无可分享的全景图', 1);
            return
        }
    }
    render(){
        let {data} = this.state,{designInfo={}}=data,{projectList=[]}=designInfo;
        let{state} = this.props;
        return(
            <div className={styles.serveDetail}>
              <List>
                <List.Item className={styles.historyTop}>
                    设计信息
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
                    <div><span className="mr-8">{"预约上门时间"} :</span> {this.getDate(state.appointDate)}</div>
                    <WhiteSpace />
                    <div><span className="mr-8">{"完成时间"} :</span> {this.getDate(state.finishDate)}</div>
                    </div>
                </div>
               
                {projectList.map((item,index)=>{
                    return <WingBlank key={item.number} className={styles.mt_16}>
                    <Card full  >
                    <Badge size="large"
                     text={designInfo.status.slice(-3)} corner>
                  <Card.Body>
                     <div >
                          <div>{item.name}</div>
                          <WhiteSpace/>
                          <div className="textFontSize greyColor overflow">
                              <span className="fl">{item.number}</span>
                              <span className="fr">上传时间:  {this.getDate(designInfo.designTime,true)}</span>
                          </div>
                     </div>
                     <div className={styles.mt_16} style={{borderBottom:'1px dashed #999'}}></div>
                     <div >
                          <Grid data={this.getPhoto(item.renders)} 
                          columnNum={3}
                          itemStyle={{margin:'8px 8px  0 0',height:'75px'}}
                          renderItem={(el,index)=>{
                              return <img  alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon}/>
                          }} 
                          hasLine={false}/>
                           <WhiteSpace/>
                     </div>
                    <div className={styles.cardFoo}>
                     <div className={"fl "+styles.overallView} onClick={this.toOverall.bind(this,item.overallView)} >
                         前往查看720°全景图
                      </div>
                      <div className=" fl textFontSize" style={{width:'36%',padding:'0 8px'}}>
                       <Button type="ghost" size="small" onClick={this.toShare.bind(this,item.overallView)}>分享效果图</Button></div>
                     
                   </div>
                  </Card.Body>
                  </Badge>
                  </Card>
                  </WingBlank>
                })}
            </div>
    )
    }
}
