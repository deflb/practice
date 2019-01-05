import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import routerBase from '../../router/routerBase';
import PropTypes from 'prop-types';
import { formatDate } from '../../utlis';
import whichImgLink from '../../utlis/whichImgLink';
import styles from './index.less';

export default connect()(class selectionCaseLook extends Component {

    static propTypes = {
        rowClick: PropTypes.func, // 整行点击处理
        data: PropTypes.object,
    }
    static defaultProps = {
        rowClick: function () { },
        data: {} // { styleName, buildName, creator, views, createTime, surfacePlotUrl}
    }
    onRowClick = () => { // 整行区域
        const { dispatch, data } = this.props;
        dispatch(push(routerBase + '/moreCase/case', { id: data.id }))
    }

    render() {
        const { data, className = null, style = null, rowClick } = this.props,
            { styleName, buildName, creator, views, createTime, surfacePlotUrl } = data;
        return (
            <div onClick={rowClick} className={className ? `${styles.wrapper} ${className}` : styles.wrapper} style={style}>
                <img src={whichImgLink(surfacePlotUrl)} alt={styleName} />
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
})