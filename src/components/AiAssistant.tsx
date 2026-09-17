import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MapPin, 
  Navigation, 
  ShieldAlert, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, Language, Facility } from '../types';
import { translations } from '../utils/translations';
import { soundFx } from '../utils/audio';

interface AiAssistantProps {
  facilities: Facility[];
  language: Language;
  onShowRoute: () => void;
  onSelectFacilityById: (id: string) => void;
  onOpenSos: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  facilities,
  language,
  onShowRoute,
  onSelectFacilityById,
  onOpenSos,
}) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text:
        language === 'hi'
          ? 'प्रणाम! मैं कुंभ सहायक हूँ। मैं आपको निकटतम शौचालय, पेयजल बूथ, चिकित्सा शिविर और रामकुंड का सुरक्षित मार्ग बता सकता हूँ। पूछिए!'
          : language === 'mr'
          ? 'नमस्कार! मी कुंभ सहाय्यक आहे. मी आपल्याला जवळचे शौचालय, पिण्याचे पाणी, वैद्यकीय मदत आणि रामकुंडाचा सुरक्षित मार्ग सांगू शकतो. विचारा!'
          : 'Namaste! I am Kumbh Sahayak. Ask me about nearest toilets, drinking water, medical posts, food langar, or the safe route to Ramkund Ghat.',
      timestamp: 'Just now',
    },
  ]);

  const toggleOpen = () => {
    soundFx.playClick();
    setIsOpen(!isOpen);
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    soundFx.playClick();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate keyword-matching response
    setTimeout(() => {
      const lower = query.toLowerCase();
      let botReply = '';
      let action: ChatMessage['suggestedAction'] = undefined;

      if (lower.includes('toilet') || lower.includes('washroom') || lower.includes('शौचालय') || lower.includes('संडास')) {
        const toilet = facilities.find((f) => f.type === 'toilet') || facilities[9];
        botReply =
          language === 'hi'
            ? `निकटतम बायो-शौचालय: ${toilet.name.hi} (${toilet.coords.sector}) है। यह आपसे ${toilet.distance} (${toilet.walkTime}) की दूरी पर स्थित है। निरंतर सफाई व पानी उपलब्ध है।`
            : language === 'mr'
            ? `जवळचे बायो-शौचालय: ${toilet.name.mr} (${toilet.coords.sector}) आहे. हे आपल्यापासून ${toilet.distance} (${toilet.walkTime}) अंतरावर आहे. २४ तास मोफत.`
            : `Nearest sanitation facility is ${toilet.name.en} in ${toilet.coords.sector}. It is only ${toilet.distance} away (~${toilet.walkTime}). Equipped with 40 clean bio-units.`;
        action = {
          type: 'open_map',
          payload: toilet.id,
          label: 'Pin on Map',
        };
      } else if (
        lower.includes('water') ||
        lower.includes('drink') ||
        lower.includes('जल') ||
        lower.includes('पानी') ||
        lower.includes('पाणी')
      ) {
        const water = facilities.find((f) => f.type === 'water') || facilities[7];
        botReply =
          language === 'hi'
            ? `स्वच्छ शीतल पेयजल: ${water.name.hi} (${water.coords.sector}) में उपलब्ध है। यह केवल ${water.distance} पर है। निःशुल्क आरओ मिनरल वॉटर।`
            : language === 'mr'
            ? `थंड व शुद्ध पिण्याचे पाणी: ${water.name.mr} (${water.coords.sector}) येथे उपलब्ध आहे. हे ${water.distance} अंतरावर आहे.`
            : `Safe drinking water is available at ${water.name.en} (${water.coords.sector}), located ${water.distance} away (~${water.walkTime}). UV+RO filtered mineral water.`;
        action = {
          type: 'open_map',
          payload: water.id,
          label: 'View Water Kiosk',
        };
      } else if (
        lower.includes('doctor') ||
        lower.includes('medical') ||
        lower.includes('hospital') ||
        lower.includes('दवा') ||
        lower.includes('चिकित्सा') ||
        lower.includes('रुग्णालय') ||
        lower.includes('डॉक्टर')
      ) {
        const med = facilities.find((f) => f.type === 'medical') || facilities[3];
        botReply =
          language === 'hi'
            ? `आपातकालीन चिकित्सा: ${med.name.hi} चौबीसों घंटे सक्रिय है (${med.distance})। जीवन रक्षक एम्बुलेंस व 108 सेवा तैनात है। हेल्पलाइन: 108.`
            : language === 'mr'
            ? `तातडीची वैद्यकीय मदत: ${med.name.mr} २४ तास उपलब्ध (${med.distance}). रुग्णवाहिका सज्ज आहे. हेल्पलाइन: १०८.`
            : `Immediate medical care is active at ${med.name.en} (${med.distance}, ~${med.walkTime}). 24x7 ICU trauma staff and ambulances stationed. Helpline: 108.`;
        action = {
          type: 'open_map',
          payload: med.id,
          label: 'Locate Medical Post',
        };
      } else if (
        lower.includes('route') ||
        lower.includes('ramkund') ||
        lower.includes('ghat') ||
        lower.includes('snan') ||
        lower.includes('रास्ता') ||
        lower.includes('मार्ग') ||
        lower.includes('रामकुंड')
      ) {
        botReply =
          language === 'hi'
            ? `रामकुंड मुख्य मार्ग पर भारी भीड़ (92% क्षमता) है! कृपया 'भीड़-मुक्त सुरक्षित मार्ग' (Crowd-Aware Route) चुनें जो आपको उत्तरी नदी तट से बिना जाम के 15 मिनट में पहुँचाएगा।`
            : language === 'mr'
            ? `रामकुंड चौकात प्रचंड गर्दी (९२% क्षमता) आहे! कृपया 'गर्दी-मुक्त सुरक्षित मार्ग' निवडा जो आपल्याला उत्तर नदीकाठावरून १५ मिनिटांत विनाअडथळा पोहोचवेल.`
            : `Ramkund Chawk is currently heavily congested (92% capacity hold). We strongly recommend switching to the 'Crowd-Aware Route' along the northern river promenade (15 min safe walk).`;
        action = {
          type: 'route',
          label: 'View Crowd-Aware Route',
        };
      } else if (
        lower.includes('food') ||
        lower.includes('langar') ||
        lower.includes('prasad') ||
        lower.includes('भोजन') ||
        lower.includes('खाना') ||
        lower.includes('अन्नछत्र') ||
        lower.includes('महाप्रसाद')
      ) {
        const food = facilities.find((f) => f.type === 'food') || facilities[5];
        botReply =
          language === 'hi'
            ? `निःशुल्क सात्विक महाप्रसाद: ${food.name.hi} में निरंतर वितरित किया जा रहा है (${food.distance})। समय: सुबह 6 से रात 11:30 बजे तक।`
            : language === 'mr'
            ? `मोफत सात्विक महाप्रसाद: ${food.name.mr} येथे अखंड सुरू आहे (${food.distance}). वेळ: सकाळी ६ ते रात्री ११:३०.`
            : `Continuous free Satvik Mahaprasad is served at ${food.name.en} (${food.distance} away). Pure hot meals: Khichdi, Puri Sabzi, and Sheera.`;
        action = {
          type: 'open_map',
          payload: food.id,
          label: 'Show Annakshetra',
        };
      } else if (
        lower.includes('sos') ||
        lower.includes('emergency') ||
        lower.includes('help') ||
        lower.includes('मदद') ||
        lower.includes('सहायता') ||
        lower.includes('आपत्कालीन')
      ) {
        botReply =
          language === 'hi'
            ? `यदि आप किसी आपात स्थिति में हैं, तो तुरंत शीर्ष पर स्थित लाल 'आपातकालीन SOS' बटन दबाएं। आपका जीपीएस स्थान सीधे नियंत्रण कक्ष को भेजा जाएगा!`
            : language === 'mr'
            ? `आपण संकटात असल्यास त्वरित लाल 'तातडीचा SOS' बटण दाबा. आपले स्थान नियंत्रण कक्षाला थेट पाठवले जाईल!`
            : `If you or someone nearby is in distress, tap the EMERGENCY SOS button immediately. Your coordinates will alert the rapid response team!`;
        action = {
          type: 'sos',
          label: 'Trigger SOS Alert',
        };
      } else if (lower.includes('arti') || lower.includes('time') || lower.includes('आरती') || lower.includes('तारीख')) {
        botReply =
          language === 'hi'
            ? `पवित्र गोदावरी महाआरती: प्रातः 6:30 बजे और सायं 7:00 बजे रामकुंड घाट पर होती है। आरती के समय अतिरिक्त भीड़ नियंत्रण दल तैनात रहता है।`
            : language === 'mr'
            ? `पवित्र गोदावरी महाआरती: सकाळी ६:३० आणि संध्याकाळी ७:०० वाजता रामकुंड घाटावर होते. वेळेआधी पोहोचण्याचा प्रयत्न करा.`
            : `Sacred Godavari Maha Aarti occurs daily at 6:30 AM (Sunrise) and 7:00 PM (Sunset) at Ramkund Ghat. Arrive 20 mins early for seated darshan.`;
      } else {
        botReply =
          language === 'hi'
            ? `मैं आपकी सहायता के लिए तैयार हूँ। आप मुझसे 'शौचालय', 'पेयजल', 'चिकित्सा केंद्र', 'महाप्रसाद', या 'रामकुंड का सुरक्षित मार्ग' के बारे में पूछ सकते हैं।`
            : language === 'mr'
            ? `मी आपल्याला माहिती देण्यासाठी सज्ज आहे. आपण 'शौचालय', 'पिण्याचे पाणी', 'डॉक्टर', 'महाप्रसाद' किंवा 'रामकुंड सुरक्षित रस्ता' याबद्दल विचारू शकता.`
            : `I am here to guide you during Kumbh 2026. Try asking about "nearest toilet", "drinking water", "medical tent", "free food", or "safe route to Ramkund".`;
      }

      soundFx.playClick();
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: 'Just now',
          suggestedAction: action,
        },
      ]);
    }, 350);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    soundFx.playClick();
    if (action.type === 'route') {
      onShowRoute();
      setIsOpen(false);
    } else if (action.type === 'open_map' && action.payload) {
      onSelectFacilityById(action.payload);
      setIsOpen(false);
    } else if (action.type === 'sos') {
      onOpenSos();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="open-ai-chat-btn"
          onClick={toggleOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#881337] via-[#B91C1C] to-orange-600 hover:from-[#701A75] hover:to-orange-500 text-white font-bold text-xs shadow-2xl shadow-rose-950/60 border-2 border-amber-400 cursor-pointer active:scale-95 transition-all group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-serif tracking-wide">{t.aiAssistantTitle}</span>
        </button>
      )}

      {/* Slide-out Chat Window */}
      {isOpen && (
        <div 
          id="ai-assistant-modal"
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[380px] max-h-[580px] h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-amber-500/40 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4C0519] to-[#881337] px-4 py-3 text-white flex items-center justify-between border-b border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-amber-100 flex items-center gap-1.5">
                  <span>{t.aiAssistantTitle}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[10px] text-amber-200/80">Offline Mela Assistant • Instant Local Data</p>
              </div>
            </div>

            <button
              id="close-ai-chat-btn"
              onClick={toggleOpen}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-amber-50/80 border-b border-amber-200/60 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend(t.aiQuickPrompt1)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition-colors font-medium cursor-pointer shadow-xs"
            >
              🚻 {t.aiQuickPrompt1}
            </button>
            <button
              onClick={() => handleSend(t.aiQuickPrompt2)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition-colors font-medium cursor-pointer shadow-xs"
            >
              🚶 {t.aiQuickPrompt2}
            </button>
            <button
              onClick={() => handleSend(t.aiQuickPrompt3)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition-colors font-medium cursor-pointer shadow-xs"
            >
              🍲 {t.aiQuickPrompt3}
            </button>
            <button
              onClick={() => handleSend(t.aiQuickPrompt4)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition-colors font-medium cursor-pointer shadow-xs"
            >
              🩺 {t.aiQuickPrompt4}
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FCFBF8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Contextual Action Button */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction)}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      {msg.suggestedAction.type === 'route' && <Navigation className="w-3.5 h-3.5" />}
                      {msg.suggestedAction.type === 'open_map' && <MapPin className="w-3.5 h-3.5" />}
                      {msg.suggestedAction.type === 'sos' && <ShieldAlert className="w-3.5 h-3.5" />}
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              id="ai-assistant-input"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.aiAssistantPlaceholder}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              id="ai-assistant-send-btn"
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
