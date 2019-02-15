import React, { Component } from 'react';
import {Icon,Toast ,List,WhiteSpace,ListView,Accordion,Card,Steps, Button} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
import Tel from '../../../component/tel'
import { formatDate } from '../../../utlis';
import whichImgLink from '../../../utlis/whichImgLink';
import CustomModal from '../../../component/customModal';
import { connect } from 'react-redux';
const { preview } = CustomModal;
const Step =  Steps.Step;
export default connect(state => ({
    userInfo: state.userInfo
}))( class reserveDetail extends Component {
    state = {
        data:{},
        current:1,
        steps : [],
          dataSource:new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        }),
        dataBlobs:[],
        goodsNumber:0,
        offical:false,//是否正式详情
        isOnly:true,
        length:1
    }
   
    componentDidMount(){
        let {location={}} = this.props,{state={}}=location;
        this.init(state);
        
    }
   
      componentWillUnmount() {
        CustomModal.unmountFnDialog();
       
      }

  
    init(state){
        
        if(!state.id){
            this.initFirst()
            return 
        }
        this.setState({
            orderNo:state.id,
            orderId:state.orderId,
            isOnly:state.isOnly,
            isLoading:true,
        })
        if(!state.offical){
             request({method : 'get', url: api.getOrderDetail+state.id, data: {} }).then(res => {
            let num = 0;
            if(res)
                res.intentionProducts.forEach(item=>{
                        num+=item.quantity
                })
                if(res&&res.fordid){
                    this.initSteps(res.fordid);
                }
                this.setState({
                    data: res||{} ,isLoading:false,goodsNumber:num})
            }).catch(err => { 
                this.setState({
                    isLoading:false
                })
            })
        }else{
                
            request({method : 'get', url: api.getOfficalDetail+state.id, data: {} }).then(res =>{
                let num = 0;
                
                if(res){
                      res.batches.forEach(child=>{
                        child.orderProducts.forEach(item=>{
                            num+=item.number
                        })
                  
                    });
                    if(res&&res.fordid){
                        this.initSteps(res.fordid);
                    }
                    
                    this.setState({
                        data: res ||{},
                        isLoading:false,
                        goodsNumber:num,
                        offical:true})
                }else{
                    Toast.fail("不是正确的销货单号")
                }

            }).catch(err => { 
                this.setState({
                    isLoading:false
                })
            })
        }
       
        
      
    }
    initFirst=()=>{
        const {userInfo } =this.props;
       
            if(!userInfo.customerId){
                this.setState({
                    isLoading:false
                })
                return
            }
            request({ url: api.getOrderList, data: { pageNo: 1, pageSize: 100,fcstid:userInfo.customerId } }).then(res => {
                    if(res.list.length>0){
                        let a = res.list[0];
                        this.init({
                            id:a.orderNo,
                            orderId:a.orderId,
                            isOnly:res.list.length>1?false:true
                        }) 
                    }else{
                        this.setState({
                            isLoading:false,
                            inNothing:true
                        })
                    }
                    
                    }).catch(err => { console.log(err) })
                   
    }
    initSteps=(orderId)=>{
        let data ={orderId:orderId}
        this.setState({
            isLoading:true,
            orderId
        })
        request({ url: api.getOrderProgress, data }).then(res => {
            let steps =[];
            let{nodeList} = res;
            let current = 0;
            let length = nodeList.length;
            nodeList.forEach((item,index) => {
                if(item.status===0&&current===0){
                    current = index+1
                }
                let obj = {};
                obj.title = "";
                obj.description = item.nodeName;
                obj.status = item.status;
                obj.desc =<div className={styles.desc}>
                { item.items.map(item=>{
                    return <div key={item.key}>{item.key} : <span className={item.phone?styles.people:''}>{`${this.getDate(item.value)||''} ${item.phone||""}`}
                        <span style={{display:item.phone?null:'none'}}><Tel  tel={item.phone}/></span></span>
                        <WhiteSpace size="xs"/>
                    </div>
                })}
                </div>
                steps.push(obj)
            });
           
            this.setState({
                steps:steps,
                current,
                isLoading:false,
                length
            })
            
            this.contentNode.scrollLeft = this.contentNode.scrollWidth
        }).catch(err => { console.log(err)
        this.setState({
            isLoading:false
        })
        })
    }
    getIcon=(s)=>{
        return s.status?( <i className='iconfont icon-check-circle greenColor' />):<i className='iconfont icon-time uncheckedIcon ' style={{width:'20px',height:'20px'}}/>
     }
    
    getSteps=()=>{
        return this.state.steps.map((s, i) => <Step key={i} status={"wait"} title={s.title} description={s.description}  icon={this.getIcon(s)} />);
       }
    
 
   
   toViewStep =()=>{//跳到进度
    const { history, match } = this.props;
    let {data} = this.state;
    if(!data.fordid){
        Toast.fail('没有订单id')
        return 
    }
    history.push({
        pathname: match.path + '/step',
        state: {id:data.fordid}
    })
   }
   onEndReached = (event) => {
    const { isLoading, hasMore } = this.state;
    if (isLoading || !hasMore)
        return;
    // this.getCaseList()
}

    wantPro =(bool)=>{//是否收起
        let {data} = this.state,{intentionProducts,batches} = data;
        if(!bool){
            if(intentionProducts)
            intentionProducts = intentionProducts.slice(0,3);
            if(batches)
            batches = batches.slice(0,3)
        }
        if(intentionProducts){
            return intentionProducts.map((item,index)=><div style={{overflow:'hidden',borderTop:index>=1?'1px dashed #999':null,padding:"8px 0px"}}  key={item.goodsCode}>
                    <div  className={"fl "} style={{width:'30%',minHeight:'100px'}}>
                    <div className={styles.imgBox}>
                        <img src={whichImgLink(item.thumbnail)} onClick={()=>{
                            preview([{url:whichImgLink(item.thumbnail)}])}} onError={()=>{
                           item.thumbnail = ""
                        }} alt=""  width="100%" border="1" />
                        
                    </div>
                    </div>
                    <div  className={`fl ml-8 normalFontSizeC`} style={{width:'58%'}}>
                        <div className="titleFontSizeC">{item.goodsName}</div>
                        <div className="greyColor">规格 :<span className="ml-8">{item.sizeDesc?item.sizeDesc:''}</span></div>
                        <div className={styles.redC}>{`￥${item.unitPrice}/${item.unit}`}</div>
                    </div>
                    <div  className="fr greyColor normalFontSizeC" style={{width:'8%'}}>
                        x{item.quantity}
                    </div>
                </div>)
        }
        else if(batches){
            return <Accordion>
            {batches.map((item,index)=>{
                return <Accordion.Panel header={item.name} key={item.name+index}>  
                            
                            {item.orderProducts.map((item,index)=>{
                                return <div key={index+''+item.code}>
                                    <div style={{overflow:'hidden',borderTop:index>=1?'1px dashed #999':null,padding:"8px 0px"}} key={item.code}>
                                        <div  className={"fl"} style={{width:'30%'}}>
                                        <img src={whichImgLink(item.thumbnail)} onClick={()=>{
                            preview([{url:whichImgLink(item.thumbnail)}])}} alt="" width="100%" border="1" 
                                        onError={()=>{
                                            item.thumbnail = ""
                                         }} />
                                        </div>
                                        <div  className={`fl ml-8`} style={{width:'58%'}}>
                                            <h3>{item.name}</h3>
                                            <div>规格 : {item.size?item.size+'mm':''}</div>
                                            <div className={styles.redC}>{`￥${item.price}/pcs`}</div>
                                        </div>
                                        <div  className="fr">
                                            x{item.number}
                                        </div>
                                    </div>
                                </div>
                            })}
                          
                       </Accordion.Panel>
                        
            }) }</Accordion> 
        }
    }
    back=()=>{
        const { history, match } = this.props;
        history.push({
            pathname: match.path.slice(0,-7),
            state: {}
        })
    }
    toServe=()=>{
        const { history, match } = this.props;
        let {orderId,orderNo,isOnly} = this.state;
        if(!orderId){
            Toast.fail('没有订单id')
            return 
        }
        history.push({
            pathname: match.path + '/serve',
            state: {orderId,orderNo,isOnly}
        })
    }
    toApply=()=>{
        const { history,match } = this.props;
        let {orderId,orderNo} = this.state;
        if(!orderId){
            Toast.fail('没有订单id')
            return 
        }
        history.push({
            pathname:match.path.slice(0,-15)+'/myAfterSale/apply',
            state: {orderId,orderNo}
        })
    }
    getDate=(date)=>{
        if(!date){
            return ""
        }
        if(typeof date==="string"){
            return date
        }
        if(Number(date)<15000000){
            return date
        }
        return formatDate(new Date(date),"YYYY-MM-DD hh:mm")
    }
    footer=(data)=>{
        let {offical} =this.state;
        if(!offical){
            return <span className="fr">
                <Button size="small" className={`fl mr-8`} type="primary" onClick={()=>{
                    window.location.href ="tel:"+data.guidePhone;
                }}>联系顾问</Button>
                <Button size="small" className={`fl mr-8`} type="warning" onClick={this.toServe}>订单服务</Button>
            </span>
        }
   
        return <span className="fr">
                <Button size="small" className={`fl mr-8`} type="primary" onClick={()=>{
                    window.location.href ="tel:"+data.guidePhone;
                }}>联系设计师</Button>   
                <Button size="small" className={`fl mr-8`} type="primary" onClick={()=>{
                   window.location.href ="tel:"+data.guidePhone;
                }}>联系顾问</Button>
                <Button size="small" className={`fl mr-8`} type="warning" onClick={this.toApply}>申请售后</Button>
                <Button size="small" className={`fl mr-8`} type="warning" onClick={this.toServe}>订单服务</Button>
        </span>
    }
    getFunds =(funds=[])=>{
        return funds.map(item=>{
            return <div key={item.name} style={{overflow:'hidden'}} className="mb-8 greyColor">
                        <div className="fl">{item.name}</div>
                        <div className="fr ">￥{item.amount}</div>
                    </div>
        })
    }
    statusIcon =(text)=>{
        if(text){
            return <span className={` ${styles.statusIcon}`}>{text}</span>
        }
        return<span className={` ${styles.statusIcon} ${styles.orange}`}>待处理</span>
        
     
    }
    onOff=()=>{
        let {onOff} = this.state;
        this.setState({
            onOff:!onOff
        })
    }
    render() {
        let {data,orderNo,current,goodsNumber,offical,onOff,isOnly,length,isLoading,inNothing} = this.state;
       
        return (
         
            <div className={styles.reserve}>   
            
             <div className={styles.header} style={{display:!data.orderNo&&!isLoading?"none":null}}>
                <List.Item className={styles.historyTop}>
                 <div className="normalFontSizeC" style={{display:'flex'}}>
                       <span>{this.statusIcon(data.recerveStatusDesc)}</span> 
                    
                     <div className={"normalFontSizeC"} style={{display:'flex',flex:'1',width:'80%'}}>
                     <div className="oneRowOverflowOmit mr-8" style={{flex:'1'}}>
                        当前订单 : {data.orderNo||orderNo} 
                     </div>
                     <Icon style={{display:isOnly?'none':null}} className={styles.icon} type="down" theme="outlined" size ="lg"  onClick={this.back} />
                     </div>
                     </div></List.Item>
                 </div>
             <div className="mb-8"></div>
             <div className={styles.flexItem} >
             {inNothing&&!isLoading?(<div className={styles.nothing}>暂无订单</div>):
                   
            <div style={{paddingBottom:'52px'}}>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">订单进度</span>)}
                thumb=""
                extra={<span><Icon className={"fr "+styles.icon} type="right" theme="outlined" onClick={this.toViewStep}/></span>}
            />
            <Card.Body >
                <div ref={ node => this.contentNode = node } style={{overflowX:'auto',
                paddingTop:'4px'}}
                  >
                    <Steps  current={current} direction="horizontal" size="small" >
                        {this.getSteps()}
                    </Steps>
                </div>
                <WhiteSpace size="lg"/>
                <div className={styles.desc} style={{paddingLeft:'32px'}}>
                    {this.state.steps[length-1]?this.state.steps[length-1].desc:''}
                </div>

            </Card.Body>
            {/* <Card.Footer content="footer content" extra={<div>extra footer content</div>} /> */}
            </Card>



            <div className="mb-8"></div>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">{offical?"产品信息":"意向产品"}</span>)}
                thumb=""
                extra={<div><span className={`fl normalFontSizeC`}>共<span className={`${styles.redC}`}> {goodsNumber} </span>件产品</span><span className="pointer blueColor normalFontSizeC" onClick={this.onOff}>{onOff?"收起":'展开'}</span></div>}
            />
            <Card.Body style={{paddingTop:'0'}}>
             {this.wantPro(onOff)}
            

            </Card.Body>
            </Card>
            <div className="mb-8"></div>
            
            <Card full style={{display:offical?null:'none'}}>
                <Card.Header
                    title={(<span className={`fl normalFontSizeC`}>费用信息</span>)}
                    thumb=""
                    extra={null}
                />
            <Card.Body>
                <div className={styles.feiyo+' normalFontSize'}>
                    <div className={styles.feiyoItem}>
                        <div>应收总额</div>
                        <div className="origanColor">￥{data.totalReceivable}</div>
                    </div>
                    <div className={styles.feiyoItem}>
                        <div>已收总额</div>
                        <div className="origanColor">￥{data.totalReceived}</div>
                    </div>
                    <div className={styles.feiyoItem}>
                        <div>未收总额</div>
                        <div className="origanColor">￥{data.totalUnbundled}</div>
                    </div>
                </div>
                <WhiteSpace/>
                <div className="xBoth1px"></div>
                <WhiteSpace/>
                {this.getFunds(data.funds)}
                <WhiteSpace size="lg"/>
                <div className="xBoth1px"></div>
                <WhiteSpace size="lg"/>
                <div className="titleFontSizeC">
                    <div className="fl">应收总额</div>
                    <div className="origanColor fr">￥{data.totalReceivable}</div>
                </div>
            </Card.Body>
            </Card>
            <div className="mb-8"></div>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">收货地址</span>)}
                thumb=""
                extra={null}
            />
            <Card.Body>
                <div  className={`${styles.desc} pl-8`}>
                <div style={{display:data.customerName?null:'none'}}>
                <label>姓名 : </label><span className={`${styles.people}`}>
                    <span className="mr-8">{data.customerName||''}
                    </span>
                    <span>{data.customerPhone||''}</span>
                    <span className="mr-8" style={{display:data.customerPhone?null:'none'}}><Tel tel={data.customerPhone} /></span>
                    </span>
                </div>
                <div>
                    <label>地址 : </label>
                    <span className={`${styles.people}  fl`}>
                    {`${data.cityName||""}${data.districtName||""}${data.customerAddress||""}`}
                    </span>
                    </div>
                </div>
            </Card.Body>
            </Card>
            <div className="mb-8"></div>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">订单信息</span>)}
                thumb=""
                extra={<span className="blueColor normalFontSizeC">  <i className='iconfont icon-link blueColor ' /> 合同附件</span>}
            />
            <Card.Body>
                <div className={`${styles.desc} pl-8`}>
                    <div>家居顾问 : <span className={styles.people}>{`${data.guideName||""}  ${data.guidePhone||''}`}
                    <span className="ml-8" style={{display:data.guidePhone?null:'none'}}><Tel tel={data.guidePhone}/></span></span></div>
                    <div style={{display:data.factivitytitle?null:'none'}}>活动名称 : 
                    <span className={styles.people}>{data.factivitytitle}</span></div>
                    <div style={{display:data.factivitysuitename?null:'none'}}>套餐名称 : 
                    <span className={styles.people}>{data.factivitysuitename}</span></div>
                    <div style={{display:data.forddate?null:'none'}}>要求交期 : 
                    <span className={styles.people}>{formatDate(new Date(data.forddate),"YYYY-MM-DD")}</span></div>
                    <div style={{display:data.fordrdate?null:'none'}}>下单日期 : 
                    <span className={styles.people}>{formatDate(new Date(data.fordrdate),"YYYY-MM-DD")}</span></div>                   
                </div>
            

            </Card.Body>
            </Card>
            <div className="mb-8"></div>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">备注</span>)}
                thumb=""
                extra={null}
            />
            <Card.Body>
                <div className="greyColor pl-8">{data.remark}</div>
            </Card.Body>
            </Card>
            </div>
                    
        }
        </div>
            <div className={styles.footer} style={{display:!data.orderNo&&!isLoading?"none":null}}>
                {this.footer(data)}
                    
            </div>
    </div>
        );
    }
})