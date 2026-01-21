import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function EscalatingQuiz() {
  const [, setLocation] = useLocation();
  const [level, setLevel] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rules, setRules] = useState("");

  const questions = [
    "२ + २ काय आहे?",
    '"मांजर" उलट लिहा',
    "फक्त स्वर वापरून उत्तर: आकाशाचा रंग काय?",
    '"मी जिंकलो" अपरकेस मध्ये लिहा',
  ];

  const answers: (string | RegExp)[] = ["४", "रांजम", /^[aeiouआईउऊएऐओऔ]+$/i, "मी जिंकलो"];
  const rulesText = [
    "",
    "नियम: उलट उत्तर",
    "नियम: फक्त स्वर वापरा",
    "नियम: अपरकेस फक्त",
  ];

  useEffect(() => {
    setRules(rulesText[level]);
  }, [level]);

  const checkAnswer = () => {
    const val = answer.trim();
    let correct = false;

    if (level === 0 && val === answers[0]) correct = true;
    else if (level === 1 && val === answers[1]) correct = true;
    else if (level === 2 && answers[2] instanceof RegExp && answers[2].test(val)) correct = true;
    else if (level === 3 && val === answers[3]) correct = true;

    if (correct) {
      if (level < questions.length - 1) {
        setLevel(level + 1);
        setFeedback("बरोबर! वाढत आहे... 🎉");
        setAnswer("");
      } else {
        setFeedback("तुम्ही जिंकला! 🏆");
      }
    } else {
      setFeedback("चुकीचे! पुन्हा प्रयत्न करा.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-cyan-400 hover:text-cyan-300 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-400">
          वाढणारी क्विझ
        </h1>
        <p className="text-center text-gray-300 mb-8">
          स्तर {level + 1} / {questions.length}
        </p>

        <div className="bg-slate-700 rounded-lg p-8 mb-6">
          <p className="text-2xl font-semibold text-center mb-6">
            {questions[level]}
          </p>

          {rules && (
            <p className="text-center text-yellow-300 mb-4 italic">{rules}</p>
          )}

          <div className="flex gap-3 mb-6">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
              placeholder="तुमचे उत्तर..."
              className="bg-slate-600 border-slate-500 text-white placeholder-gray-400"
            />
            <Button
              onClick={checkAnswer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
            >
              सादर करा
            </Button>
          </div>

          {feedback && (
            <p
              className={`text-center text-lg font-semibold ${
                feedback.includes("बरोबर") || feedback.includes("जिंकला")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>

        <div className="text-center">
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((level + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-gray-400 mt-2">
            {level + 1} / {questions.length} प्रश्न पूर्ण
          </p>
        </div>
      </div>
    </div>
  );
}
