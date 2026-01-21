import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function RockPaperScissors() {
  const [, setLocation] = useLocation();
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);

  const choices = [
    { name: "खडक", emoji: "🪨", value: "rock" },
    { name: "कागद", emoji: "📄", value: "paper" },
    { name: "कात्री", emoji: "✂️", value: "scissors" },
  ];

  const play = (playerValue: string) => {
    const computerValue =
      choices[Math.floor(Math.random() * choices.length)].value;

    setPlayerChoice(playerValue);
    setComputerChoice(computerValue);

    let resultText = "";
    let newPlayerScore = playerScore;
    let newComputerScore = computerScore;

    if (playerValue === computerValue) {
      resultText = "समान! 🤝";
    } else if (
      (playerValue === "rock" && computerValue === "scissors") ||
      (playerValue === "paper" && computerValue === "rock") ||
      (playerValue === "scissors" && computerValue === "paper")
    ) {
      resultText = "तुम्ही जिंकला! 🎉";
      newPlayerScore++;
    } else {
      resultText = "संगणक जिंकला! 🤖";
      newComputerScore++;
    }

    setResult(resultText);
    setPlayerScore(newPlayerScore);
    setComputerScore(newComputerScore);
  };

  const getEmoji = (value: string | null) => {
    if (!value) return "❓";
    return choices.find((c) => c.value === value)?.emoji || "❓";
  };

  const getLabel = (value: string | null) => {
    if (!value) return "निवड करा";
    return choices.find((c) => c.value === value)?.name || "निवड करा";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-orange-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setLocation("/")}
          className="mb-6 text-orange-300 hover:text-orange-200 underline"
        >
          ← परत
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">रॉक पेपर कात्री</h1>
        <p className="text-center text-orange-200 mb-8">संगणकाविरुद्ध खेळा</p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-orange-700 rounded-lg p-6 text-center">
            <p className="text-gray-200 mb-2">तुम्ही</p>
            <div className="text-6xl mb-4">{getEmoji(playerChoice)}</div>
            <p className="text-xl font-semibold">{getLabel(playerChoice)}</p>
          </div>

          <div className="bg-orange-700 rounded-lg p-6 text-center">
            <p className="text-gray-200 mb-2">संगणक</p>
            <div className="text-6xl mb-4">{getEmoji(computerChoice)}</div>
            <p className="text-xl font-semibold">{getLabel(computerChoice)}</p>
          </div>
        </div>

        {result && (
          <div className="bg-orange-600 rounded-lg p-4 mb-8 text-center">
            <p className="text-2xl font-bold">{result}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {choices.map((choice) => (
            <Button
              key={choice.value}
              onClick={() => play(choice.value)}
              className="bg-orange-500 hover:bg-orange-600 text-white h-24 flex flex-col items-center justify-center gap-2"
            >
              <span className="text-4xl">{choice.emoji}</span>
              <span>{choice.name}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-700 rounded-lg p-4 text-center">
            <p className="text-gray-300 mb-2">तुमचे अंक</p>
            <p className="text-3xl font-bold text-yellow-300">{playerScore}</p>
          </div>
          <div className="bg-orange-700 rounded-lg p-4 text-center">
            <p className="text-gray-300 mb-2">संगणकचे अंक</p>
            <p className="text-3xl font-bold text-yellow-300">
              {computerScore}
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setPlayerScore(0);
            setComputerScore(0);
            setPlayerChoice(null);
            setComputerChoice(null);
            setResult("");
          }}
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white"
        >
          रीसेट करा
        </Button>
      </div>
    </div>
  );
}
