import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Dilemma {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  resultA: string;
  resultB: string;
  category: string;
}

const dilemmas: Dilemma[] = [
  {
    id: 1,
    question: 'तुम्हाला रस्त्यावर ₹1000 सापडले. तुम्ही काय कराल?',
    optionA: 'पोलिसांना सांगा',
    optionB: 'ते ठेवून घ्या',
    resultA: 'तुम्ही प्रामाणिक आहात! 😇',
    resultB: 'तुम्ही भाग्यवान आहात, पण नैतिकता गमावली! 😬',
    category: 'नैतिकता',
  },
  {
    id: 2,
    question: 'तुमचा मित्र परीक्षेत चीट करायला सांगतो. तुम्ही?',
    optionA: 'तुमचा मित्र असूनही नकार दिलास',
    optionB: 'त्याला साहाय्य केले',
    resultA: 'तुम्ही सदचरित्र आहात! 🌟',
    resultB: 'तुम्ही मित्रत्वाचे मूल्य दिले, पण चुकीचे! 😔',
    category: 'शिक्षा',
  },
  {
    id: 3,
    question: 'तुमच्या कंपनीला बेकायदेशीर मुनाफा मिळू शकतो. तुम्ही?',
    optionA: 'व्यवस्थापकांना सांगा',
    optionB: 'चुप राहा',
    resultA: 'तुम्ही साहसी आहात! 💪',
    resultB: 'तुम्ही सुरक्षित आहात, पण गुनहेगार! ⚖️',
    category: 'व्यावसायिकता',
  },
  {
    id: 4,
    question: 'तुम्ही गरीब कुटुंबाला पैसे देऊ शकता, पण तुमचे सपने पूरण होणार नाहीत. तुम्ही?',
    optionA: 'पैसे दिले',
    optionB: 'पैसे ठेवून घेतले',
    resultA: 'तुम्ही दयाळू आहात! 💖',
    resultB: 'तुम्ही स्वार्थी आहात! 😞',
    category: 'दान',
  },
  {
    id: 5,
    question: 'तुम्हाला वातावरणाला हानी पोहोचणारी नोकरी मिळाली. तुम्ही?',
    optionA: 'नोकरी नकार दिलास',
    optionB: 'नोकरी स्वीकार केली',
    resultA: 'तुम्ही पर्यावरणप्रेमी आहात! 🌍',
    resultB: 'तुम्ही आर्थिक दृष्ट्या समजदार आहात, पण... 😕',
    category: 'पर्यावरण',
  },
  {
    id: 6,
    question: 'तुमचा मित्र तुमच्या गर्लफ्रेंडला पसंद आहे. तुम्ही?',
    optionA: 'तुमच्या मित्राला सांगा',
    optionB: 'चुप राहा',
    resultA: 'तुम्ही प्रामाणिक आहात! 🤝',
    resultB: 'तुम्ही समस्या टाळली, पण सत्य लपवले! 🤫',
    category: 'संबंध',
  },
  {
    id: 7,
    question: 'तुम्हाला एक महत्वाचा परीक्षा आहे, पण तुमचा आजी आजारी आहे. तुम्ही?',
    optionA: 'आजीच्या काळजी घ्या',
    optionB: 'परीक्षा दे',
    resultA: 'तुम्ही कुटुंबप्रेमी आहात! 👨‍👩‍👧',
    resultB: 'तुम्ही महत्वाकांक्षी आहात! 📚',
    category: 'कुटुंब',
  },
  {
    id: 8,
    question: 'तुम्हाला असत्य सांगून चांगली नोकरी मिळू शकते. तुम्ही?',
    optionA: 'सत्य सांगा',
    optionB: 'असत्य सांगा',
    resultA: 'तुम्ही सदचरित्र आहात! ✨',
    resultB: 'तुम्ही यशस्वी होऊ शकता, पण अपराधी! 🚨',
    category: 'सत्यता',
  },
];

export default function Dilemma() {
  const [currentDilemma, setCurrentDilemma] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<{ option: string; result: string }[]>([]);

  const dilemma = dilemmas[currentDilemma];

  const handleAnswer = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setAnswered(true);
    const result = option === 'A' ? dilemma.resultA : dilemma.resultB;
    setResults([...results, { option, result }]);
  };

  const handleNext = () => {
    if (currentDilemma < dilemmas.length - 1) {
      setCurrentDilemma(currentDilemma + 1);
      setAnswered(false);
      setSelectedOption(null);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentDilemma(0);
    setAnswered(false);
    setSelectedOption(null);
    setCompleted(false);
    setResults([]);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-white border-b border-amber-200 sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold">
                <ArrowLeft size={20} />
                परत
              </a>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">जाल्द येत आहे</h1>
            <div></div>
          </div>
        </div>

        <div className="container py-12">
          <Card className="p-12 text-center bg-gradient-to-br from-amber-500 to-orange-600 text-white max-w-2xl mx-auto">
            <div className="text-6xl font-bold mb-4">✨</div>
            <h2 className="text-3xl font-bold mb-4">तुमचे निर्णय पूर्ण!</h2>
            <p className="text-lg mb-8 opacity-90">
              तुम्ही {dilemmas.length} नैतिक दुविधांचा सामना केला
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleRestart}
                className="w-full bg-white text-amber-600 hover:bg-slate-100 font-bold text-lg py-6"
              >
                पुन्हा खेळा
              </Button>
              <Link href="/">
                <a className="block">
                  <Button className="w-full bg-amber-700 hover:bg-amber-800 font-bold text-lg py-6">
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-amber-200 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold">
              <ArrowLeft size={20} />
              परत
            </a>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">नैतिक दुविधा</h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-600">
              {currentDilemma + 1}/{dilemmas.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-2">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentDilemma + 1) / dilemmas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="container py-12">
        <Card className="p-8 max-w-2xl mx-auto bg-white">
          {/* Category Badge */}
          <div className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            {dilemma.category}
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {dilemma.question}
          </h2>

          {/* Answer Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleAnswer('A')}
              disabled={answered}
              className={`w-full p-4 rounded-lg font-bold text-lg transition-all text-left ${
                answered && selectedOption === 'A'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <div className="font-bold mb-1">अ) {dilemma.optionA}</div>
            </button>

            <button
              onClick={() => handleAnswer('B')}
              disabled={answered}
              className={`w-full p-4 rounded-lg font-bold text-lg transition-all text-left ${
                answered && selectedOption === 'B'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <div className="font-bold mb-1">ब) {dilemma.optionB}</div>
            </button>
          </div>

          {/* Result */}
          {answered && (
            <div className="p-4 rounded-lg mb-6 bg-amber-50 border-2 border-amber-200">
              <p className="font-semibold text-slate-900 text-lg">
                {selectedOption === 'A' ? dilemma.resultA : dilemma.resultB}
              </p>
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <Button
              onClick={handleNext}
              className="w-full bg-amber-500 hover:bg-amber-600 font-bold text-lg py-6"
            >
              {currentDilemma === dilemmas.length - 1 ? 'परिणाम पहा' : 'पुढील'}
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
