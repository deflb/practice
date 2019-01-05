import React from 'react';
import { isIOS } from '../../utlis';

export default ({ children }) => (<div style={{ minHeight: isIOS() ? 'calc(100% + 1px)' : null }}>{children}</div>)