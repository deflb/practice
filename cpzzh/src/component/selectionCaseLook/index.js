import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utlis'
import styles from './index.less';

export default class selectionCaseLook extends Component {

    static propTypes = {
        data: PropTypes.object,
    }
    static defaultProps = {
        data: {} // {imgUrl}
    }
    render() {
        const { data, className = null, style = null } = this.props,
            { styleName, buildName, creator, views, createTime } = data;
        return (
            <div className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style}>
                <img src={data.imgUrl} alt='' />
                <ul className={styles.wrapper_info}>
                    <li>{styleName}</li>
                    <li>{buildName}</li>
                    <li>{creator}</li>
                    <li><i className='iconfont icon-chakan' />{views}</li>
                    <li>{formatDate(new Date(createTime), 'YY-MM-DD')}</li>
                </ul>
            </div>
        )
    }
}