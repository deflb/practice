import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import styles from './index.less';

class CustomEditor extends Component {
    componentDidMount() {
        const eles = document.querySelectorAll('[contenteditable=true]');
        eles.forEach(ele => {
            ele.setAttribute('class', `${ele.getAttribute('class')} needsclick`);
        })
        if (this.props.autoFocus)
            this.editor.focus()
    }
    render() {
        const { value, onChange, placeholder } = this.props;
        return (<div className={styles.wrapper}>
            <div className={styles.container}>
                <Editor
                    ref={instance => this.editor = instance}
                    placeholder={placeholder}
                    editorState={value}
                    onChange={onChange} />
            </div>
        </div>)
    }
}

CustomEditor.toHTML = (editorState) => convertToHTML(editorState.getCurrentContent());
CustomEditor.createEditorState = (html) => EditorState.createWithContent(convertFromHTML(html));

export default CustomEditor;