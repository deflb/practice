import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './classify.less';

export default class classify extends Component {
    state = {
        current: null,
    }

    static propTypes = {
        source: PropTypes.array,
        itemClick: PropTypes.func,
    }

    static defaultProps = {
        source: [],
        itemClick: function () { }
    }

    componentDidMount() {
        const { source, itemClick } = this.props,
            val = source[0].val;
        if (source.length) {
            this.setState({ current: val })
            itemClick(val)
        }
    }

    render() {
        const { current } = this.state,
            { source, itemClick } = this.props;
        return <ul className={`${styles.wrapper} normalFontSizeC xBottom1px`}>{
            source.map((item, index) => <li
                key={item.val}
                className={current === item.val ? styles.active : null}
                onClick={e => {
                    const { current } = this.state, { val } = item;
                    if (current !== val) {
                        this.setState({ current: val })
                        itemClick(val)
                    }
                }}
            ><div style={{ borderRight: index >= source.length - 1 ? 'none' : null }}>{item.title}</div></li>)
        }</ul>
    }
}