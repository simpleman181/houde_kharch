export interface Item {
  id: string;
  nameMarathi: string;
  nameEnglish: string;
  price: number;
  emoji: string;
  category: 'food' | 'tech' | 'luxury' | 'vehicles' | 'property' | 'experiences';
}

export const items: Item[] = [
  // Food & Dining
  { id: 'bigmac', nameMarathi: 'बिग मॅक', nameEnglish: 'Big Mac', price: 2, emoji: '🍔', category: 'food' },
  { id: 'flipflops', nameMarathi: 'फ्लिप फ्लॉप्स', nameEnglish: 'Flip Flops', price: 3, emoji: '👡', category: 'food' },
  { id: 'cocacola', nameMarathi: 'कोका-कोला पॅक', nameEnglish: 'Coca-Cola Pack', price: 5, emoji: '🥤', category: 'food' },
  { id: 'movieticket', nameMarathi: 'सिनेमा तिकिट', nameEnglish: 'Movie Ticket', price: 12, emoji: '🎬', category: 'food' },
  { id: 'book', nameMarathi: 'पुस्तक', nameEnglish: 'Book', price: 15, emoji: '📚', category: 'food' },
  { id: 'lobsterdinner', nameMarathi: 'लॉबस्टर डिनर', nameEnglish: 'Lobster Dinner', price: 45, emoji: '🦞', category: 'food' },

  // Technology
  { id: 'videogame', nameMarathi: 'व्हिडिओ गेम', nameEnglish: 'Video Game', price: 60, emoji: '🎮', category: 'tech' },
  { id: 'amazonecho', nameMarathi: 'अमेजन इको', nameEnglish: 'Amazon Echo', price: 99, emoji: '🔊', category: 'tech' },
  { id: 'netflix', nameMarathi: 'नेटफ्लिक्स वर्ष', nameEnglish: 'Year of Netflix', price: 100, emoji: '📺', category: 'tech' },
  { id: 'airjordans', nameMarathi: 'एअर जॉर्डन्स', nameEnglish: 'Air Jordans', price: 125, emoji: '👟', category: 'tech' },
  { id: 'airpods', nameMarathi: 'एअरपॉड्स', nameEnglish: 'AirPods', price: 199, emoji: '🎧', category: 'tech' },
  { id: 'gamingconsole', nameMarathi: 'गेमिंग कंसोल', nameEnglish: 'Gaming Console', price: 299, emoji: '🕹️', category: 'tech' },
  { id: 'drone', nameMarathi: 'ड्रोन', nameEnglish: 'Drone', price: 350, emoji: '🚁', category: 'tech' },
  { id: 'smartphone', nameMarathi: 'स्मार्टफोन', nameEnglish: 'Smartphone', price: 699, emoji: '📱', category: 'tech' },

  // Vehicles
  { id: 'bike', nameMarathi: 'बाइक', nameEnglish: 'Bike', price: 800, emoji: '🚲', category: 'vehicles' },
  { id: 'kitten', nameMarathi: 'मांजर', nameEnglish: 'Kitten', price: 1500, emoji: '🐱', category: 'vehicles' },
  { id: 'puppy', nameMarathi: 'कुत्रे का पिल्ला', nameEnglish: 'Puppy', price: 1500, emoji: '🐶', category: 'vehicles' },
  { id: 'autorickshaw', nameMarathi: 'ऑटो रिक्शा', nameEnglish: 'Auto Rickshaw', price: 2300, emoji: '🛺', category: 'vehicles' },
  { id: 'horse', nameMarathi: 'घोडा', nameEnglish: 'Horse', price: 2500, emoji: '🐴', category: 'vehicles' },
  { id: 'ford', nameMarathi: 'फोर्ड F-150', nameEnglish: 'Ford F-150', price: 30000, emoji: '🚙', category: 'vehicles' },
  { id: 'tesla', nameMarathi: 'टेस्ला', nameEnglish: 'Tesla', price: 75000, emoji: '🚗', category: 'vehicles' },
  { id: 'monstertruck', nameMarathi: 'मॉन्स्टर ट्रक', nameEnglish: 'Monster Truck', price: 150000, emoji: '🚚', category: 'vehicles' },
  { id: 'ferrari', nameMarathi: 'फेरारी', nameEnglish: 'Ferrari', price: 250000, emoji: '🏎️', category: 'vehicles' },

  // Luxury Items
  { id: 'farmland', nameMarathi: 'एक एकर जमीन', nameEnglish: 'Acre of Farmland', price: 3000, emoji: '🌾', category: 'luxury' },
  { id: 'handbag', nameMarathi: 'डिজाइनर हँडबॅग', nameEnglish: 'Designer Handbag', price: 5500, emoji: '👜', category: 'luxury' },
  { id: 'hottub', nameMarathi: 'हॉट टब', nameEnglish: 'Hot Tub', price: 6000, emoji: '🛁', category: 'luxury' },
  { id: 'wine', nameMarathi: 'लक्जरी वाइन', nameEnglish: 'Luxury Wine', price: 7000, emoji: '🍷', category: 'luxury' },
  { id: 'diamondring', nameMarathi: 'हीरे की अंगूठी', nameEnglish: 'Diamond Ring', price: 10000, emoji: '💍', category: 'luxury' },
  { id: 'jetski', nameMarathi: 'जेट स्की', nameEnglish: 'Jet Ski', price: 12000, emoji: '⛷️', category: 'luxury' },
  { id: 'rolex', nameMarathi: 'रोलेक्स', nameEnglish: 'Rolex', price: 15000, emoji: '⌚', category: 'luxury' },
  { id: 'goldbar', nameMarathi: 'सोने की पट्टी', nameEnglish: 'Gold Bar', price: 700000, emoji: '🏆', category: 'luxury' },

  // Property
  { id: 'home', nameMarathi: 'एकल परिवार घर', nameEnglish: 'Single Family Home', price: 300000, emoji: '🏠', category: 'property' },
  { id: 'mcdonalds', nameMarathi: 'मैकडोनल्ड्स फ्रेंचाइज', nameEnglish: 'McDonalds Franchise', price: 1500000, emoji: '🍟', category: 'property' },
  { id: 'mansion', nameMarathi: 'हवेली', nameEnglish: 'Mansion', price: 45000000, emoji: '🏰', category: 'property' },
  { id: 'skyscraper', nameMarathi: 'गगनचुंबी इमारत', nameEnglish: 'Skyscraper', price: 850000000, emoji: '🏢', category: 'property' },

  // Experiences & Luxury Experiences
  { id: 'superbowlad', nameMarathi: 'सुपर बाउल विज्ञापन', nameEnglish: 'Superbowl Ad', price: 5250000, emoji: '📺', category: 'experiences' },
  { id: 'yacht', nameMarathi: 'यॉट', nameEnglish: 'Yacht', price: 7500000, emoji: '⛵', category: 'experiences' },
  { id: 'abrams', nameMarathi: 'M1 अब्राम्स', nameEnglish: 'M1 Abrams', price: 8000000, emoji: '🪖', category: 'experiences' },
  { id: 'f1car', nameMarathi: 'फॉर्मुला 1 कार', nameEnglish: 'Formula 1 Car', price: 15000000, emoji: '🏁', category: 'experiences' },
  { id: 'helicopter', nameMarathi: 'अपाचे हेलिकॉप्टर', nameEnglish: 'Apache Helicopter', price: 31000000, emoji: '🚁', category: 'experiences' },
  { id: 'movie', nameMarathi: 'फिल्म बनाओ', nameEnglish: 'Make a Movie', price: 100000000, emoji: '🎥', category: 'experiences' },
  { id: 'boeing', nameMarathi: 'बोइंग 747', nameEnglish: 'Boeing 747', price: 148000000, emoji: '✈️', category: 'experiences' },
  { id: 'monalisa', nameMarathi: 'मोना लिसा', nameEnglish: 'Mona Lisa', price: 780000000, emoji: '🎨', category: 'experiences' },
  { id: 'cruiseship', nameMarathi: 'क्रूज शिप', nameEnglish: 'Cruise Ship', price: 930000000, emoji: '🚢', category: 'experiences' },
  { id: 'nbateam', nameMarathi: 'NBA टीम', nameEnglish: 'NBA Team', price: 2120000000, emoji: '🏀', category: 'experiences' },
];

export const INITIAL_MONEY = 100000000000; // $100 billion
