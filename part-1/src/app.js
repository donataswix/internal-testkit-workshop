import React from 'react';
import ReactDOM from 'react-dom';

import {QuizApp, Quiz, Question} from './component';

const quiz = Quiz([
  Question('How are you?', ['Bad', 'I will live...', 'How are you?'], 2),
  Question('Does it hurt when you pi?', ['ε', 'π', 'σ'], 1),
  Question('Choose one', ['Java', 'Script', 'Type'], 3),
]);

ReactDOM.render(<QuizApp quiz={quiz} />, document.getElementById('app'));
