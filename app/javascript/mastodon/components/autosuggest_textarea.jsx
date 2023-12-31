import PropTypes from 'prop-types';
import{useCallback, useState} from 'react';//追加

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import Textarea from 'react-textarea-autosize';

import AutosuggestAccountContainer from '../features/compose/containers/autosuggest_account_container';

import AutosuggestEmoji from './autosuggest_emoji';
import { AutosuggestHashtag } from './autosuggest_hashtag';


const textAtCursorMatchesToken = (str, caretPosition) => {
  let word;

  let left  = str.slice(0, caretPosition).search(/\S+$/);
  let right = str.slice(caretPosition).search(/\s/);

  if (right < 0) {
    word = str.slice(left);
  } else {
    word = str.slice(left, right + caretPosition);
  }

  if (!word || word.trim().length < 3 || ['@', ':', '#'].indexOf(word[0]) === -1) {
    return [null, null];
  }

  word = word.trim().toLowerCase();

  if (word.length > 0) {
    return [left + 1, word];
  } else {
    return [null, null];
  }
};

export default class AutosuggestTextarea extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionsClearRequested: PropTypes.func.isRequired,
    onSuggestionsFetchRequested: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onPaste: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    lang: PropTypes.string,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    //setLink: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: true,
  };

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
    selectedText: "",//追加
    burryingtext: "",//追加
    burriedlink: "",//追加
    burryingtextStart: 0,//追加
    burryingtextEnd: 0,//追加
    selectionStart: 0,//追加
    selectionEnd: 0,//追加
    BoxsuggestionsHidden: true,
    Boxfocused: false,
    BoxselectedSuggestion: 0,
    BoxlastToken: null,
    BoxtokenStart: 0,
  };

  onChange = (e) => {
    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e);
  };

  onKeyDown = (e) => {
    const { suggestions, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;

    if (disabled) {
      e.preventDefault();
      return;
    }

    if (e.which === 229 || e.isComposing) {
      // Ignore key events during text composition
      // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
      return;
    }

    switch(e.key) {
    case 'Escape':
      if (suggestions.size === 0 || suggestionsHidden) {
        document.querySelector('.ui').parentElement.focus();
      } else {
        e.preventDefault();
        this.setState({ suggestionsHidden: true });
      }

      break;
    case 'ArrowDown':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
      }

      break;
    case 'ArrowUp':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
      }

      break;
    case 'Enter':
    case 'Tab':
      // Select suggestion
      if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
      }

      break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) {
      return;
    }

    this.props.onKeyDown(e);
  };

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });
  };

  onFocus = (e) => {
    this.setState({ focused: true });
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.textarea.focus();
  };

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  setTextarea = (c) => {
    this.textarea = c;
  };

  onPaste = (e) => {
    if (e.clipboardData && e.clipboardData.files.length === 1) {
      this.props.onPaste(e.clipboardData.files);
      e.preventDefault();
    }
  };

  onSelect = (e) => {//追加
    const selectedText = window.getSelection().toString();
    this.setState({ selectedText: selectedText });
    this.setState({ selectionStart: e.target.selectionStart });
    this.setState({ selectionEnd: e.target.selectionEnd });
  };

  onDeselect = () => {//追加
    this.setState({ selectedText: "" });
  };

  BoxonChange = (e) => {
    this.setState({burriedlink: e.target.value});
    const [ BoxtokenStart, Boxtoken ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart);

    if (Boxtoken !== null && this.state.lastToken !== Boxtoken) {
      this.setState({ lastToken: Boxtoken, selectedSuggestion: 0, BoxtokenStart });
      this.props.onSuggestionsFetchRequested(Boxtoken);
    } else if (Boxtoken === null) {
      this.setState({ BoxlastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.BoxonChange(e);
  };

  setLink = (text) => {
    //console.log(text);
    this.setState({ burryingtext: this.state.selectedText });
    this.setState({ burriedlink: text });
    this.setState({ selectedText: "" });
    this.setState({ burryingtextStart: this.state.selectionStart});
    this.setState({ burryingtextEnd: this.state.selectionEnd});
  };

  renderSuggestion = (suggestion, i) => {
    const { selectedSuggestion } = this.state;
    let inner, key;

    if (suggestion.type === 'emoji') {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key   = suggestion.id;
    } else if (suggestion.type === 'hashtag') {
      inner = <AutosuggestHashtag tag={suggestion} />;
      key   = suggestion.name;
    } else if (suggestion.type === 'account') {
      inner = <AutosuggestAccountContainer id={suggestion.id} />;
      key   = suggestion.id;
    }

    return (
      <div role='button' tabIndex={0} key={key} data-index={i} className={classNames('autosuggest-textarea__suggestions__item', { selected: i === selectedSuggestion })} onMouseDown={this.onSuggestionClick}>
        {inner}
      </div>
    );
  };

  render () {
    const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, lang, children } = this.props;
    const { suggestionsHidden } = this.state;

    return [
      <div className='compose-form__autosuggest-wrapper' key='autosuggest-wrapper'>
        {/* <div>
          <pre style={{ color: 'black' }}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
        </div> */}
        <div className='autosuggest-textarea'>
          <label>
            <span style={{ display: 'none' }}>{placeholder}</span>

            <Textarea
              ref={this.setTextarea}
              className='autosuggest-textarea__textarea'
              disabled={disabled}
              placeholder={placeholder}
              autoFocus={autoFocus}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              onSelect={this.onSelect} // 追加、選択時に呼び出す
              onDeselect={this.onDeselect} // 追加、選択解除時に呼び出す
              dir='auto'
              aria-autocomplete='list'
              lang={lang}
            />
          </label>
        </div>

        <div>
          {this.state.selectedText && ( // 選択テキストがある場合に表示
            <LinkInsertArea
              setLink={this.setLink}
            />
          )}
        </div>
        {children}
      </div>,

      <div className='autosuggest-textarea__suggestions-wrapper' key='suggestions-wrapper'>
        <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
          {suggestions.map(this.renderSuggestion)}
        </div>
      </div>,
    ];
  }

}

const LinkInsertArea = ({setLink}) => {//追加
  LinkInsertArea.propTypes = {
    setLink: PropTypes.func.isRequired
  };
  const [text, setText] = useState("");
  const ontextchange = useCallback((e)=>{
    setText(e.target.value);
  }, []);
  const onClick = useCallback(()=>{
    setLink(text);
  }, [text]);
  return (
    <div>
      <label>
        <input
          type='text'
          value={text}
          onChange={ontextchange}
          placeholder={"リンクを入力"}
        />
      </label>
      <button onClick={onClick}>完了</button>
    </div>
  );
};


// import PropTypes from 'prop-types';

// import classNames from 'classnames';

// import ImmutablePropTypes from 'react-immutable-proptypes';
// import ImmutablePureComponent from 'react-immutable-pure-component';

// import Textarea from 'react-textarea-autosize';

// import AutosuggestAccountContainer from '../features/compose/containers/autosuggest_account_container';

// import AutosuggestEmoji from './autosuggest_emoji';
// import { AutosuggestHashtag } from './autosuggest_hashtag';

// const textAtCursorMatchesToken = (str, caretPosition) => {
//   let word;

//   let left  = str.slice(0, caretPosition).search(/\S+$/);
//   let right = str.slice(caretPosition).search(/\s/);

//   if (right < 0) {
//     word = str.slice(left);
//   } else {
//     word = str.slice(left, right + caretPosition);
//   }

//   if (!word || word.trim().length < 3 || ['@', ':', '#'].indexOf(word[0]) === -1) {
//     return [null, null];
//   }

//   word = word.trim().toLowerCase();

//   if (word.length > 0) {
//     return [left + 1, word];
//   } else {
//     return [null, null];
//   }
// };

// export default class AutosuggestTextarea extends ImmutablePureComponent {

//   static propTypes = {
//     value: PropTypes.string,
//     suggestions: ImmutablePropTypes.list,
//     disabled: PropTypes.bool,
//     placeholder: PropTypes.string,
//     onSuggestionSelected: PropTypes.func.isRequired,
//     onSuggestionsClearRequested: PropTypes.func.isRequired,
//     onSuggestionsFetchRequested: PropTypes.func.isRequired,
//     onChange: PropTypes.func.isRequired,
//     onKeyUp: PropTypes.func,
//     onKeyDown: PropTypes.func,
//     onPaste: PropTypes.func.isRequired,
//     autoFocus: PropTypes.bool,
//     lang: PropTypes.string,
//   };

//   static defaultProps = {
//     autoFocus: true,
//   };

//   state = {
//     suggestionsHidden: true,
//     focused: false,
//     selectedSuggestion: 0,
//     lastToken: null,
//     tokenStart: 0,
//   };

//   onChange = (e) => {
//     const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart);

//     if (token !== null && this.state.lastToken !== token) {
//       this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
//       this.props.onSuggestionsFetchRequested(token);
//     } else if (token === null) {
//       this.setState({ lastToken: null });
//       this.props.onSuggestionsClearRequested();
//     }

//     this.props.onChange(e);
//   };

//   onKeyDown = (e) => {
//     const { suggestions, disabled } = this.props;
//     const { selectedSuggestion, suggestionsHidden } = this.state;

//     if (disabled) {
//       e.preventDefault();
//       return;
//     }

//     if (e.which === 229 || e.isComposing) {
//       // Ignore key events during text composition
//       // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
//       return;
//     }

//     switch(e.key) {
//     case 'Escape':
//       if (suggestions.size === 0 || suggestionsHidden) {
//         document.querySelector('.ui').parentElement.focus();
//       } else {
//         e.preventDefault();
//         this.setState({ suggestionsHidden: true });
//       }

//       break;
//     case 'ArrowDown':
//       if (suggestions.size > 0 && !suggestionsHidden) {
//         e.preventDefault();
//         this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
//       }

//       break;
//     case 'ArrowUp':
//       if (suggestions.size > 0 && !suggestionsHidden) {
//         e.preventDefault();
//         this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
//       }

//       break;
//     case 'Enter':
//     case 'Tab':
//       // Select suggestion
//       if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
//         e.preventDefault();
//         e.stopPropagation();
//         this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
//       }

//       break;
//     }

//     if (e.defaultPrevented || !this.props.onKeyDown) {
//       return;
//     }

//     this.props.onKeyDown(e);
//   };

//   onBlur = () => {
//     this.setState({ suggestionsHidden: true, focused: false });
//   };

//   onFocus = (e) => {
//     this.setState({ focused: true });
//     if (this.props.onFocus) {
//       this.props.onFocus(e);
//     }
//   };

//   onSuggestionClick = (e) => {
//     const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
//     e.preventDefault();
//     this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
//     this.textarea.focus();
//   };

//   UNSAFE_componentWillReceiveProps (nextProps) {
//     if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
//       this.setState({ suggestionsHidden: false });
//     }
//   }

//   setTextarea = (c) => {
//     this.textarea = c;
//   };

//   onPaste = (e) => {
//     if (e.clipboardData && e.clipboardData.files.length === 1) {
//       this.props.onPaste(e.clipboardData.files);
//       e.preventDefault();
//     }
//   };

//   renderSuggestion = (suggestion, i) => {
//     const { selectedSuggestion } = this.state;
//     let inner, key;

//     if (suggestion.type === 'emoji') {
//       inner = <AutosuggestEmoji emoji={suggestion} />;
//       key   = suggestion.id;
//     } else if (suggestion.type === 'hashtag') {
//       inner = <AutosuggestHashtag tag={suggestion} />;
//       key   = suggestion.name;
//     } else if (suggestion.type === 'account') {
//       inner = <AutosuggestAccountContainer id={suggestion.id} />;
//       key   = suggestion.id;
//     }

//     return (
//       <div role='button' tabIndex={0} key={key} data-index={i} className={classNames('autosuggest-textarea__suggestions__item', { selected: i === selectedSuggestion })} onMouseDown={this.onSuggestionClick}>
//         {inner}
//       </div>
//     );
//   };

//   render () {
//     const { value, suggestions, disabled, placeholder, onKeyUp, autoFocus, lang, children } = this.props;
//     const { suggestionsHidden } = this.state;

//     return [
//       <div className='compose-form__autosuggest-wrapper' key='autosuggest-wrapper'>
//         <div className='autosuggest-textarea'>
//           <label>
//             <span style={{ display: 'none' }}>{placeholder}</span>

//             <Textarea
//               ref={this.setTextarea}
//               className='autosuggest-textarea__textarea'
//               disabled={disabled}
//               placeholder={placeholder}
//               autoFocus={autoFocus}
//               value={value}
//               onChange={this.onChange}
//               onKeyDown={this.onKeyDown}
//               onKeyUp={onKeyUp}
//               onFocus={this.onFocus}
//               onBlur={this.onBlur}
//               onPaste={this.onPaste}
//               dir='auto'
//               aria-autocomplete='list'
//               lang={lang}
//             />
//           </label>
//         </div>
//         {children}
//       </div>,

//       <div className='autosuggest-textarea__suggestions-wrapper' key='suggestions-wrapper'>
//         <div className={`autosuggest-textarea__suggestions ${suggestionsHidden || suggestions.isEmpty() ? '' : 'autosuggest-textarea__suggestions--visible'}`}>
//           {suggestions.map(this.renderSuggestion)}
//         </div>
//       </div>,
//     ];
//   }

// }
