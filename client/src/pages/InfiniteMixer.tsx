import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function InfiniteMixer() {
  const [, setLocation] = useLocation();
  const [inventory, setInventory] = useState<string[]>([
    "पाणी",
    "माती",
    "आग",
    "हवा",
  ]);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");

  const recipes: Record<string, string> = {
    "पाणी+माती": "चिकणी",
    "आग+हवा": "वारा",
    "पाणी+आग": "वाफ",
    "माती+आग": "राख",
    "चिकणी+आग": "विटा",
    "विटा+विटा": "घर",
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((s) => s !== item));
    } else if (selected.length < 2) {
      setSelected([...selected, item]);
    }
  };

  const mix = () => {
    if (selected.length !== 2) {
      setResult("2 वस्तू निवडा!");
      return;
    }

    const key = selected.sort().join("+");
    const newItem = recipes[key];

    if (newItem) {
      setResult(`${selected[0]} + ${selected[1]} = ${newItem}!`);
      if (!inventory.includes(newItem)) {
        setInventory([...inventory, newItem]);
      }
    } else {
      setResult("हे मिश्रण शक्य नाही!");
    }

    setSelected([]);
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

        <h1 className="text-4xl font-bold text-center mb-2">अनंत मिक्सर</h1>
        <p className="text-center text-gray-300 mb-8">वस्तू एकत्र करा आणि नवीन गोष्टी तयार करा!</p>

        <div className="bg-slate-700 rounded-lg p-6 mb-6">
          <p className="text-center text-gray-300 mb-4">तुमचा संग्रह:</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {inventory.map((item) => (
              <button
                key={item}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selected.includes(item)
                    ? "bg-yellow-500 text-black"
                    : "bg-slate-600 text-white hover:bg-slate-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <p className="text-center text-lg mb-4">
              निवडलेले: {selected.join(", ")}
            </p>
          )}

          <Button
            onClick={mix}
            disabled={selected.length !== 2}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mb-4"
          >
            मिश्रण करा
          </Button>

          {result && (
            <div className="bg-slate-600 rounded-lg p-4 text-center">
              <p className="text-lg font-semibold">{result}</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => {
            setInventory(["पाणी", "माती", "आग", "हवा"]);
            setSelected([]);
            setResult("");
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          रीसेट करा
        </Button>
      </div>
    </div>
  );
}
