(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{558:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a,r=n(45),o=(a=r)&&a.__esModule?a:{default:a};t.getComponentLocale=function(e,t,n,a){var r={};if(t&&t.antLocale&&t.antLocale[n])r=t.antLocale[n];else{var l=a();r=l.default||l}var u=(0,o.default)({},r);e.locale&&(u=(0,o.default)({},u,e.locale),e.locale.lang&&(u.lang=(0,o.default)({},r.lang,e.locale.lang)));return u},t.getLocaleCode=function(e){var t=e.antLocale&&e.antLocale.locale;if(e.antLocale&&e.antLocale.exist&&!t)return"zh-cn";return t}},587:function(e,t,n){"use strict";n(229),n(527),n(695)},588:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=y(n(13)),r=y(n(45)),o=y(n(23)),l=y(n(24)),u=y(n(14)),i=y(n(25)),s=y(n(46)),c=y(n(1)),d=y(n(2)),f=y(n(531)),p=n(558),m=y(n(697)),b=y(n(701));function y(e){return e&&e.__esModule?e:{default:e}}var v=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(e);r<a.length;r++)t.indexOf(a[r])<0&&(n[a[r]]=e[a[r]])}return n};function h(){}function C(e){return"undefined"===typeof e||null===e?"":e+""}var k=function(e){function t(e){(0,o.default)(this,t);var n=(0,u.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onInputChange=function(e){var t=e.target.value,a=t;switch(n.props.type){case"bankCard":a=t.replace(/\D/g,"").replace(/(....)(?=.)/g,"$1 ");break;case"phone":var r=(a=t.replace(/\D/g,"").substring(0,11)).length;r>3&&r<8?a=a.substr(0,3)+" "+a.substr(3):r>=8&&(a=a.substr(0,3)+" "+a.substr(3,4)+" "+a.substr(7));break;case"number":a=t.replace(/\D/g,"")}n.handleOnChange(a,a!==t)},n.handleOnChange=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=n.props.onChange;"value"in n.props?n.setState({value:n.props.value}):n.setState({value:e}),a&&(t?setTimeout(function(){return a(e)}):a(e))},n.onInputFocus=function(e){n.debounceTimeout&&(clearTimeout(n.debounceTimeout),n.debounceTimeout=null),n.setState({focus:!0}),n.props.onFocus&&n.props.onFocus(e)},n.onInputBlur=function(e){n.inputRef&&(n.debounceTimeout=window.setTimeout(function(){document.activeElement!==(n.inputRef&&n.inputRef.inputRef)&&n.setState({focus:!1})},200)),n.props.onBlur&&n.props.onBlur(e)},n.clearInput=function(){"password"!==n.props.type&&n.props.updatePlaceholder&&n.setState({placeholder:n.props.value}),n.setState({value:""}),n.props.onChange&&n.props.onChange(""),n.focus()},n.focus=function(){n.inputRef&&n.inputRef.focus()},n.state={placeholder:e.placeholder,value:C(e.value||e.defaultValue)},n}return(0,i.default)(t,e),(0,l.default)(t,[{key:"componentWillReceiveProps",value:function(e){"placeholder"in e&&!e.updatePlaceholder&&this.setState({placeholder:e.placeholder}),"value"in e&&this.setState({value:e.value})}},{key:"componentWillUnmount",value:function(){this.debounceTimeout&&(window.clearTimeout(this.debounceTimeout),this.debounceTimeout=null)}},{key:"render",value:function(){var e,t,o=this,l=(0,r.default)({},this.props);delete l.updatePlaceholder;var u=l.prefixCls,i=l.prefixListCls,c=l.editable,y=l.style,h=l.clear,k=l.children,g=l.error,K=l.className,x=l.extra,P=l.labelNumber,_=l.type,I=l.onExtraClick,O=l.onErrorClick,L=l.moneyKeyboardAlign,E=l.moneyKeyboardWrapProps,w=l.moneyKeyboardHeader,N=l.onVirtualKeyboardConfirm,B=v(l,["prefixCls","prefixListCls","editable","style","clear","children","error","className","extra","labelNumber","type","onExtraClick","onErrorClick","moneyKeyboardAlign","moneyKeyboardWrapProps","moneyKeyboardHeader","onVirtualKeyboardConfirm"]),j=B.name,S=B.disabled,F=B.maxLength,R=this.state.value,M=(0,p.getComponentLocale)(this.props,this.context,"InputItem",function(){return n(702)}),T=M.confirmLabel,A=M.backspaceLabel,D=M.cancelKeyboardLabel,W=this.state,V=W.focus,H=W.placeholder,U=(0,s.default)(i+"-item",u+"-item",i+"-item-middle",K,(e={},(0,a.default)(e,u+"-disabled",S),(0,a.default)(e,u+"-error",g),(0,a.default)(e,u+"-focus",V),(0,a.default)(e,u+"-android",V),e)),J=(0,s.default)(u+"-label",(t={},(0,a.default)(t,u+"-label-2",2===P),(0,a.default)(t,u+"-label-3",3===P),(0,a.default)(t,u+"-label-4",4===P),(0,a.default)(t,u+"-label-5",5===P),(0,a.default)(t,u+"-label-6",6===P),(0,a.default)(t,u+"-label-7",7===P),t)),q=u+"-control",z="text";"bankCard"===_||"phone"===_?z="tel":"password"===_?z="password":"digit"===_?z="number":"text"!==_&&"number"!==_&&(z=_);var $=void 0;"number"===_&&($={pattern:"[0-9]*"});var G=void 0;return"digit"===_&&(G={className:"h5numInput"}),d.default.createElement("div",{className:U},d.default.createElement("div",{className:i+"-line"},k?d.default.createElement("div",{className:J},k):null,d.default.createElement("div",{className:q},"money"===_?d.default.createElement(m.default,{value:C(R),type:_,ref:function(e){return o.inputRef=e},maxLength:F,placeholder:H,onChange:this.onInputChange,onFocus:this.onInputFocus,onBlur:this.onInputBlur,onVirtualKeyboardConfirm:N,disabled:S,editable:c,prefixCls:u,style:y,confirmLabel:T,backspaceLabel:A,cancelKeyboardLabel:D,moneyKeyboardAlign:L,moneyKeyboardWrapProps:E,moneyKeyboardHeader:w}):d.default.createElement(b.default,(0,r.default)({},$,B,G,{value:C(R),defaultValue:void 0,ref:function(e){return o.inputRef=e},style:y,type:z,maxLength:F,name:j,placeholder:H,onChange:this.onInputChange,onFocus:this.onInputFocus,onBlur:this.onInputBlur,readOnly:!c,disabled:S}))),h&&c&&!S&&R&&(""+R).length>0?d.default.createElement(f.default,{activeClassName:u+"-clear-active"},d.default.createElement("div",{className:u+"-clear",onClick:this.clearInput})):null,g?d.default.createElement("div",{className:u+"-error-extra",onClick:O}):null,""!==x?d.default.createElement("div",{className:u+"-extra",onClick:I},x):null))}}]),t}(d.default.Component);k.defaultProps={prefixCls:"am-input",prefixListCls:"am-list",type:"text",editable:!0,disabled:!1,placeholder:"",clear:!1,onChange:h,onBlur:h,onFocus:h,extra:"",onExtraClick:h,error:!1,onErrorClick:h,onVirtualKeyboardConfirm:h,labelNumber:5,updatePlaceholder:!1,moneyKeyboardAlign:"right",moneyKeyboardWrapProps:{},moneyKeyboardHeader:null},k.contextTypes={antLocale:c.default.object},t.default=k,e.exports=t.default},695:function(e,t,n){},697:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=m(n(23)),r=m(n(24)),o=m(n(14)),l=m(n(25)),u=m(n(46)),i=m(n(2)),s=m(n(33)),c=n(698),d=m(n(699)),f=m(n(700)),p=n(580);function m(e){return e&&e.__esModule?e:{default:e}}var b=[],y=null,v=!!s.default.createPortal,h=function(e){function t(e){(0,a.default)(this,t);var n=(0,o.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onChange=function(e){"value"in n.props||n.setState({value:e.target.value}),n.props.onChange(e)},n.onConfirm=function(e){n.props.onVirtualKeyboardConfirm(e)},n.addBlurListener=function(){document.addEventListener("click",n.doBlur,!1)},n.removeBlurListener=function(){document.removeEventListener("click",n.doBlur,!1)},n.saveRef=function(e){v&&e&&(y=e,b.push({el:e,container:n.container}))},n.doBlur=function(e){var t=n.state.value;e.target!==n.inputRef&&n.onInputBlur(t)},n.removeCurrentExtraKeyboard=function(){b=b.filter(function(e){var t=e.el,n=e.container;return t&&n&&t!==y&&n.parentNode.removeChild(n),t===y})},n.unLinkInput=function(){y&&y.antmKeyboard&&y.linkedInput&&y.linkedInput===n&&(y.linkedInput=null,(0,c.addClass)(y.antmKeyboard,n.props.keyboardPrefixCls+"-wrapper-hide")),n.removeBlurListener(),v&&n.removeCurrentExtraKeyboard()},n.onInputBlur=function(e){n.state.focus&&(n.setState({focus:!1}),n.props.onBlur(e),setTimeout(function(){n.unLinkInput()},50))},n.onInputFocus=function(){var e=n.state.value;n.props.onFocus(e),n.setState({focus:!0},function(){y&&(y.linkedInput=n,y.antmKeyboard&&(0,c.removeClass)(y.antmKeyboard,n.props.keyboardPrefixCls+"-wrapper-hide"),y.confirmDisabled=""===e,y.confirmKeyboardItem&&(""===e?(0,c.addClass)(y.confirmKeyboardItem,n.props.keyboardPrefixCls+"-item-disabled"):(0,c.removeClass)(y.confirmKeyboardItem,n.props.keyboardPrefixCls+"-item-disabled")))})},n.onKeyboardClick=function(e){var t=n.props.maxLength,a=n.state.value,r=n.onChange,o=void 0;"delete"===e?r({target:{value:o=a.substring(0,a.length-1)}}):"confirm"===e?(r({target:{value:o=a}}),n.onInputBlur(a),n.onConfirm(a)):"hide"===e?(o=a,n.onInputBlur(o)):r(void 0!==t&&+t>=0&&(a+e).length>t?{target:{value:o=(a+e).substr(0,t)}}:{target:{value:o=a+e}}),y&&(y.confirmDisabled=""===o,y.confirmKeyboardItem&&(""===o?(0,c.addClass)(y.confirmKeyboardItem,n.props.keyboardPrefixCls+"-item-disabled"):(0,c.removeClass)(y.confirmKeyboardItem,n.props.keyboardPrefixCls+"-item-disabled")))},n.onFakeInputClick=function(){n.focus()},n.focus=function(){n.removeBlurListener(),n.state.focus||n.onInputFocus(),setTimeout(function(){n.addBlurListener()},50)},n.state={focus:!1,value:e.value||""},n}return(0,l.default)(t,e),(0,r.default)(t,[{key:"componentWillReceiveProps",value:function(e){"value"in e&&this.setState({value:e.value})}},{key:"componentDidUpdate",value:function(){this.renderCustomKeyboard()}},{key:"componentWillUnmount",value:function(){this.state.focus&&this.props.onBlur(this.state.value),this.unLinkInput()}},{key:"getComponent",value:function(){var e=this.props,t=e.confirmLabel,n=e.backspaceLabel,a=e.cancelKeyboardLabel,r=e.keyboardPrefixCls,o=e.moneyKeyboardWrapProps,l=e.moneyKeyboardHeader;return i.default.createElement(d.default,{ref:this.saveRef,onClick:this.onKeyboardClick,prefixCls:r,confirmLabel:t,backspaceLabel:n,cancelKeyboardLabel:a,wrapProps:o,header:l})}},{key:"getContainer",value:function(){var e=this.props.keyboardPrefixCls;if(v){if(!this.container){var t=document.createElement("div");t.setAttribute("id",e+"-container-"+(new Date).getTime()),document.body.appendChild(t),this.container=t}}else{var n=document.querySelector("#"+e+"-container");n||((n=document.createElement("div")).setAttribute("id",e+"-container"),document.body.appendChild(n)),this.container=n}return this.container}},{key:"renderCustomKeyboard",value:function(){v||(y=s.default.unstable_renderSubtreeIntoContainer(this,this.getComponent(),this.getContainer()))}},{key:"renderPortal",value:function(){var e=this;return v&&p.canUseDOM?i.default.createElement(f.default,{getContainer:function(){return e.getContainer()}},this.getComponent()):null}},{key:"render",value:function(){var e=this,t=this.props,n=t.placeholder,a=t.disabled,r=t.editable,o=t.moneyKeyboardAlign,l=this.state,s=l.focus,c=l.value,d=a||!r,f=(0,u.default)("fake-input",{focus:s,"fake-input-disabled":a}),p=(0,u.default)("fake-input-container",{"fake-input-container-left":"left"===o});return i.default.createElement("div",{className:p},""===c&&i.default.createElement("div",{className:"fake-input-placeholder"},n),i.default.createElement("div",{role:"textbox","aria-label":c||n,className:f,ref:function(t){return e.inputRef=t},onClick:d?function(){}:this.onFakeInputClick},c),this.renderPortal())}}]),t}(i.default.Component);h.defaultProps={onChange:function(){},onFocus:function(){},onBlur:function(){},onVirtualKeyboardConfirm:function(){},placeholder:"",disabled:!1,editable:!0,prefixCls:"am-input",keyboardPrefixCls:"am-number-keyboard"},t.default=h,e.exports=t.default},698:function(e,t,n){"use strict";function a(e,t){return e.classList?e.classList.contains(t):(" "+e.className+" ").indexOf(" "+t+" ")>-1}Object.defineProperty(t,"__esModule",{value:!0}),t.hasClass=a,t.addClass=function(e,t){e.classList?e.classList.add(t):a(e,t)||(e.className=e.className+" "+t)},t.removeClass=function(e,t){if(e.classList)e.classList.remove(t);else if(a(e,t)){var n=e.className;e.className=(" "+n+" ").replace(" "+t+" ","")}}},699:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.KeyboardItem=void 0;var a=f(n(45)),r=f(n(23)),o=f(n(24)),l=f(n(14)),u=f(n(25)),i=f(n(46)),s=f(n(2)),c=f(n(531)),d=n(580);function f(e){return e&&e.__esModule?e:{default:e}}var p=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(e);r<a.length;r++)t.indexOf(a[r])<0&&(n[a[r]]=e[a[r]])}return n},m=t.KeyboardItem=function(e){function t(){return(0,r.default)(this,t),(0,l.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,u.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this.props,t=e.prefixCls,n=e.onClick,r=e.className,o=(e.disabled,e.children),l=e.tdRef,u=e.label,d=e.iconOnly,f=p(e,["prefixCls","onClick","className","disabled","children","tdRef","label","iconOnly"]),m=o;"keyboard-delete"===r?m="delete":"keyboard-hide"===r?m="hide":"keyboard-confirm"===r&&(m="confirm");var b=(0,i.default)(t+"-item",r);return s.default.createElement(c.default,{activeClassName:t+"-item-active"},s.default.createElement("td",(0,a.default)({ref:l,onClick:function(e){n(e,m)},className:b},f),o,d&&s.default.createElement("i",{className:"sr-only"},u)))}}]),t}(s.default.Component);m.defaultProps={prefixCls:"am-number-keyboard",onClick:function(){},disabled:!1};var b=function(e){function t(){(0,r.default)(this,t);var e=(0,l.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.onKeyboardClick=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if(t.nativeEvent.stopImmediatePropagation(),"confirm"===n&&e.confirmDisabled)return null;e.linkedInput&&e.linkedInput.onKeyboardClick(n)},e.renderKeyboardItem=function(t,n){return s.default.createElement(m,{onClick:e.onKeyboardClick,key:"item-"+t+"-"+n},t)},e}return(0,u.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this,t=this.props,n=t.prefixCls,r=t.confirmLabel,o=t.backspaceLabel,l=t.cancelKeyboardLabel,u=t.wrapProps,c=t.header,d=(0,i.default)(n+"-wrapper",n+"-wrapper-hide");return s.default.createElement("div",(0,a.default)({className:d,ref:function(t){return e.antmKeyboard=t}},u),c&&s.default.cloneElement(c,{onClick:this.onKeyboardClick}),s.default.createElement("table",null,s.default.createElement("tbody",null,s.default.createElement("tr",null,["1","2","3"].map(function(t,n){return e.renderKeyboardItem(t,n)}),s.default.createElement(m,(0,a.default)({className:"keyboard-delete",rowSpan:2,onClick:this.onKeyboardClick},this.getAriaAttr(o)))),s.default.createElement("tr",null,["4","5","6"].map(function(t,n){return e.renderKeyboardItem(t,n)})),s.default.createElement("tr",null,["7","8","9"].map(function(t,n){return e.renderKeyboardItem(t,n)}),s.default.createElement(m,{className:"keyboard-confirm",rowSpan:2,onClick:this.onKeyboardClick,tdRef:function(t){return e.confirmKeyboardItem=t}},r)),s.default.createElement("tr",null,[".","0"].map(function(t,n){return e.renderKeyboardItem(t,n)}),s.default.createElement(m,(0,a.default)({className:"keyboard-hide",onClick:this.onKeyboardClick},this.getAriaAttr(l)))))))}},{key:"getAriaAttr",value:function(e){return d.IS_IOS?{label:e,iconOnly:!0}:{role:"button","aria-label":e}}}]),t}(s.default.Component);b.defaultProps={prefixCls:"am-number-keyboard"},t.default=b},700:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i(n(23)),r=i(n(24)),o=i(n(14)),l=i(n(25)),u=i(n(2));function i(e){return e&&e.__esModule?e:{default:e}}var s=i(n(33)).default.createPortal,c=function(e){function t(e){(0,a.default)(this,t);var n=(0,o.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.container=n.props.getContainer(),n}return(0,l.default)(t,e),(0,r.default)(t,[{key:"render",value:function(){return this.props.children?s(this.props.children,this.container):null}}]),t}(u.default.Component);t.default=c,e.exports=t.default},701:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s(n(45)),r=s(n(23)),o=s(n(24)),l=s(n(14)),u=s(n(25)),i=s(n(2));function s(e){return e&&e.__esModule?e:{default:e}}var c=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(a=Object.getOwnPropertySymbols(e);r<a.length;r++)t.indexOf(a[r])<0&&(n[a[r]]=e[a[r]])}return n},d=function(e){function t(){(0,r.default)(this,t);var e=(0,l.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.onInputBlur=function(t){var n=t.target.value;e.props.onBlur&&e.props.onBlur(n)},e.onInputFocus=function(t){var n=t.target.value;e.props.onFocus&&e.props.onFocus(n)},e.focus=function(){e.inputRef&&e.inputRef.focus()},e}return(0,u.default)(t,e),(0,o.default)(t,[{key:"render",value:function(){var e=this,t=this.props,n=(t.onBlur,t.onFocus,c(t,["onBlur","onFocus"]));return i.default.createElement("input",(0,a.default)({ref:function(t){return e.inputRef=t},onBlur:this.onInputBlur,onFocus:this.onInputFocus},n))}}]),t}(i.default.Component);t.default=d,e.exports=t.default},702:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={confirmLabel:"\u786e\u5b9a",backspaceLabel:"\u9000\u683c",cancelKeyboardLabel:"\u6536\u8d77\u952e\u76d8"},e.exports=t.default}}]);
//# sourceMappingURL=3.ef6025c5.chunk.js.map