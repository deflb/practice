import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

export default class CustomPicker extends Component {
    state = {
        move: 0
    }
    static propTypes = {
        dataSource: PropTypes.array,
        onEndReached: PropTypes.func,
        value: PropTypes.object,
        onChange: PropTypes.func,
        renderItem: PropTypes.func,
        itemHeight: PropTypes.number,
        height: PropTypes.number,
    }
    static defaultProps = {
        dataSource: [],
        onEndReached: () => { },
        value: {},
        onChange: () => { },
        renderItem: () => { },
        itemHeight: 30,
        height: 90,
    }
    onTouchStart = (e) => { this.startPageY = e.targetTouches[0].pageY }
    onTouchMove = (e) => {
        e.preventDefault();
        const { dataSource } = this.props;
        if (dataSource.length) {
            const { onEndReached, itemHeight } = this.props,
                { pageY } = e.targetTouches[0],
                move = pageY - this.startPageY + (this.currentPageY || 0);
            this.setState({ move });
            if (move < -(dataSource.length - 1) * itemHeight) onEndReached()
        }
    }
    onTouchEnd = (e) => {
        const { dataSource } = this.props;
        if (dataSource.length) {
            const { itemHeight, onChange } = this.props,
                { pageY } = e.changedTouches[0],
                distance = pageY - this.startPageY;
            let { move } = this.state, ys = Math.abs(move % itemHeight), currentIndex = 0;
            if (move > 0) {
                currentIndex = 0;
            } else if (move <= (dataSource.length - 1) * -itemHeight) {
                currentIndex = dataSource.length - 1;
            } else if (ys !== 0 && distance !== 0) {
                const _move = parseInt(Math.abs(move) / itemHeight);
                if (ys >= itemHeight / 2) {
                    currentIndex = _move + 1;
                } else {
                    currentIndex = _move;
                }
            }
            this.currentPageY = currentIndex * -itemHeight;
            onChange(dataSource[currentIndex]);
            this.setState({ move: currentIndex * -itemHeight });
        }
    }
    componentDidMount() {
        const { dataSource } = this.props;
        if (dataSource.length) {
            const { value, onChange } = this.props;
            if (value.id || value.id === 0) {
                const { itemHeight } = this.props,
                    index = dataSource.findIndex(item => item.id === value.id),
                    current = index > -1 ? index : 0,
                    move = current * -itemHeight;
                this.setState({ move });
                this.currentPageY = move;
                onChange(dataSource[current])
            } else
                onChange(dataSource[0])
        }
    }
    render() {
        const { move } = this.state, { dataSource, renderItem, height, itemHeight } = this.props;
        return (<ul className={styles.wrapper}>
            <li onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd} style={{ height }}>
                <div className={styles.mask} style={{ backgroundSize: `100% ${(height - itemHeight) / 2}px` }} />
                <div className={styles.indicator} style={{ height: itemHeight, top: (height - itemHeight) / 2 }} />
                <ul className={styles.content} style={{ transform: `translate3d(0px, ${move}px, 0px)`, paddingTop: (height - itemHeight) / 2 }}>
                    {dataSource.map((item, index) => (<li key={index}>{renderItem(item, index)}</li>))}
                </ul>
            </li>
        </ul>)
    }
}