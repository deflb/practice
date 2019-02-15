import React, {Component} from 'react';
import styles from './css.less'
import{Accordion,Grid} from 'antd-mobile'
// import api from '../../../../../request/api';
import whichImgLink from '../../../../../utlis/whichImgLink';
import CustomModal from '../../../../../component/customModal';
const { preview } = CustomModal;
export default class Row extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
    componentWillUnmount() {
        CustomModal.unmountFnDialog();
    }
    getPhoto =(ImgList=[])=>{
        if(!Array.isArray(ImgList)||!ImgList){
            ImgList=[]
        }
        return Array.from(ImgList).map((_val, i) => ({
            icon: whichImgLink(_val)
          }));  
    }
    render(){
        let {prop,name,components=[],fixPictures=[],livePictures=[]} = this.props.state;
        let {isFuchi} =this.props;
        let  targetProp = prop||{}
        return(
          <Accordion className={`${styles.row} `} key={name}>
          <Accordion.Panel className={`${styles.row} ${Object.keys(targetProp).length>2?styles.isThree:null}`} header={ 
               (<div className={' normalFontSize'} >
                <div className={styles.left}>
                    {name}
                </div>
                <div className={styles.right+" "+styles.flex}>
                    { 
                        Object.keys(targetProp).map(key=>{
                            return <span key={key} className="ml-8"> {`${key} ${prop[key]}mm`}</span>
                        })}
                   
                </div>
               </div>)} >
               
                        { !components?null:
                           components.map((child,idx)=>{
                               return  <div key={child.name+''+idx} className={styles.floatBox+' normalFontSize xBottom1pxd'}>
                                            <div className={styles.left}>
                                                <label>{child.name}</label>
                                            </div>
                                            <div className={styles.right+' mt-8'}>
                                            { 
                                                 Object.keys(child.sizes).map(key=>{
                                                    return <span key={key} className="ml-8 mb-8"> {`${key} ${child.sizes[key]}mm`}</span>
                                                 })
                                            }
                                            </div>
                                    </div>

                           })
                        }
                        
                        <div style={{display:!livePictures||livePictures.length===0?'none':null}}
                         className={styles.floatBox+' normalFontSize xBottom1pxd'}>
                            <div className={styles.left}>
                                <label>{isFuchi?"复尺照片":'量尺照片'}</label>
                            </div>
                            <div className={styles.right}>
                            <Grid data={this.getPhoto(livePictures)} 
                                 columnNum={2}
                                itemStyle={{margin:'0 8px  8px 0'}}
                                renderItem={(el,index)=>{
                                    return <img width="100%" className={styles.iconImg} key={index+'iconImg3'} alt=""
                                    onClick={()=>{
                                        preview([{url:el.icon}])
                                    }}
                                    src={el.icon}/>
                                }} 
                                hasLine={false}/>
                            </div>
                        </div>
                        <div style={{display:!fixPictures||fixPictures.length===0?'none':null}}
                         className={styles.floatBox+' normalFontSize '}>
                            <div className={styles.left}>
                                <label>整改照片</label>
                            </div>
                            <div className={styles.right}>
                            <Grid data={this.getPhoto(fixPictures)} 
                                columnNum={2}
                                itemStyle={{margin:'0 8px  8px 0'}}
                                renderItem={(el,index)=>{
                                    return <img  width="100%" alt="" className={styles.iconImg} key={index+'iconImg3'} src={el.icon} 
                                    onClick={()=>{
                                        preview([{url:el.icon}])
                                    }}/>
                                }} 
                                
                                hasLine={false}/>
                            </div>
                        </div>
                    
                   
          </Accordion.Panel>
           
          </Accordion>
    )
    }
}
