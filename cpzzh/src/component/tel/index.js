import React, {Component} from 'react';

export default class Tel extends Component {
    constructor(props) {
        super(props)
     
        this.state={
           
        }
    }
    
    render(){
        return(

            <a href={`tel:${this.props.tel}`}>
              <i className='iconfont icon-tel01 greenColor' />
            </a>
    )
    }
}
