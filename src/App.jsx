import React, { useState, useCallback, useEffect } from 'react';

const GameContext = React.createContext();

const IntroScreen = () => {
  const { startGame } = React.useContext(GameContext);
  return (
    <div
      className='screen intro-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Game Introduction'>
      <h1 className='text-4xl font-bold mb-6'>
        Welcome to the Startup Journey Game!
      </h1>
      <p className='text-xl mb-6'>
        In this game, you'll navigate the challenges of building a startup.
        You'll face various events that can impact your company's value. Choose
        your strategy wisely: Fundraise or Bootstrap?
      </p>
      <button
        onClick={startGame}
        className='bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50'>
        Start Your Journey
      </button>
    </div>
  );
};

const SelectionScreen = () => {
  const { selectStrategy, confirmSelection, strategy } =
    React.useContext(GameContext);
  return (
    <div
      className='screen selection-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Strategy Selection'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>
        Select your strategy:
      </h2>
      <div
        role='group'
        aria-label='Strategy options'
        className='flex justify-center space-x-4 mb-6'>
        <button
          onClick={() => selectStrategy('Fundraise')}
          className={`strategy-button ${
            strategy === 'Fundraise'
              ? 'bg-green-500 text-white'
              : 'bg-white text-gray-800'
          } border-2 border-green-500 py-3 px-6 rounded-lg transition duration-300 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50`}
          aria-pressed={strategy === 'Fundraise'}>
          Fundraise
        </button>
        <button
          onClick={() => selectStrategy('Bootstrap')}
          className={`strategy-button ${
            strategy === 'Bootstrap'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800'
          } border-2 border-blue-500 py-3 px-6 rounded-lg transition duration-300 ease-in-out hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50`}
          aria-pressed={strategy === 'Bootstrap'}>
          Bootstrap
        </button>
      </div>
      {strategy && (
        <div className='flex justify-center space-x-4 mb-6'>
          <button
            onClick={confirmSelection}
            aria-label='Confirm Selection'
            className='bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50'>
            Confirm Selection
          </button>
        </div>
      )}
    </div>
  );
};

const BreakingNewsScreen = () => {
  return (
    <div
      className='screen breaking-news-screen bg-red-600 p-8 rounded-lg shadow-lg flex items-center justify-center'
      role='alert'>
      <h2 className='text-4xl font-bold text-white animate-pulse'>
        Breaking News!
      </h2>
    </div>
  );
};

const EventScreen = () => {
  const { strategy, companyValue, currentEvent, continueGame, exitGame } =
    React.useContext(GameContext);

  return (
    <div
      className='screen event-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Event Screen'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>Current Event</h2>
      <p className='text-xl mb-6'>{currentEvent.description}</p>
      <p className='text-2xl mb-6 font-bold'>
        Company Value: ${companyValue.toLocaleString()}
      </p>
      <div className='flex justify-center space-x-4'>
        <button
          onClick={continueGame}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50'>
          Continue
        </button>
        <button
          onClick={exitGame}
          className={`${
            strategy === 'Bootstrap'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50`}
          disabled={strategy !== 'Bootstrap'}>
          Exit
        </button>
      </div>
    </div>
  );
};

