import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd-mobile';
import whichImgLink from '../../utlis/whichImgLink';
import styles from './index.less';
const dotStyle = {
    width: '24px', height: '4px', borderRadius: 'unset'
}

export default class customCarousel extends Component {
    static propTypes = {
        source: PropTypes.array,
    }
    static defaultProps = {
        source: []
    }
    render() {
        const { source } = this.props;
        return <Carousel
            autoplay={false}
            infinite
            dotStyle={dotStyle}
            dotActiveStyle={dotStyle}
            className={styles.wrapper}
        >
            {source.map((item, index) => (
                <div
                    key={index}
                    className={styles.wrapper_item}
                >
                    {item ? <img
                        src={whichImgLink(item)}
                        alt=""
                        onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                        }}
                    /> : null}
                </div>
            ))}
        </Carousel>
    }
}