import {componentDriver} from 'react-component-driver';

import {QuizApp, Answer, Quiz, Question} from './component';


const answerDriver = componentDriver(Answer, {
  getText() {
    return this.getComponent().children[0];
  },
  isSelected() {
    return this.getComponent().props.className === 'is-selected';
  },
});

function quizApp(quiz) {
  return componentDriver(QuizApp, {
    getQuestion() {
      return this.getByID('quizapp.question').children[0];
    },
    getChoices() {
      return this.filterByID(/^quizapp.answer-\d+$/).map((node) =>
        answerDriver().attachTo(node),
      );
    },
    getAnswers() {
      return this.getChoices().map((choice) => choice.getText());
    },
    clickNext() {
      this.getByID('quizapp.next').props.onClick();
      return this;
    },
    selectAnswer(id) {
      this.getByID('quizapp.answer-' + id).props.onClick();
      return this;
    },
    getSelectedAnswer() {
      return this.getChoices()
        .find((choice) => choice.isSelected())
        .getText();
    },
    getScore() {
      return this.getByID('quizapp.score').children.join('');
    }
  })().withProps({quiz});
}

describe('Question', () => {
  it('defaults to empty text', () => {
    expect(Question().text).toEqual('');
  });

  it('returns given text', () => {
    expect(Question('Eh?').text).toEqual('Eh?');
  });

  it('defaults to empty list of answers', () => {
    expect(Question().answers).toEqual([]);
  });

  it('returns given answers', () => {
    expect(Question('', [1, 2, 3]).answers).toEqual([1, 2, 3]);
  });

  it('defaults to first answer as correct', () => {
    expect(Question('', [1, 2, 3]).correctAnswer).toEqual(1);
  });

  it('returns correct answer by given correct answer index', () => {
    expect(Question('', [1, 2, 3], 1).correctAnswer).toEqual(2);
  });
});

describe('Quiz', () => {
  it('should start with first question', () => {
    const quiz = Quiz([Question('How are you?')]);
    expect(quiz.getQuestion()).toEqual('How are you?');
  });

  it('should advance quiz to next question', () => {
    const quiz = Quiz([Question('How are you?'), Question("How's life?")]);
    expect(quiz.advance().getQuestion()).toEqual("How's life?");
  });

  it('should have no selected answer by default', () => {
    const quiz = Quiz([Question('How are you?', ['Good', 'Bad'])]);
    expect(quiz.getSelectedAnswer()).toBeUndefined();
  });

  it('should select answer', () => {
    const quiz = Quiz([Question('How are you?', ['Good', 'Bad'])]);
    expect(quiz.selectAnswer(1).getSelectedAnswer()).toEqual('Bad');
  });

  describe('When Done', () => {
    let quiz;

    beforeEach(() => {
      quiz = Quiz([Question('How are you?')]).advance();
    });

    it('should indicate that quiz is over after advancing past last question', () => {
      expect(quiz.isDone()).toEqual(true);
    });

    it('should return undefined for question text and answers', () => {
      expect(quiz.getQuestion()).toBeUndefined();
      expect(quiz.getAnswers()).toBeUndefined();
    });
  });

  describe('Score', () => {
    it('is undefined for empty quiz', () => {
      expect(Quiz().getScore()).toBeUndefined();
    });

    it('is 0 for quiz with incorrect answer', () => {
      expect(Quiz([Question('A', ['a', 'b'])]).selectAnswer(1).getScore()).toEqual(0);
    });

    it('is 100 for quiz with one question and correct answer', () => {
      expect(Quiz([Question('A', ['a'])]).selectAnswer(0).getScore()).toEqual(100);
    });

    it('is 50 for quiz with one correct and one incorrect answers', () => {
      const quiz = Quiz([Question('A', ['a', 'b'], 0), Question('B', ['a', 'b'], 1)]);
      expect(quiz.selectAnswer(0).advance().selectAnswer(0).advance().getScore()).toEqual(50);
    });
  });
});

describe('QuizApp', () => {
  it('should render first question', () => {
    const question = Math.random().toString();
    expect(quizApp(Quiz([Question(question)])).getQuestion()).toEqual(question);
  });

  it('should render answer choices', () => {
    expect(quizApp(Quiz([Question('', ['a', 'b', 'c'])])).getAnswers()).toEqual(
      ['a', 'b', 'c'],
    );
  });

  it('should advance to next question on "Next" click', () => {
    const quiz = Quiz([Question('A'), Question('B')]);
    expect(
      quizApp(quiz)
        .clickNext()
        .getQuestion(),
    ).toEqual('B');
  });

  it('should allow to choose an answer', () => {
    const quiz = Quiz([Question('A', ['a', 'b'])]);
    expect(
      quizApp(quiz)
        .selectAnswer(1)
        .getSelectedAnswer(),
    ).toEqual('b');
  });

  it('should report score when done', () => {
    const quiz = Quiz([Question('A', ['a', 'b'], 1)]);
    expect(
      quizApp(quiz).selectAnswer(1).clickNext().getScore()
    ).toEqual('100%');
  });
});
