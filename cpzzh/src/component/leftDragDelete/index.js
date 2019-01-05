import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SwipeAction } from 'antd-mobile';
import styles from './index.less';

export default class leftDragDelete extends Component {
    static propTypes = {
        onClick: PropTypes.func,
    }
    static defaultProps = {
        onClick: function () { }
    }
    render() {
        let { children, onClick, className = null, style = null } = this.props;
        return <SwipeAction
            className={className}
            style={style}
            right={[
                {
                    text: '删除',
                    onPress: onClick,
                    className: styles.del
                }
            ]}
        >{children}</SwipeAction>
    }
}