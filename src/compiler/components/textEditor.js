import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/twilight';
import 'brace/theme/xcode';
import AceEditor from 'react-ace';


const textEditor = (props) => (
  <div className='container'>
    <AceEditor
        mode={props.lan}
        theme={props.theme}
        onChange={props.onChange}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{
            $blockScrolling: true
        }}
        fontSize={32}
        height='80vh'
        width='100%'
    />
    <style jsx>{`
      .container {
        padding-top:25px;
      }
    `}</style>
  </div>
)

export default textEditor
