import React from 'react';
import { isIOS } from '../../utlis';

export default ({ children }) => isIOS() ?
    (<div style={{ minHeight: 'calc(100% + 1px)' }}>{children}</div>)
    : children;