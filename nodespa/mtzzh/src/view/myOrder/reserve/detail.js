import React, { Component } from 'react';
import {Icon ,List,WhiteSpace,ListView,Steps,Card,PullToRefresh, Button} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
import { imgAddress } from '../../../request/baseURL';
import NoResult from '../../../component/noResult';
import Tel from '../../../component/tel'
const Step = Steps.Step;
export default class reserve extends Component {
    state = {
        data:{},
        current:1,
        steps : [{
            title: '',
            description: '上门量尺',
          }, {
            title: '',
            description: '付款',
          }, {
            title: '',
            description: '方案设计',
          },{
            title: '',
            description: '上门复尺',
          },{
            title: '',
            description: '上门放样',
          }],
          dataSource:new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        dataBlobs:[]
    }
    componentDidMount(){
        this.init();
    }
    init(){
        //获取售后列表
        let {location} = this.props,{state}=location;
   
        request({method : 'get', url: api.getOrderDetail+state.id, data: {} }).then(res => {
            let data = {
                    budget: 0,
                    cityName: "嘉兴市",
                    communicateNeeds: "",
                    contractId: "ACS057399990001",
                    customerAddress: "那些继续继续九分裤卡夫卡饭卡",
                    customerId: 25295,
                    customerName: "好的好",
                    customerPhone: "13197643246",
                    depositPrice: 0,
                    districtName: "嘉善县",
                    doorPicture: {},
                    doorType: "",
                    fitmentDate: 1540224000000,
                    fordid: 897151602,
                    guideName: "i测试门店",
                    guidePhone: "",
                    intentionProducts: [
                        {
                            color: "",
                            fordno: "A201810230003",
                            goodsCode: "312090012",
                            goodsName: "MT34门套",
                            name: "312090012 MT34门套",
                            quantity: 1,
                            sizeDesc: "",
                            texture: "",
                            thumbnail: "",
                            unit: "PCS",
                            unitPrice: 0
                        },
                        {
                            color: "",
                            fordno: "A201810230003",
                            goodsCode: "311030306",
                            goodsName: "4M门角样",
                            name: "311030306 4M门角样",
                            quantity: 1,
                            sizeDesc: "",
                            texture: "",
                            thumbnail: "4M门角样.png",
                            unit: "PCS",
                            unitPrice: 0
                        }
                    ],
                    kitName: "",
                    orderNo: "A201810230003",
                    provinceName: "浙江省",
                    receivableAmt: 0,
                    remark: "",
                    requestDelivery: "",
                    sourceMethod: "手工新增",
                    sourceTime: "2018-10-23 13:55:00.0",
                    styleName: "",
                    tel: "13197643246"
                }
              
            this.setState({ data: data })
        }).catch(err => { console.log(err) })
      
    }
   getSteps=()=>{
    return this.state.steps.map((s, i) => <Step key={i} title={s.title} description={s.description} />);
   }
   goToDetail=()=>{
    const { history, match } = this.props;
    history.push({
        pathname: match.path + '/step',
        state: {}
    })
   }
   toViewStep =()=>{
    const { history, match } = this.props;
   
    history.push({
        pathname: match.path + '/step',
        state: {}
    })
   }
   onEndReached = (event) => {
    const { isLoading, hasMore } = this.state;
    if (isLoading || !hasMore)
        return;
    // this.getCaseList()
}

