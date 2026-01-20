import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Users, BookOpen } from 'lucide-react';

interface Monument {
  id: string;
  nameMarathi: string;
  nameEnglish: string;
  location: string;
  year: string;
  description: string;
  historicalFacts: string[];
  emoji: string;
  color: string;
  visitTime: string;
  bestTime: string;
  entryFee: string;
}

const monuments: Monument[] = [
  {
    id: 'shaniwar-wada',
    nameMarathi: 'शनिवार वाडा',
    nameEnglish: 'Shaniwar Wada',
    location: 'पुणे',
    year: '1732',
    description: 'शनिवार वाडा हा पेशव्यांचा मुख्य किल्ला आणि राजवाडा होता. हे पुणेचे सर्वात महत्वाचे ऐतिहासिक स्मारक आहे.',
    historicalFacts: [
      'पेशवा बाजीराव प्रथमांनी बांधवले',
      'शनिवारी (शनिवारच्या दिवशी) बांधकाम सुरू झाले',
      '1828 मध्ये भीषण आग लागली',
      'आज संग्रहालय म्हणून उपलब्ध आहे'
    ],
    emoji: '🏰',
    color: 'from-amber-500 to-orange-600',
    visitTime: '2-3 तास',
    bestTime: 'सकाळ 9 ते 5 संध्या',
    entryFee: '₹100'
  },
  {
    id: 'raigad-fort',
    nameMarathi: 'रायगड किल्ला',
    nameEnglish: 'Raigad Fort',
    location: 'महाड',
    year: '1656',
    description: 'रायगड किल्ला छत्रपती शिवाजी महाराजांचा राजधानी किल्ला होता. हा महाराष्ट्रातील सर्वात महत्वाचा किल्ला आहे.',
    historicalFacts: [
      'शिवाजी महाराजांचा राजधानी किल्ला',
      '1674 मध्ये राज्याभिषेक झाला',
      '2737 पायरी चढून किल्ल्यावर पोहोचता येते',
      'यूनेस्को विश्व वारसा स्थल'
    ],
    emoji: '🏯',
    color: 'from-red-500 to-pink-600',
    visitTime: '4-5 तास',
    bestTime: 'सकाळ 7 ते संध्या 6',
    entryFee: '₹100'
  },
  {
    id: 'ajanta-caves',
    nameMarathi: 'अजिंठा गुहा',
    nameEnglish: 'Ajanta Caves',
    location: 'औरंगाबाद',
    year: '200 BC - 650 AD',
    description: 'अजिंठा गुहा हे 30 बौद्ध गुहा मंदिर आहेत. या गुहांमध्ये प्राचीन भारतीय कला आणि वास्तुकला दिसून येते.',
    historicalFacts: [
      '30 बौद्ध गुहा मंदिर',
      'सुंदर भित्तिचित्र आणि मूर्तिकला',
      'यूनेस्को विश्व वारसा स्थल',
      '2000 वर्षांपूर्वी बांधलेले'
    ],
    emoji: '🗿',
    color: 'from-purple-500 to-indigo-600',
    visitTime: '3-4 तास',
    bestTime: 'सकाळ 9 ते संध्या 5:30',
    entryFee: '₹250'
  },
  {
    id: 'ellora-caves',
    nameMarathi: 'एलोरा गुहा',
    nameEnglish: 'Ellora Caves',
    location: 'औरंगाबाद',
    year: '600 AD - 1000 AD',
    description: 'एलोरा गुहा हे 34 गुहा मंदिर आहेत जे बौद्ध, हिंदू आणि जैन धर्मांचे प्रतिनिधित्व करतात.',
    historicalFacts: [
      '34 गुहा मंदिर',
      'कैलाश मंदिर - एक खडकातून कोरलेले',
      'तीन धर्मांचे समन्वय',
      'यूनेस्को विश्व वारसा स्थल'
    ],
    emoji: '⛩️',
    color: 'from-blue-500 to-cyan-600',
    visitTime: '3-4 तास',
    bestTime: 'सकाळ 9 ते संध्या 5:30',
    entryFee: '₹250'
  },
  {
    id: 'daulatabad-fort',
    nameMarathi: 'दौलताबाद किल्ला',
    nameEnglish: 'Daulatabad Fort',
    location: 'औरंगाबाद',
    year: '1187',
    description: 'दौलताबाद किल्ला हा देवगिरी किल्ला म्हणूनही ओळखला जातो. हा मध्যযुगीन भारतातील सर्वात मजबूत किल्ल्यांपैकी एक होता.',
    historicalFacts: [
      'देवगिरी किल्ला म्हणून ओळखला जातो',
      'मुहम्मद तुगलकांचा राजधानी',
      'तीन दिवारी असलेला किल्ला',
      'चुंबकीय पत्थरांचा वापर'
    ],
    emoji: '🏛️',
    color: 'from-yellow-500 to-orange-600',
    visitTime: '2-3 तास',
    bestTime: 'सकाळ 9 ते संध्या 5:30',
    entryFee: '₹150'
  },
  {
    id: 'bibi-ka-maqbara',
    nameMarathi: 'बीबी का मकबरा',
    nameEnglish: 'Bibi Ka Maqbara',
    location: 'औरंगाबाद',
    year: '1679',
    description: 'बीबी का मकबरा हा ताजमहलाचा छोटा आवृत्ती मानला जातो. हे औरंगजेबच्या पत्नीचे मकबरा आहे.',
    historicalFacts: [
      'औरंगजेबच्या पत्नीचे मकबरा',
      'ताजमहलाचा छोटा आवृत्ती',
      'सुंदर मुगल वास्तुकला',
      'संगमरवरी आणि खोदलेली कारीगिरी'
    ],
    emoji: '🕌',
    color: 'from-pink-500 to-rose-600',
    visitTime: '1-2 तास',
    bestTime: 'सकाळ 9 ते संध्या 5:30',
    entryFee: '₹100'
  },
  {
    id: 'lonar-crater',
    nameMarathi: 'लोनार क्रेटर',
    nameEnglish: 'Lonar Crater Lake',
    location: 'बुलढाणा',
    year: 'प्राचीन काल',
    description: 'लोनार क्रेटर हे एक मेटिओराइट प्रभाव क्रेटर आहे. हे विश्वातील दुसरे सर्वात मोठे क्रेटर आहे.',
    historicalFacts: [
      'मेटिओराइट प्रभाव क्रेटर',
      'विश्वातील दुसरे सर्वात मोठे',
      '50,000 वर्षांपूर्वी तयार',
      'खारे पाण्याची झील'
    ],
    emoji: '🌋',
    color: 'from-green-500 to-teal-600',
    visitTime: '2-3 तास',
    bestTime: 'सकाळ 6 ते संध्या 6',
    entryFee: 'विनामूल्य'
  },
  {
    id: 'jyotiba-temple',
    nameMarathi: 'ज्योतिबा मंदिर',
    nameEnglish: 'Jyotiba Temple',
    location: 'कोल्हापूर',
    year: '8वी शतक',
    description: 'ज्योतिबा मंदिर हा कोल्हापूरातील सर्वात प्राचीन मंदिर आहे. हे शक्तिपीठांपैकी एक मानला जातो.',
    historicalFacts: [
      'शक्तिपीठांपैकी एक',
      '8वी शतकात बांधलेले',
      'देवी महालक्ष्मीचे मंदिर',
      'कोल्हापूरचे प्रसिद्ध मंदिर'
    ],
    emoji: '🙏',
    color: 'from-red-500 to-rose-600',
    visitTime: '1-2 तास',
    bestTime: 'सकाळ 6 ते संध्या 9',
    entryFee: 'विनामूल्य'
  }
];

