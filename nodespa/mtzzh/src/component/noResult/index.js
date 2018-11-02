import React from 'react';

export default ({ ...props }) => {
    const { message = '无结果' } = props;
    return <div className='normalFontSizeC shallowGreyColor' style={{ textAlign: 'center' }}>{message}</div>
}