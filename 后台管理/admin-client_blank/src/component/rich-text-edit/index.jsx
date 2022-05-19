import React, { Component } from 'react'
import { EditorState, convertToRaw , ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import PropTypes from "prop-types"
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/**
 * 用来指定商品详情的富文本编辑器组件
 */
 class RichTextEdit extends Component {
   static propTypes = {
    html: PropTypes.string
   }
   constructor(props) {
    super(props);
    const { html } = this.props
    if(html) {
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }
   }
   // 输入过程中实时的回调c
   onEditorStateChange = (editorState) => {
     this.setState({
       editorState,
     });
   };
   getHtmlValue = () => {
    const { editorState } = this.state;
     return draftToHtml(convertToRaw(editorState.getCurrentContent()))
   }
   componentDidMount() {

   }
   render() {
     const { editorState } = this.state;
     return (
       <div>
         <Editor
           editorState={editorState}
           wrapperClassName="demo-wrapper"
           editorClassName="demo-editor"
           editorStyle={{border: '1px solid #999',minHeight: '200px',padding: '10px'}}
           onEditorStateChange={this.onEditorStateChange}
         />
       </div>
     );
   }
 }

 export default RichTextEdit