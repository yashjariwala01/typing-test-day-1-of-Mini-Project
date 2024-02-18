import React, { useState, useEffect } from 'react';

const TypingSpeedTest = () => {
  const [quote, setQuote] = useState("");
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);

  useEffect(() => {
    fetchRandomQuote();
  }, []);

  useEffect(() => {
    let interval;
    if (started && !finished && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setFinished(true);
    }

    return () => clearInterval(interval);
  }, [started, finished, timer]);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote(data.content);
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setText(value);

    // Calculate words typed
    const words = value.trim().split(/\s+/);
    setWordsTyped(words.length);

    // Calculate correct and incorrect words
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i] === quote.split(' ')[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    setCorrectWords(correct);
    setIncorrectWords(incorrect);
  };

  const startTest = () => {
    setStarted(true);
  };

  const restartTest = () => {
    setStarted(false);
    setFinished(false);
    setTimer(60);
    setText("");
    setWordsTyped(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    fetchRandomQuote();
  };

  const endTest = () => {
    setFinished(true);
    setStarted(false);
  };

  const calculateSpeed = () => {
    const minutes = (60 - timer) / 60; // Duration of test in minutes
    const wpm = Math.round(wordsTyped / minutes);
    return wpm;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md px-8 py-12 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Typing Speed Test</h1>
        <p className="text-lg mb-8">{quote}</p>
        <textarea
          className="w-full h-32 border rounded-md p-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
          value={text}
          onChange={handleChange}
          placeholder="Start typing here..."
          disabled={!started || finished}
        />
        {!started && !finished && (
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mb-4" onClick={startTest}>
            Start Test
          </button>
        )}
        {started && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold">Time left: {timer} seconds</p>
            {!finished && <p className="text-lg font-semibold">Words typed: {wordsTyped}</p>}
          </div>
        )}
        {finished && (
          <div>
            <p className="text-xl font-semibold mb-2">Test finished!</p>
            <p className="text-lg mb-2">Your typing speed: {calculateSpeed()} WPM</p>
            <p className="text-lg mb-2">Correct words: {correctWords}</p>
            <p className="text-lg mb-4">Incorrect words: {incorrectWords}</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mb-4" onClick={restartTest}>
              Restart Test
            </button>
          </div>
        )}
        {started && !finished && (
          <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full" onClick={endTest}>
            End Test
          </button>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedTest;
