import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichEditor extends Component {
  constructor(props) {
    super(props)
    const { value } = this.props
    if(value){
      const contentBlock = htmlToDraft(value)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    }else{
      this.state = {
        editorState:EditorState.createEmpty()
      };
    }
   
    
    // this.state = {
    //   editorState: value?EditorState.create(<p>sss</p>):EditorState.createEmpty()
    // }
    
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
    const { onChange } = this.props;
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };
  render() {
    const {editorState} = this.state
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorStyle={{ border: '1px solid black', minHeight: "100px", paddingLeft: "10px" }}
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}  