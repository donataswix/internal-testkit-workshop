import React from 'react';

export class Answer extends React.PureComponent {
  render() {
    const {id, text, onSelect, isSelected} = this.props;
    return (
      <li
        className={isSelected ? 'is-selected' : undefined}
        onClick={() => onSelect(id)}
        data-test-id={'quizapp.answer-' + id}
      >
        {text}
      </li>
    );
  }
}

export class QuizComponent extends React.PureComponent {
  render() {
    const {quiz} = this.props;
    return (
      <div>
        <div data-test-id="quizapp.question">{quiz.getQuestion()}</div>
        <ul>
          {quiz.getAnswers().map((answer, i) => (
            <Answer
              isSelected={answer === quiz.getSelectedAnswer()}
              onSelect={this.props.onSelectAnswer}
              key={i}
              id={i}
              text={answer}
            />
          ))}
        </ul>
        <button data-test-id="quizapp.next" onClick={this.props.onNext}>
          Next
        </button>
      </div>
    );
  }
}

export class QuizApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.state = {
      quiz: this.props.quiz,
    };
  }

  next() {
    this.setState({
      quiz: this.state.quiz.advance(),
    });
  }

  selectAnswer(index) {
    this.setState({
      quiz: this.state.quiz.selectAnswer(index),
    });
  }

  render() {
    const {quiz} = this.state;
    if (quiz.isDone()) {
      return <div>Your score is <span data-test-id="quizapp.score">{quiz.getScore()}%</span></div>;
    } else {
      return <QuizComponent quiz={this.state.quiz} onNext={this.next} onSelectAnswer={this.selectAnswer}/>;
    }
  }
}

export function Quiz(questions, current = 0, answers = []) {
  function isDone() {
    return current >= questions.length;
  }

  function getAnswers() {
    if (!isDone()) {
      return questions[current].answers;
    }
  }

  function getSelectedAnswer() {
    if (answers[current] >= 0) {
      return getAnswers()[answers[current]];
    }
  }

  function getCorrectAnswer() {
    return questions ? questions[current].correctAnswer : undefined;
  }

  function advance() {
    return Quiz(questions, current + 1, answers);
  }

  return {
    getQuestion() {
      if (!isDone()) {
        return questions[current].text;
      }
    },
    getAnswers,
    selectAnswer(index) {
      return Quiz(questions, current, {...answers, [current]: index});
    },
    advance,
    isDone,
    getSelectedAnswer,
    getScore() {
      if (questions) {
        const total = questions.length;
        let correct = 0;
        for (let i = 0; i < total; i++) {
          const question = questions[i];
          if (question.correctAnswer === question.answers[answers[i]]) {
            correct += 1;
          }
        }
        return (correct / total) * 100;
      }
    },
  };
}

export function Question(text = '', answers = [], correctIndex = 0) {
  return {
    get text() {
      return text;
    },
    get answers() {
      return answers;
    },
    get correctAnswer() {
      return answers[correctIndex];
    },
  };
}
