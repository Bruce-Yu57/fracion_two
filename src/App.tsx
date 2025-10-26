
import React, { useState, useCallback } from 'react';
import { Question, UserAnswer, LevelInfo, CheckState } from './types';
import { LEVELS } from './constants';
import { generateProblemsForLevel } from './questionGenerator';
import MathRenderer from './MathRenderer';
import FractionInput from './FractionInput';
import Scratchpad from './Scratchpad';


const App: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<LevelInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [checkStates, setCheckStates] = useState<CheckState[]>([]);

  const startPractice = useCallback((level: LevelInfo) => {
    setSelectedLevel(level);
    
    const newQuestions = generateProblemsForLevel(level);
    
    setQuestions(newQuestions);
    setUserAnswers(new Array(newQuestions.length).fill(null));
    setCheckStates(new Array(newQuestions.length).fill(CheckState.UNCHECKED));
  }, []);
  
  const handleAnswerChange = (index: number, value: UserAnswer) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
    setCheckStates(prev => {
        const newStates = [...prev];
        newStates[index] = CheckState.UNCHECKED;
        return newStates;
    });
  };

  const checkAnswers = () => {
    const newCheckStates = questions.map((q, i) => {
      const userAnswer = userAnswers[i];
      if (!userAnswer || typeof userAnswer.numerator !== 'number' || typeof userAnswer.denominator !== 'number' || userAnswer.denominator === 0) {
        return CheckState.INCORRECT;
      }
      
      const isCorrect = q.answer.numerator * userAnswer.denominator === userAnswer.numerator * q.answer.denominator;
      return isCorrect ? CheckState.CORRECT : CheckState.INCORRECT;
    });
    setCheckStates(newCheckStates);
  };
  
  const resetPractice = () => {
    setSelectedLevel(null);
    setQuestions([]);
    setUserAnswers([]);
    setCheckStates([]);
  };

  const getFeedbackStyles = (state: CheckState) => {
    switch(state) {
      case CheckState.CORRECT:
        return 'border-emerald-500 bg-emerald-50';
      case CheckState.INCORRECT:
        return 'border-red-500 bg-red-50';
      default:
        return 'border-slate-200 bg-white';
    }
  };
  
  const getFeedbackIcon = (state: CheckState) => {
    switch(state) {
      case CheckState.CORRECT:
        return <span className="text-emerald-500 text-3xl">✔</span>;
      case CheckState.INCORRECT:
        return <span className="text-red-500 text-3xl">✘</span>;
      default:
        return <span className="text-slate-400 text-3xl">=</span>;
    }
  };


  if (!selectedLevel) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-sky-50">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-600">分數練習達人</h1>
          <p className="text-slate-600 mt-2 text-lg">從國小到國中，一步步掌握分數運算！</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map(level => (
            <div key={level.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{level.title}</h2>
              <p className="text-slate-600 flex-grow mb-4">{level.description}</p>
              <div className="bg-slate-100 p-3 rounded-md mb-6">
                <h3 className="font-semibold text-slate-700 mb-2">例題：</h3>
                <MathRenderer latex={level.example} className="text-xl text-slate-800"/>
              </div>
              <button onClick={() => startPractice(level)} className="mt-auto w-full bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-600 transition-transform transform hover:scale-105">
                開始練習
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 bg-sky-50">
        <header className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-indigo-600">{selectedLevel.title}</h1>
            <button onClick={resetPractice} className="px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition">
                返回等級選擇
            </button>
        </header>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
                {questions.length > 0 ? questions.map((q, i) => (
                    <div key={i} className={`p-4 rounded-lg shadow-sm border-2 transition ${getFeedbackStyles(checkStates[i])}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold text-slate-500 mr-4">第 {i + 1} 題</span>
                                <MathRenderer latex={q.problem} className="text-3xl text-slate-800"/>
                            </div>
                            <div className="flex items-center">
                               {getFeedbackIcon(checkStates[i])}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                             <FractionInput value={userAnswers[i]} onChange={(val) => handleAnswerChange(i, val)} disabled={false} />
                        </div>
                        {checkStates[i] === CheckState.INCORRECT && (
                            <div className="mt-3 flex items-center justify-center text-emerald-800 font-semibold">
                                <span>正確答案:</span>
                                <MathRenderer latex={`\\frac{${q.answer.numerator}}{${q.answer.denominator}}`} className="text-xl ml-2" inline={true}/>
                            </div>
                        )}
                    </div>
                )) : (
                  <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-inner border">
                     <p className="text-xl text-slate-500">無法載入題目，請返回並重試。</p>
                  </div>
                )}
            </div>
            <div className="min-h-[400px] md:min-h-0">
                <Scratchpad />
            </div>
        </div>
        <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 mt-6 border-t rounded-t-xl shadow-2xl">
            <div className="max-w-4xl mx-auto flex justify-center items-center gap-4">
                <button onClick={checkAnswers} className="flex-1 bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 disabled:bg-slate-300" disabled={questions.length === 0}>
                    核對答案
                </button>
                <button onClick={() => startPractice(selectedLevel)} className="flex-1 bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-indigo-600 transition-transform transform hover:scale-105">
                    換一批題目
                </button>
            </div>
        </footer>
    </div>
  );
};

export default App;