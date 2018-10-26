import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd-mobile';
const dotStyle = {
    width: '24px', height: '4px', borderRadius: 'unset'
}

export default class detailCarousel extends Component {
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
            className='carousel_common'
        >
            {source.map(val => (
                <span
                    key={val}
                    className='carousel_common_item'
                >
                    <img
                        src={val}
                        alt=""
                        onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                        }}
                    />
                </span>
            ))}
        </Carousel>
    }
}