export default function MonumentTour() {
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(monuments[0]);
  const [visitedMonuments, setVisitedMonuments] = useState<string[]>([]);

  const handleVisit = (monument: Monument) => {
    setSelectedMonument(monument);
    if (!visitedMonuments.includes(monument.id)) {
      setVisitedMonuments([...visitedMonuments, monument.id]);
    }
  };

  const handleReset = () => {
    setVisitedMonuments([]);
    setSelectedMonument(monuments[0]);
  };

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
          <h1 className="text-2xl font-bold text-slate-900">महाराष्ट्र दर्शन</h1>
          <button
            onClick={handleReset}
            className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
          >
            रीसेट
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monument List */}
          <div className="lg:col-span-1">
            <Card className="p-4 bg-white sticky top-24">
              <h2 className="font-bold text-slate-900 mb-4">स्मारके ({visitedMonuments.length}/{monuments.length})</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {monuments.map(monument => (
                  <button
                    key={monument.id}
                    onClick={() => handleVisit(monument)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedMonument?.id === monument.id
                        ? 'bg-amber-500 text-white'
                        : visitedMonuments.includes(monument.id)
                        ? 'bg-green-100 text-slate-900'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-lg font-semibold">{monument.emoji}</div>
                    <div className="text-sm font-medium">{monument.nameMarathi}</div>
                    <div className="text-xs opacity-75">{monument.location}</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Monument Details */}
          {selectedMonument && (
            <div className="lg:col-span-2 space-y-4">
              {/* Hero Card */}
              <Card className={`bg-gradient-to-br ${selectedMonument.color} text-white p-8 rounded-xl`}>
                <div className="text-6xl mb-4">{selectedMonument.emoji}</div>
                <h2 className="text-3xl font-bold mb-2">{selectedMonument.nameMarathi}</h2>
                <p className="text-lg opacity-90 mb-4">{selectedMonument.nameEnglish}</p>
                <p className="text-base opacity-85">{selectedMonument.description}</p>
              </Card>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-amber-600" />
                    <span className="font-semibold text-slate-900">स्थान</span>
                  </div>
                  <p className="text-slate-700">{selectedMonument.location}</p>
                </Card>

                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className="text-amber-600" />
                    <span className="font-semibold text-slate-900">वर्ष</span>
                  </div>
                  <p className="text-slate-700">{selectedMonument.year}</p>
                </Card>

                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} className="text-amber-600" />
                    <span className="font-semibold text-slate-900">भेट वेळ</span>
                  </div>
                  <p className="text-slate-700">{selectedMonument.visitTime}</p>
                </Card>

                <Card className="p-4 bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={20} className="text-amber-600" />
                    <span className="font-semibold text-slate-900">प्रवेश शुल्क</span>
                  </div>
                  <p className="text-slate-700">{selectedMonument.entryFee}</p>
                </Card>
              </div>

              {/* Best Time & Historical Facts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-6 bg-white">
                  <h3 className="font-bold text-slate-900 mb-3">सर्वोत्तम वेळ</h3>
                  <p className="text-slate-700">{selectedMonument.bestTime}</p>
                </Card>

                <Card className="p-6 bg-white">
                  <h3 className="font-bold text-slate-900 mb-3">ऐतिहासिक तथ्य</h3>
                  <ul className="space-y-2">
                    {selectedMonument.historicalFacts.slice(0, 2).map((fact, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-amber-600">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Full Historical Facts */}
              <Card className="p-6 bg-white">
                <h3 className="font-bold text-slate-900 mb-4">संपूर्ण ऐतिहासिक माहिती</h3>
                <ul className="space-y-3">
                  {selectedMonument.historicalFacts.map((fact, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <span className="text-amber-600 font-bold">{idx + 1}.</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Visit Status */}
              {visitedMonuments.includes(selectedMonument.id) && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-semibold">✓ तुम्ही या स्मारकाला भेट दिली आहे!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mt-8 text-center">
          <p className="text-slate-700 font-semibold">
            {visitedMonuments.length} / {monuments.length} स्मारकांना भेट दिली
          </p>
          <div className="w-full bg-slate-200 rounded-full h-3 mt-3 max-w-md mx-auto">
            <div
              className="bg-amber-500 h-3 rounded-full transition-all"
              style={{ width: `${(visitedMonuments.length / monuments.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
