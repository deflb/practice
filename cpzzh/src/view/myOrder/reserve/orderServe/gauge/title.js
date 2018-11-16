import React, {Component} from 'react';
import styles from'./css.less'

export default class Title extends Component {
    constructor(props) {
        super(props)
        this.state={
          
        }
    }
  
    render(){
        let {text,prop} = this.props;
        return(
          <div className={styles.title}>
                {text}
                { 
                    Object.keys(prop).map(key=>{
                        return <span className="ml-8"> {`${key} ${prop[key]}mm`}</span>
                    })
                }
          </div>
    )
    }
}
