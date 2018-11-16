import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class typesClassifySelect extends Component {
    state = {
        current: ''
    }

    static propTypes = {
        source: PropTypes.array, // [{title,val}]
        itemClick: PropTypes.func,
    }

    static defaultProps = {
        source: [],
        itemClick: function () { }
    }

    componentDidMount() {
        const { source, itemClick } = this.props;
        if (source.length) {
            const current = source[0].val;
            this.setState({ current })
            itemClick(current)
        }
    }

    render() {
        const { current } = this.state,
            { source, itemClick } = this.props;
        return <ul className={styles.wrapper}>{
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