const EndScreen = () => {
  const { strategy, eventHistory, finalValue, restartGame } =
    React.useContext(GameContext);

  const endMessage =
    strategy === 'Fundraise'
      ? finalValue >= 50000000
        ? `Congratulations! You've successfully exited at $${finalValue.toLocaleString()}.`
        : 'Unfortunately, the company is being wound down and the value is $0.'
      : `You've exited the company at $${finalValue.toLocaleString()}.`;

  return (
    <div
      className='screen end-screen bg-gray-100 p-8 rounded-lg shadow-lg'
      role='region'
      aria-label='Game End'>
      <h2 className='text-3xl font-bold mb-6 text-gray-800'>
        Journey Complete
      </h2>
      <p className='text-xl mb-6'>{endMessage}</p>
      <h3 className='text-2xl font-bold mb-4'>Event History:</h3>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse mb-6'>
          <thead>
            <tr>
              <th className='py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-300'>
                Event
              </th>
              <th className='py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-300'>
                Company Value
              </th>
              <th className='py-2 px-4 bg-gray-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-300'>
                Decision
              </th>
            </tr>
          </thead>
          <tbody>
            {eventHistory.map((event, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className='py-2 px-4 border-b border-gray-300'>
                  {event.description}
                </td>
                <td className='py-2 px-4 border-b border-gray-300'>
                  ${event.value.toLocaleString()}
                </td>
                <td className='py-2 px-4 border-b border-gray-300'>
                  {event.decision}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={restartGame}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50'>
        Play Again
      </button>
    </div>
  );
};

export const App = () => {
  const [gameState, setGameState] = useState('intro');
  const [strategy, setStrategy] = useState(null);
  const [companyValue, setCompanyValue] = useState(1000000);
  const [eventCount, setEventCount] = useState(0);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);
  const [finalValue, setFinalValue] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const events = [
    {
      type: 'bad',
      description: 'Major setback! Key team member leaves.',
      multiplier: 0.1,
    },
    {
      type: 'bad',
      description: 'Product launch delayed due to technical issues.',
      multiplier: 0.1,
    },
    {
      type: 'bad',
      description: 'Competitor releases a similar product at a lower price.',
      multiplier: 0.1,
    },
    {
      type: 'bad',
      description: 'Legal dispute arises, draining resources.',
      multiplier: 0.1,
    },
    {
      type: 'bad',
      description: 'Major client cancels contract unexpectedly.',
      multiplier: 0.1,
    },
    {
      type: 'neutral',
      description: 'New partnership formed, slight boost in sales.',
      multiplier: 1.2,
    },
    {
      type: 'neutral',
      description: 'Product receives positive reviews from tech bloggers.',
      multiplier: 1.3,
    },
    {
      type: 'neutral',
      description: 'Small but loyal customer base growing steadily.',
      multiplier: 1.1,
    },
    {
      type: 'neutral',
      description: 'Cost-cutting measures improve profit margins slightly.',
      multiplier: 1.15,
    },
    {
      type: 'neutral',
      description: 'Team completes important milestone ahead of schedule.',
      multiplier: 1.25,
    },
    {
      type: 'neutral',
      description: 'New feature launch moderately successful.',
      multiplier: 1.2,
    },
    {
      type: 'neutral',
      description: 'Company featured in industry publication.',
      multiplier: 1.3,
    },
    {
      type: 'neutral',
      description: 'Successful hiring round brings in fresh talent.',
      multiplier: 1.15,
    },
    {
      type: 'neutral',
      description: 'Minor breakthrough in R&D department.',
      multiplier: 1.25,
    },
    {
      type: 'good',
      description: 'Breakthrough! Company secures major government contract.',
      multiplier: 75,
    },
  ];

  const generateEvent = useCallback(() => {
    const availableEvents = events.filter(
      (event) =>
        !eventHistory.some(
          (histEvent) => histEvent.description === event.description
        )
    );
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
  }, [eventHistory, events]);

  const startGame = useCallback(() => setGameState('selection'), []);
  const selectStrategy = useCallback(
    (selectedStrategy) => setStrategy(selectedStrategy),
    []
  );
  const confirmSelection = useCallback(() => {
    if (strategy) {
      setTotalEvents(Math.floor(Math.random() * 5) + 6); // 6 to 10 events
      setGameState('breakingNews');
      setTimeout(() => {
        setGameState('event');
        const firstEvent = generateEvent();
        setCurrentEvent(firstEvent);
        setCompanyValue((prev) => Math.round(prev * firstEvent.multiplier));
        setEventHistory([
          {
            ...firstEvent,
            value: Math.round(companyValue * firstEvent.multiplier),
            decision: 'Continue',
          },
        ]);
        setEventCount(1);
      }, 2000);
    }
  }, [strategy, generateEvent, companyValue]);

  const continueGame = useCallback(() => {
    if (eventCount >= totalEvents) {
      setGameState('timeUp');
      setTimeout(() => setGameState('end'), 3000);
    } else {
      setGameState('breakingNews');
      setTimeout(() => {
        setGameState('event');
        const newEvent = generateEvent();
        setCurrentEvent(newEvent);
        setCompanyValue((prev) => Math.round(prev * newEvent.multiplier));
        setEventHistory((prev) => [
          ...prev,
          {
            ...newEvent,
            value: Math.round(companyValue * newEvent.multiplier),
            decision: 'Continue',
          },
        ]);
        setEventCount((prev) => prev + 1);
      }, 2000);
    }
  }, [eventCount, totalEvents, generateEvent, companyValue]);

  const exitGame = useCallback(() => {
    setFinalValue(companyValue);
    setGameState('end');
  }, [companyValue]);

  const restartGame = useCallback(() => {
    setGameState('intro');
    setStrategy(null);
    setCompanyValue(1000000);
    setEventCount(0);
    setCurrentEvent(null);
    setEventHistory([]);
    setFinalValue(0);
    setTotalEvents(0);
  }, []);

  useEffect(() => {
    if (gameState === 'timeUp') {
      setFinalValue(companyValue);
    }
  }, [gameState, companyValue]);

  const contextValue = {
    gameState,
    strategy,
    companyValue,
    currentEvent,
    eventHistory,
    finalValue,
    startGame,
    selectStrategy,
    confirmSelection,
    continueGame,
    exitGame,
    restartGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      <div className='game-container max-w-2xl mx-auto p-8 bg-white min-h-screen flex items-center justify-center'>
        <div className='w-full'>
          <h1 className='sr-only'>Startup Journey Game</h1>
          {gameState === 'intro' && <IntroScreen />}
          {gameState === 'selection' && <SelectionScreen />}
          {gameState === 'breakingNews' && <BreakingNewsScreen />}
          {gameState === 'event' && <EventScreen />}
          {gameState === 'timeUp' && (
            <div
              className='screen time-up-screen bg-yellow-400 p-8 rounded-lg shadow-lg flex items-center justify-center'
              role='alert'>
              <h2 className='text-4xl font-bold text-gray-800 animate-pulse'>
                {strategy === 'Fundraise'
                  ? 'Time Is Up, The Investment Window Has Closed'
                  : 'Time Is Up, Your Personal Situation Has Changed'}
              </h2>
            </div>
          )}
          {gameState === 'end' && <EndScreen />}
        </div>
      </div>
    </GameContext.Provider>
  );
};
