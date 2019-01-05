import React, { Component } from 'react';
import {Icon,Toast ,List,WhiteSpace,ListView,Accordion,Card,Steps, Button} from 'antd-mobile';
import styles  from './index.less';
import { request } from '../../../request';
import api from '../../../request/api';
import Tel from '../../../component/tel'
import { formatDate } from '../../../utlis';
import whichImgLink from '../../../utlis/whichImgLink';
const Step =  Steps.Step;
export default class reserveDetail extends Component {
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
    }
    componentDidMount(){
        this.init();
       
    }
    init(){
        let {location={}} = this.props,{state={}}=location;
        this.setState({
            orderNo:state.id,
            orderId:state.orderId,
            isLoading:true
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
            nodeList.forEach(item => {
                current +=Number(item.status);
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
                isLoading:false
            })
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

    wantPro =()=>{
        let {data} = this.state,{intentionProducts,batches} = data;
        if(intentionProducts){
            return intentionProducts.map((item,index)=><div style={{overflow:'hidden',borderTop:index>=1?'1px dashed #999':null,padding:"8px 0px"}}  key={item.goodsCode}>
                    <div  className={"fl "} style={{width:'20%',minHeight:'100px'}}>
                    <div className={styles.imgBox}>
                        <img src={whichImgLink(item.thumbnail)} alt=""  border="1" />
                        
                    </div>
                    </div>
                    <div  className={`fl ml-8 normalFontSizeC`} style={{width:'68%'}}>
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
                                        <div  className={"fl"} style={{width:'80px'}}>
                                        <img src={whichImgLink(item.thumbnail)} alt="" width="80" border="1" />
                                        </div>
                                        <div  className={`fl ml-8`}>
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
        this.props.history.goBack()
    }
    toServe=()=>{
        const { history, match } = this.props;
        let {orderId,orderNo} = this.state;
        if(!orderId){
            Toast.fail('没有订单id')
            return 
        }
        history.push({
            pathname: match.path + '/serve',
            state: {orderId,orderNo}
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
                    window.location.href ="tel://"+data.guidePhone;
                }}>联系顾问</Button>
                <Button size="small" className={`fl mr-8`} type="warning" onClick={this.toServe}>订单服务</Button>
            </span>
        }
   
        return <span className="fr">
                <Button size="small" className={`fl mr-8`} type="primary" onClick={()=>{
                    window.location.href ="tel://"+data.guidePhone;
                }}>联系设计师</Button>   
                <Button size="small" className={`fl mr-8`} type="primary" onClick={()=>{
                    window.location.href ="tel://"+data.guidePhone;
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
    render() {
        let {data={},orderNo,current,goodsNumber,offical} = this.state;
       
        return (
         
            <div className={styles.reserve}>   
            
             <div className={styles.header}>
                <List.Item className={styles.historyTop}>
                 <div className="normalFontSizeC" style={{display:'flex'}}>
                       <span>{this.statusIcon(data.recerveStatusDesc)}</span> 
                    
                     <div className={"normalFontSizeC"} style={{display:'flex',flex:'1',width:'80%'}}>
                     <div className="oneRowOverflowOmit mr-8" style={{flex:'1'}}>
                        当前订单 : {data.orderNo||orderNo} 
                     </div>
                     <Icon className={styles.icon} type="down" theme="outlined" size ="lg"  onClick={this.back} />
                     </div>
                     </div></List.Item>
                 </div>
             <div className="mb-8"></div>
             <div className={styles.flexItem} >
             {!data?(<div className={styles.nothing}>暂无详情</div>):
                   
            <div style={{paddingBottom:'52px'}}>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">订单进度</span>)}
                thumb=""
                extra={<span><Icon className={"fr "+styles.icon} type="right" theme="outlined" onClick={this.toViewStep}/></span>}
            />
            <Card.Body >
                <div style={{right:0,position:'relative',overflowY:'auto',paddingTop:'4px'}} >
                    <Steps  current={current} direction="horizontal" size="small" >
                        {this.getSteps()}
                    </Steps>
                </div>
                <WhiteSpace size="lg"/>
                <div className={styles.desc} style={{paddingLeft:'32px'}}>
                    {this.state.steps[current-1]?this.state.steps[current-1].desc:''}
                </div>

            </Card.Body>
            {/* <Card.Footer content="footer content" extra={<div>extra footer content</div>} /> */}
            </Card>



            <div className="mb-8"></div>
            <Card full>
            <Card.Header
                title={(<span className="normalFontSizeC">{offical?"产品信息":"意向产品"}</span>)}
                thumb=""
                extra={<div><span className={`fl normalFontSizeC`}>共<span className={`${styles.redC}`}> {goodsNumber} </span>件产品</span><span className="blueColor normalFontSizeC">展开</span></div>}
            />
            <Card.Body style={{paddingTop:'0'}}>
             {this.wantPro(data.intentionProducts)}
            

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
                <div className={styles.feiyo}>
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
                <div><label>姓名 : </label><span className={`${styles.people}`}>
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
                    <div>导购员 : <span className={styles.people}>{`${data.guideName||""}  ${data.guidePhone||''}`}
                    <span className="ml-8" style={{display:data.guidePhone?null:'none'}}><Tel tel={data.guidePhone}/></span></span></div>
                    <div>活动名称 : <span className={styles.people}>{data.factivitytitle}</span></div>
                    <div>套餐名称 : <span className={styles.people}>{data.factivitysuitename}</span></div>
                    <div>要求交期 : <span className={styles.people}>{this.getDate(data.forddate)}</span></div>
                    <div>下单日期 : <span className={styles.people}>{this.getDate(data.fordrdate)}</span></div>                   
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
            <div className={styles.footer}>
                {this.footer(data)}
                    
            </div>
    </div>
        );
    }
}