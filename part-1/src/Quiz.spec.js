import React from 'react';
import {componentDriver} from 'react-component-driver';

function Question(text, choices = []) {
  return {
    text() {
      return text;
    },
    choices() {
      return choices;
    },
  };
}

function Quiz(questions, current = 0, answers = []) {
  return {
    advance() {
      return Quiz(questions, current + 1);
    },
    selectAnswer(id) {
      return Quiz(questions, current, {
        ...answers,
        [current]: id,
      });
    },
    getCurrentAnswer() {
      return questions[current].choices()[answers[current]];
    },
    getCurrentQuestion() {
      return questions[current].text();
    },
    getCurrentChoices() {
      return questions[current].choices();
    },
  };
}

function Choice({id, selected, text, onClick}) {
  return (
    <li
      onClick={onClick}
      className={selected ? 'selected' : undefined}
      data-test-id="quizapp.choice"
    >
      {text}
    </li>
  );
}

class QuizApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.state = {quiz: this.props.quiz};
  }

  next() {
    this.setState({
      quiz: this.state.quiz.advance(),
    });
  }

  selectAnswer(id) {
    this.setState({
      quiz: this.state.quiz.selectAnswer(id),
    });
  }

  render() {
    const {quiz} = this.state;
    if (quiz) {
      return (
        <div>
          <div data-test-id="quizapp.question">{quiz.getCurrentQuestion()}</div>
          <ul>
            {quiz.getCurrentChoices().map((choice, i) => (
              <Choice
                key={i}
                selected={quiz.getCurrentAnswer() === choice}
                id={i}
                onClick={() => this.selectAnswer(i)}
                text={choice}
              />
            ))}
          </ul>
          <button data-test-id="quizapp.next" onClick={this.next}>
            Next
          </button>
        </div>
      );
    }
    return null;
  }
}

const choiceDriver = componentDriver(Choice, {
  getText() {
    return this.getComponent().children[0];
  },
  click() {
    this.getComponent().props.onClick();
    return this;
  },
  isSelected() {
    return this.getComponent().props.className === 'selected';
  },
});

function quizApp(quiz) {
  const driver = componentDriver(QuizApp, {
    getQuestion() {
      return this.getByID('quizapp.question').children[0];
    },
    getChoices() {
      return this.filterByID('quizapp.choice').map((node) => choiceDriver().attachTo(node));
    },
    getChoiceTexts() {
      return this.getChoices().map((choice) => choice.getText());
    },
    clickNext() {
      this.getByID('quizapp.next').props.onClick();
      return this;
    },
    clickAnswer(text) {
      this.getChoices().forEach((choice) => {
        if (choice.getText() === text) {
          choice.click();
        }
      });
      return this;
    },
    getSelectedAnswer() {
      return this.getChoices().find((choice) => choice.isSelected()).getText();
    },
  });
  return driver().withProps({quiz});
}

describe('Quiz App', () => {
  it('renders first question', () => {
    const question = Math.random().toString();
    const quiz = Quiz([Question(question, [])]);
    expect(quizApp(quiz).getQuestion()).toEqual(question);
  });

  it('renders choices', () => {
    const question = Math.random().toString();
    const choices = [1, 2, 3].map(() => Math.random().toString());
    const quiz = Quiz([Question(question, choices)]);
    expect(quizApp(quiz).getChoiceTexts()).toEqual(choices);
  });

  it('allows to pick an answer', () => {
    const quiz = Quiz([Question('A', ['a', 'b'])]);
    expect(
      quizApp(quiz)
        .clickAnswer('b')
        .getSelectedAnswer(),
    ).toEqual('b');
  });

  it('can advance to next question', () => {
    const quiz = Quiz([Question('A'), Question('B')]);
    expect(
      quizApp(quiz)
        .clickNext()
        .getQuestion(),
    ).toEqual('B');
  });
});
