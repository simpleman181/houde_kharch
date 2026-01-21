import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CulturalQuiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const questions = [
    {
      question: "महाराष्ट्राचे राजकीय पक्षी कोणते आहे?",
      options: ["कोकिळ", "मोर", "तोते", "बाज"],
      correct: 0,
    },
    {
      question: "शिवाजी महाराज कोण होते?",
      options: ["राजा", "योद्धा", "साधु", "व्यापारी"],
      correct: 1,
    },
    {
      question: "मराठी भाषा कोणत्या लिपीमध्ये लिहिली जाते?",
      options: ["देवनागरी", "रोमन", "गुजराती", "तेलुगु"],
      correct: 0,
    },
    {
      question: "राज्यातील सर्वोच्च शिखर कोणते आहे?",
      options: ["धुलधर", "कलसुबाई", "महाबळेश्वर", "सिंहगड"],
      correct: 1,
    },
    {
      question: "गणेश चतुर्थी कधी साजरी केली जाते?",
      options: ["भाद्रपद महिन्यात", "कार्तिक महिन्यात", "चैत्र महिन्यात", "फाल्गुन महिन्यात"],
      correct: 0,
    },
  ];

  const handleAnswer = (selectedIndex: number) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameActive(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameActive(true);
  };

  if (!gameActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setLocation("/")}
            className="mb-6 text-purple-300 hover:text-purple-200 underline"
          >
            ← परत
          </button>

          <h1 className="text-4xl font-bold text-center mb-8">महाराष्ट्रीयन संस्कृती क्विझ</h1>

          <div className="bg-purple-700 rounded-lg p-8 text-center">
            <p className="text-6xl font-bold text-yellow-300 mb-4">{score}/{questions.length}</p>
            <p className="text-2xl mb-8">
              {score === questions.length
                ? "परिपूर्ण! तुम्ही महाराष्ट्रीयन संस्कृतीचे विशेषज्ञ आहात!"
                : score >= 3
                  ? "छान! तुमचे ज्ञान चांगले आहे!"
                  : "पुन्हा प्रयत्न करा!"}
            </p>
            <Button
              onClick={resetQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              पुन्हा खेळा
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-purple-300 hover:text-purple-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">महाराष्ट्रीयन संस्कृती क्विझ</h1>
        <p className="text-center text-purple-200 mb-8">
          प्रश्न {currentQuestion + 1}/{questions.length}
        </p>

        <div className="bg-purple-700 rounded-lg p-8 mb-6">
          <p className="text-2xl font-bold mb-8 text-center">
            {questions[currentQuestion].question}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {questions[currentQuestion].options.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="bg-purple-600 hover:bg-purple-500 text-white py-4 text-lg"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-center text-purple-200">
          अंक: {score}
        </div>
      </div>
    </div>
  );
}
