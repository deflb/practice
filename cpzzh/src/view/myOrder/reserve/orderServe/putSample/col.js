import React, {Component} from 'react';
import styles from './css.less'

export default class Col extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
  
    render(){
        let {text,isPut,noborder} = this.props;
        return(
          <div className={styles.col}>
                <div className={styles.floatBox}>
                <div className={styles.left}>
                    <label>{text}</label>
                </div>
                <div className={styles.right}>
                    {isPut==="1"?"已放样":<span style={{color:'#f90'}}>未放样</span>}
                </div>
                </div>
                <div  style={{borderBottom:'1px dashed #999',marginRight:'2%',display:noborder?"none":null}}></div>
          </div>
    )
    }
}
