import React, { useState, useEffect, useCallback } from 'react';

const events = [
  { type: 'bad', text: 'Major competitor enters the market', valueChange: 0.1 },
  { type: 'bad', text: 'Key team member leaves', valueChange: 0.1 },
  { type: 'bad', text: 'Product launch fails', valueChange: 0.1 },
  { type: 'bad', text: 'Lawsuit filed against company', valueChange: 0.1 },
  { type: 'bad', text: 'Major security breach discovered', valueChange: 0.1 },
  { type: 'neutral', text: 'New partnership formed', valueChange: 1.3 },
  { type: 'neutral', text: 'Product feature well-received', valueChange: 1.2 },
  { type: 'neutral', text: 'Positive media coverage', valueChange: 1.4 },
  { type: 'neutral', text: 'Successful marketing campaign', valueChange: 1.3 },
  { type: 'neutral', text: 'Cost-saving measure implemented', valueChange: 1.1 },
  { type: 'neutral', text: 'New talent hired', valueChange: 1.2 },
  { type: 'neutral', text: 'Industry award won', valueChange: 1.5 },
  { type: 'neutral', text: 'Product update launched', valueChange: 1.3 },
  { type: 'neutral', text: 'Customer satisfaction improves', valueChange: 1.4 },
  { type: 'neutral', text: 'New office opened', valueChange: 1.2 },
  { type: 'neutral', text: 'Successful trade show appearance', valueChange: 1.3 },
  { type: 'neutral', text: 'Positive analyst report', valueChange: 1.4 },
  { type: 'neutral', text: 'New distribution channel secured', valueChange: 1.5 },
  { type: 'neutral', text: 'Efficiency improvements implemented', valueChange: 1.2 },
  { type: 'good', text: 'Major customer signs long-term contract', valueChange: 75 },
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatMoney = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const App = () => {
  const [gameState, setGameState] = useState('intro');
  const [strategy, setStrategy] = useState(null);
  const [companyValue, setCompanyValue] = useState(1000000);
  const [eventHistory, setEventHistory] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [shuffledEvents, setShuffledEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [showBreakingNews, setShowBreakingNews] = useState(false);

  const resetGame = useCallback(() => {
    setGameState('intro');
    setStrategy(null);
    setCompanyValue(1000000);
    setEventHistory([]);
    setCurrentEvent(null);
    setEventCount(0);
    setShuffledEvents(shuffleArray([...events]));
    setTotalEvents(7 + Math.floor(Math.random() * 4)); // 7 to 10 events
    setShowBreakingNews(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleStart = useCallback(() => {
    setGameState('chooseStrategy');
  }, []);

  const handleStrategyChoice = useCallback((choice) => {
    setStrategy(choice);
  }, []);

  const handleConfirm = useCallback(() => {
    if (strategy) {
      setGameState('playing');
      triggerNextEvent();
    }
  }, [strategy]);

  const triggerNextEvent = useCallback(() => {
    setEventCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount <= totalEvents && newCount <= shuffledEvents.length) {
        setShowBreakingNews(true);
        setTimeout(() => {
          setShowBreakingNews(false);
          const event = shuffledEvents[prevCount];
          setCurrentEvent(event);
          setCompanyValue((prevValue) => {
            let newValue;
            if (event.type === 'good') {
              newValue = Math.floor(Math.random() * (100000000 - 50000000) + 50000000);
            } else {
              newValue = Math.max(0, Math.floor(prevValue * event.valueChange));
            }
            setEventHistory((prevHistory) => [...prevHistory, { ...event, resultingValue: newValue }]);
            return newValue;
          });
        }, 2000);
        return newCount;
      } else {
        setGameState('gameOver');
        return prevCount;
      }
    });
  }, [shuffledEvents, totalEvents]);

  const handleContinue = useCallback(() => {
    triggerNextEvent();
  }, [triggerNextEvent]);

  const handleExit = useCallback(() => {
    setGameState('gameOver');
  }, []);

  const handleReplay = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const renderIntro = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Startup Journey</h1>
      <p className="mb-4">
        In this game, you'll make decisions that will affect your startup's future.
        Choose wisely between fundraising and bootstrapping, and navigate through various events.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleStart}
      >
        Start Game
      </button>
    </div>
  );

  const renderStrategyChoice = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Choose Your Strategy</h2>
      <div className="mb-4">
        <button
          className={`mr-2 ${
            strategy === 'Fundraise'
              ? 'bg-green-500'
              : 'bg-blue-500 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded`}
          onClick={() => handleStrategyChoice('Fundraise')}
        >
          Fundraise
        </button>
        <button
          className={`${
            strategy === 'Bootstrap'
              ? 'bg-green-500'
              : 'bg-blue-500 hover:bg-blue-700'
          } text-white font-bold py-2 px-4 rounded`}
          onClick={() => handleStrategyChoice('Bootstrap')}
        >
          Bootstrap
        </button>
      </div>
      {strategy && (
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      )}
    </div>
  );

  const renderPlaying = () => (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">
        Strategy: {strategy} | Company Value: {formatMoney(companyValue)}
      </h2>
      {showBreakingNews ? (
        <div className="animate-pulse text-2xl font-bold text-red-600 mb-4">
          Breaking News!
        </div>
      ) : currentEvent ? (
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">{currentEvent.text}</p>
          <p className="text-md">
            New Company Value: {formatMoney(companyValue)}
          </p>
        </div>
      ) : null}
      <div>
        <button
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleContinue}
        >
          Continue
        </button>
        <button
          className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${
            strategy === 'Fundraise' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleExit}
          disabled={strategy === 'Fundraise'}
        >
          Exit ({formatMoney(companyValue)})
        </button>
      </div>
    </div>
  );

  const renderGameOver = () => {
    let finalMessage;
    if (strategy === 'Fundraise') {
      if (companyValue >= 50000000) {
        finalMessage = `Congratulations! You've successfully exited at ${formatMoney(companyValue)}`;
      } else {
        finalMessage = "Unfortunately, your company is being wound down. Final value: $0";
      }
    } else {
      finalMessage = `You've decided to exit. Final company value: ${formatMoney(companyValue)}`;
    }

    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-xl mb-4">{finalMessage}</p>
        <h3 className="text-lg font-bold mb-2">Event History</h3>
        <table className="w-full mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Event</th>
              <th className="border px-4 py-2">Resulting Value</th>
            </tr>
          </thead>
          <tbody>
            {eventHistory.map((event, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{event.text}</td>
                <td className="border px-4 py-2">
                  {formatMoney(event.resultingValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleReplay}
        >
          Play Again
        </button>
      </div>
    );
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'intro':
        return renderIntro();
      case 'chooseStrategy':
        return renderStrategyChoice();
      case 'playing':
        return renderPlaying();
      case 'gameOver':
        return renderGameOver();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderGameState()}
    </div>
  );
};