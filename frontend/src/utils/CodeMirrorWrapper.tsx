import React, { ReactElement } from 'react';
import { Editor, EditorChange, EditorConfiguration } from 'codemirror';
import { Controlled } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';

interface Props {
  className: string;
  value: string;
  onChange: (newValue: string) => void;
  onBlur: () => void;
  options?: EditorConfiguration;
}

// OK, so here's the deal. codemirror itself is not written with React in mind,
// and someone wrote a React wrapper for it. That wrapper turned out to be utter
// shit. If you hand it an event listener, e.g. onBlur, it will hold onto that
// listener for-fucking-ever. Even if the component is rendered with different
// props, it will always call the listener you handed it the first time. Hence
// we need to wrap it yet once again to get around that.
export class CodeMirror extends React.Component<Props> {
  render(): ReactElement {
    const { className, value, options } = this.props;
    return (
      <Controlled
        className={className}
        value={value}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
          lineWrapping: true,
          ...options,
        }}
        onBeforeChange={this.onChange.bind(this)}
        onBlur={this.onBlur.bind(this)}
      />
    );
  }

  private onChange(editor: Editor, data: EditorChange, value: string) {
    this.props.onChange(value);
  }

  private onBlur(editor: Editor, evt: any) {
    this.props.onBlur();
  }
}
