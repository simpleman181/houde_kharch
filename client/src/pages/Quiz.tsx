import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  answer: boolean;
  explanation: string;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'महाराष्ट्र भारताचा सर्वाधिक लोकसंख्या असलेला राज्य आहे.',
    answer: false,
    explanation: 'उत्तर प्रदेश हा भारताचा सर्वाधिक लोकसंख्या असलेला राज्य आहे। महाराष्ट्र दुसऱ्या क्रमांकावर आहे।',
    category: 'भूगोल',
  },
  {
    id: 2,
    question: 'मुंबई हे महाराष्ट्राची राजधानी आहे.',
    answer: true,
    explanation: 'होय, मुंबई महाराष्ट्राची राजधानी आहे आणि भारताचे आर्थिक केंद्र आहे।',
    category: 'भूगोल',
  },
  {
    id: 3,
    question: 'छत्रपती शिवाजी महाराज मराठा साम्राज्याचे संस्थापक होते.',
    answer: true,
    explanation: 'छत्रपती शिवाजी महाराज यांनी 17 व्या शतकात मराठा साम्राज्याची स्थापना केली.',
    category: 'इतिहास',
  },
  {
    id: 4,
    question: 'मराठी भाषा संस्कृत भाषेपासून विकसित झाली आहे.',
    answer: true,
    explanation: 'मराठी हा इंडो-आर्यन भाषा परिवारातील भाषा आहे जी संस्कृतपासून विकसित झाली.',
    category: 'भाषा',
  },
  {
    id: 5,
    question: 'अजंता आणि एलोरा गुहा महाराष्ट्रात आहेत.',
    answer: true,
    explanation: 'अजंता आणि एलोरा गुहा औरंगाबाद जिल्ह्यात आहेत आणि यूनेस्को विश्व धरोहर स्थल आहेत।',
    category: 'संस्कृती',
  },
  {
    id: 6,
    question: 'भारतीय अंतरिक्ष संशोधन संस्था (ISRO) मुंबईत आहे.',
    answer: false,
    explanation: 'ISRO चे मुख्यालय बेंगळुरूत आहे, मुंबईत नाही।',
    category: 'विज्ञान',
  },
  {
    id: 7,
    question: 'महाराष्ट्र हा भारताचा सर्वाधिक औद्योगिक राज्य आहे.',
    answer: true,
    explanation: 'महाराष्ट्र भारताचा सर्वाधिक औद्योगिक विकसित राज्य आहे।',
    category: 'अर्थव्यवस्था',
  },
  {
    id: 8,
    question: 'डॉ. बाबासाहेब आंबेडकर महाराष्ट्रातून होते.',
    answer: true,
    explanation: 'डॉ. बाबासाहेब आंबेडकर महाराष्ट्रातून होते आणि भारतीय संविधानचे मुख्य निर्माता होते।',
    category: 'इतिहास',
  },
  {
    id: 9,
    question: 'सुगरकेन हे महाराष्ट्रातील मुख्य पीक आहे.',
    answer: true,
    explanation: 'साखर हे महाराष्ट्रातील मुख्य पीक आहे आणि महाराष्ट्र भारताचा सर्वाधिक साखर उत्पादक राज्य आहे।',
    category: 'कृषी',
  },
  {
    id: 10,
    question: 'महाराष्ट्र दिन 1 मे रोजी साजरा केला जातो.',
    answer: true,
    explanation: 'महाराष्ट्र दिन 1 मे रोजी साजरा केला जातो, जो महाराष्ट्र राज्याच्या स्थापनाचे दिन आहे।',
    category: 'संस्कृती',
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === question.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="bg-white border-b border-indigo-200 sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
                <ArrowLeft size={20} />
                परत
              </a>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">हे सत्य आहे का?</h1>
            <div></div>
          </div>
        </div>

        <div className="container py-12">
          <Card className="p-12 text-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white max-w-2xl mx-auto">
            <div className="text-6xl font-bold mb-4">{percentage}%</div>
            <h2 className="text-3xl font-bold mb-4">उत्तम काम!</h2>
            <p className="text-lg mb-8 opacity-90">
              तुम्ही {score} पैकी {questions.length} प्रश्नांची उत्तरे बरोबर दिली
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleRestart}
                className="w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold text-lg py-6"
              >
                पुन्हा खेळा
              </Button>
              <Link href="/">
                <a className="block">
                  <Button className="w-full bg-indigo-700 hover:bg-indigo-800 font-bold text-lg py-6">
                    मुख्य पृष्ठ
                  </Button>
                </a>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-indigo-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">हे सत्य आहे का?</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">
              {currentQuestion + 1}/{questions.length}
            </div>
            <p className="text-xs text-slate-600">अंक: {score}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-2">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container py-12">
        <Card className="p-8 max-w-2xl mx-auto bg-white">
          {/* Category Badge */}
          <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {question.category}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {question.question}
          </h2>

          {/* Answer Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleAnswer(true)}
              disabled={answered}
              className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
                answered && selectedAnswer === true
                  ? selectedAnswer === question.answer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {answered && selectedAnswer === true && (
                <span className="flex items-center justify-center gap-2">
                  {selectedAnswer === question.answer ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                </span>
              )}
              सत्य (True)
            </button>

            <button
              onClick={() => handleAnswer(false)}
              disabled={answered}
              className={`w-full p-4 rounded-lg font-bold text-lg transition-all ${
                answered && selectedAnswer === false
                  ? selectedAnswer === question.answer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {answered && selectedAnswer === false && (
                <span className="flex items-center justify-center gap-2">
                  {selectedAnswer === question.answer ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                </span>
              )}
              असत्य (False)
            </button>
          </div>

          {/* Explanation */}
          {answered && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === question.answer
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              <p className="font-semibold text-slate-900 mb-2">
                {selectedAnswer === question.answer ? '✓ बरोबर!' : '✗ चुकीचे!'}
              </p>
              <p className="text-slate-700">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <Button
              onClick={handleNext}
              className="w-full bg-indigo-500 hover:bg-indigo-600 font-bold text-lg py-6"
            >
              {currentQuestion === questions.length - 1 ? 'परिणाम पहा' : 'पुढील'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