    onRefresh = ({ ...props }) => { console.log(props) }
    wantPro =(intentionProducts=[])=>{
        return intentionProducts.map((item,index)=><div style={{overflow:'hidden',borderTop:index>=1?'1px dashed #999':null,padding:"8px 0px"}} key={item.goodsCode}>
                    <div  className={styles.fl} style={{width:'80px'}}>
                        <img src={imgAddress +
                             item.thumbnail} alt="" width="80" border="1" />
                    </div>
                    <div  className={`${styles.fl} ${styles.ml_8}`}>
                        <h3>{item.goodsName}</h3>
                        <div>规格 : {item.sizeDesc?item.sizeDesc+'mm':''}</div>
                        <div className={styles.redC}>{`￥${item.unitPrice}/${item.unit}`}</div>
                    </div>
                    <div  className={`${styles.fr} `}>
                        x{item.quantity}
                    </div>
                </div>)
    }
    back=()=>{
        this.props.history.goBack()
    }
    toServe=()=>{
        const { history, match } = this.props;
      
        history.push({
            pathname: match.path + '/serve',
            state: {}
        })
    }
    render() {
        let {data,current} = this.state;
        return (
            
            <div className={styles.reserve}>  
            
             <div className={styles.header}>
                <List.Item className={styles.historyTop}> <div ><span className={styles.Handle}>{"已接收"}</span>当前订单 : {data.orderNo} <Icon className={styles.fr+' '+styles.icon} type="down" theme="outlined" size ="lg"  onClick={this.back} /></div></List.Item>
             </div>
             <div className={styles.mb_8}></div>
             {/* <WhiteSpace size="lg" /> */}
            <Card full>
            <Card.Header
                title="订单进度"
                thumb=""
                extra={<span><Icon className={styles.fr+' '+styles.icon} type="right" theme="outlined" onClick={this.toViewStep}/></span>}
            />
            <Card.Body>
                <div style={{marginLeft:-(current-1)*20+'%'}}>
                    <Steps  current={current} direction="horizontal" size="small" >
                        {this.getSteps()}
                    </Steps>
                </div>
                <WhiteSpace size="md"/>
                <div className={styles.desc} style={{paddingLeft:'32px'}}>
                     <div>{"放样员"} : <span className={styles.people}>{"陈莉莉 13065564523"}<Tel /></span></div>
                     <WhiteSpace size="xs"/>
                    <div>{"预约上门时间"} : {"2018-10-12 16:30"}</div>
                    <WhiteSpace size="xs"/>
                    <div className={styles.tips}>
                        {'放样员正在准备上门进行放样,请保持手机畅通哦'}
                    </div>
                </div>

            </Card.Body>
            {/* <Card.Footer content="footer content" extra={<div>extra footer content</div>} /> */}
            </Card>
            <div className={styles.mb_8}></div>
            <Card full>
            <Card.Header
                title="意向产品"
                thumb=""
                extra={<div><span className={`${styles.fl} ${styles.fs14}`}>共<span className={styles.redC}>{15}</span>件产品</span><span className="blueColor"><a>展开</a></span></div>}
            />
            <Card.Body>
               {this.wantPro(data.intentionProducts)}
              

            </Card.Body>
            </Card>
            <div className={styles.mb_8}></div>
            <Card full>
            <Card.Header
                title="收货地址"
                thumb=""
                extra={null}
            />
            <Card.Body>
                <div className={styles.desc}>
                   <div><label>姓名 : </label><span className={`${styles.people}`}>{`${data.customerName||''}   ${data.customerPhone||''}`}<span style={{display:data.customerPhone?null:'none'}}><Tel /></span></span></div>
                   <div><label>地址 : </label><span className={`${styles.people}  ${styles.fl}`}>{data.cityName+data.districtName+data.customerAddress}</span></div>
                </div>
            </Card.Body>
            </Card>
            <div className={styles.mb_8}></div>
            <Card full>
            <Card.Header
                title="订单信息"
                thumb=""
                extra={null}
            />
            <Card.Body>
                <div className={styles.desc}>
                   <div>导购员 : <span className={styles.people}>{`${data.guideName||""}  ${data.guidePhone||''}`}
                   <span style={{display:data.guidePhone?null:'none'}}><Tel tel={data.guidePhone}/></span></span></div>
                   <div>活动名称 : <span className={styles.people}>{}</span></div>
                   <div>套餐名称 : <span className={styles.people}>{}</span></div>
                   <div>要求交期 : <span className={styles.people}>{}</span></div>
                   <div>下单日期 : <span className={styles.people}>{}</span></div>                   
                </div>
              

            </Card.Body>
            </Card>
            <div className={styles.mb_8}></div>
            <Card full>
            <Card.Header
                title="备注"
                thumb=""
                extra={null}
            />
            <Card.Body>
               <div>{data.remark}</div>
              

            </Card.Body>
            </Card>
                <div className={styles.footer}>
                <div>
                <Button size="small" className={`${styles.fl} ${styles.mr_8}`} type="primary" onClick={()=>{
                      window.location.href ="tel://"+data.guidePhone;
                }}>联系顾问</Button>
                <Button size="small" className={`${styles.fl} ${styles.mr_8}`} type="warning" onClick={this.toServe}>订单服务</Button>
                </div>
                       
                </div>
            </div>
        );
    }
}