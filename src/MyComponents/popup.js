import React, { useState, useEffect, useRef } from 'react';
import '../App.css'; // We'll create this CSS file with styling

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english'); // Default language
  const messagesEndRef = useRef(null);
  
  // IMPORTANT: Your Groq API key
  const GROQ_API_KEY = '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';

  // Translations for UI elements including Indian regional languages
  const translations = {
    english: {
      welcomeMessage: 'Hello! I am your virtual teaching assistant. How can I help you today?',
      appTitle: 'Virtual Teaching Assistant',
      appSubtitle: 'Your AI-Powered Learning Companion',
      appDescription: 'Ask any question to get instant, helpful explanations on any subject.',
      inputPlaceholder: 'Ask your question...',
      errorMessage: 'Sorry, there was an error processing your request. Please try again later.',
      languageSelector: 'Language'
    },
    hindi: {
      welcomeMessage: 'नमस्ते! मैं आपका वर्चुअल शिक्षण सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
      appTitle: 'वर्चुअल शिक्षण सहायक',
      appSubtitle: 'आपका AI-संचालित शिक्षण साथी',
      appDescription: 'किसी भी विषय पर तत्काल, सहायक स्पष्टीकरण प्राप्त करने के लिए कोई भी प्रश्न पूछें।',
      inputPlaceholder: 'अपना प्रश्न पूछें...',
      errorMessage: 'क्षमा करें, आपके अनुरोध को संसाधित करने में एक त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।',
      languageSelector: 'भाषा'
    },
    bengali: {
      welcomeMessage: 'হ্যালো! আমি আপনার ভার্চুয়াল শিক্ষা সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
      appTitle: 'ভার্চুয়াল শিক্ষা সহকারী',
      appSubtitle: 'আপনার AI-চালিত শিক্ষা সঙ্গী',
      appDescription: 'যেকোনো বিষয়ে তাৎক্ষণিক, সহায়ক ব্যাখ্যা পেতে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।',
      inputPlaceholder: 'আপনার প্রশ্ন জিজ্ঞাসা করুন...',
      errorMessage: 'দুঃখিত, আপনার অনুরোধ প্রক্রিয়া করার সময় একটি ত্রুটি ঘটেছে। পরে আবার চেষ্টা করুন।',
      languageSelector: 'ভাষা'
    },
    tamil: {
      welcomeMessage: 'வணக்கம்! நான் உங்கள் மெய்நிகர் கற்பித்தல் உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      appTitle: 'மெய்நிகர் கற்பித்தல் உதவியாளர்',
      appSubtitle: 'உங்கள் AI-இயக்கப்படும் கற்றல் துணை',
      appDescription: 'எந்த பொருளிலும் உடனடி, பயனுள்ள விளக்கங்களைப் பெற எந்த கேள்வியையும் கேளுங்கள்.',
      inputPlaceholder: 'உங்கள் கேள்வியைக் கேளுங்கள்...',
      errorMessage: 'மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்குவதில் பிழை ஏற்பட்டது. பிறகு மீண்டும் முயற்சிக்கவும்.',
      languageSelector: 'மொழி'
    },
    telugu: {
      welcomeMessage: 'హలో! నేను మీ వర్చువల్ టీచింగ్ అసిస్టెంట్. నేడు నేను మీకు ఎలా సహాయం చేయగలను?',
      appTitle: 'వర్చువల్ టీచింగ్ అసిస్టెంట్',
      appSubtitle: 'మీ AI-ఆధారిత లెర్నింగ్ కంపానియన్',
      appDescription: 'ఏదైనా సబ్జెక్ట్ పై త్వరిత, సహాయకరమైన వివరణలు పొందడానికి ఏదైనా ప్రశ్న అడగండి.',
      inputPlaceholder: 'మీ ప్రశ్నను అడగండి...',
      errorMessage: 'క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో లోపం జరిగింది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.',
      languageSelector: 'భాష'
    },
    marathi: {
      welcomeMessage: 'नमस्कार! मी तुमचा आभासी शिकवणी सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
      appTitle: 'आभासी शिकवणी सहाय्यक',
      appSubtitle: 'तुमचा AI-संचालित शिक्षण साथीदार',
      appDescription: 'कोणत्याही विषयावर त्वरित, उपयुक्त स्पष्टीकरणे मिळवण्यासाठी कोणताही प्रश्न विचारा.',
      inputPlaceholder: 'तुमचा प्रश्न विचारा...',
      errorMessage: 'क्षमस्व, तुमची विनंती प्रक्रिया करताना त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.',
      languageSelector: 'भाषा'
    },
    gujarati: {
      welcomeMessage: 'નમસ્તે! હું તમારો વર્ચ્યુઅલ શિક્ષણ સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
      appTitle: 'વર્ચ્યુઅલ શિક્ષણ સહાયક',
      appSubtitle: 'તમારો AI-સંચાલિત શિક્ષણ સાથી',
      appDescription: 'કોઈપણ વિષય પર તાત્કાલિક, ઉપયોગી સમજૂતી મેળવવા માટે કોઈપણ પ્રશ્ન પૂછો.',
      inputPlaceholder: 'તમારો પ્રશ્ન પૂછો...',
      errorMessage: 'માફ કરશો, તમારી વિનંતી પર પ્રક્રિયા કરવામાં ભૂલ આવી. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.',
      languageSelector: 'ભાષા'
    },
    kannada: {
      welcomeMessage: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವರ್ಚುವಲ್ ಟೀಚಿಂಗ್ ಅಸಿಸ್ಟೆಂಟ್. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      appTitle: 'ವರ್ಚುವಲ್ ಟೀಚಿಂಗ್ ಅಸಿಸ್ಟೆಂಟ್',
      appSubtitle: 'ನಿಮ್ಮ AI-ಆಧಾರಿತ ಕಲಿಕಾ ಸಂಗಾತಿ',
      appDescription: 'ಯಾವುದೇ ವಿಷಯದ ಬಗ್ಗೆ ತಕ್ಷಣದ, ಸಹಾಯಕ ವಿವರಣೆಗಳನ್ನು ಪಡೆಯಲು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.',
      inputPlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
      errorMessage: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಲ್ಲಿ ದೋಷ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      languageSelector: 'ಭಾಷೆ'
    },
    malayalam: {
      welcomeMessage: 'ഹലോ! ഞാൻ നിങ്ങളുടെ വെർച്വൽ ടീച്ചിംഗ് അസിസ്റ്റന്റ് ആണ്. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?',
      appTitle: 'വെർച്വൽ ടീച്ചിംഗ് അസിസ്റ്റന്റ്',
      appSubtitle: 'നിങ്ങളുടെ AI-സഹായത്തോടെയുള്ള പഠന കൂട്ടാളി',
      appDescription: 'ഏത് വിഷയത്തിലും ഉടനടി, സഹായകരമായ വിശദീകരണങ്ങൾ ലഭിക്കാൻ ഏത് ചോദ്യവും ചോദിക്കുക.',
      inputPlaceholder: 'നിങ്ങളുടെ ചോദ്യം ചോദിക്കുക...',
      errorMessage: 'ക്ഷമിക്കണം, നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതിൽ ഒരു പിശക് ഉണ്ടായി. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
      languageSelector: 'ഭാഷ'
    },
    punjabi: {
      welcomeMessage: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਵਰਚੁਅਲ ਟੀਚਿੰਗ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      appTitle: 'ਵਰਚੁਅਲ ਟੀਚਿੰਗ ਅਸਿਸਟੈਂਟ',
      appSubtitle: 'ਤੁਹਾਡਾ AI-ਸੰਚਾਲਿਤ ਸਿੱਖਿਆ ਸਾਥੀ',
      appDescription: 'ਕਿਸੇ ਵੀ ਵਿਸ਼ੇ ਤੇ ਤੁਰੰਤ, ਮਦਦਗਾਰ ਵਿਆਖਿਆਵਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ.',
      inputPlaceholder: 'ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ...',
      errorMessage: 'ਮਾਫ਼ ਕਰਨਾ, ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਨ ਵਿੱਚ ਇੱਕ ਗਲਤੀ ਹੋਈ ਸੀ. ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
      languageSelector: 'ਭਾਸ਼ਾ'
    },
    odia: {
      welcomeMessage: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର ଭର୍ଚୁଆଲ୍ ଶିକ୍ଷାଦାନ ସହାୟକ। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
      appTitle: 'ଭର୍ଚୁଆଲ୍ ଶିକ୍ଷାଦାନ ସହାୟକ',
      appSubtitle: 'ଆପଣଙ୍କର AI-ପରିଚାଳିତ ଶିକ୍ଷଣ ସାଥୀ',
      appDescription: 'ଯେକୌଣସି ବିଷୟରେ ତୁରନ୍ତ, ସହାୟକ ବ୍ୟାଖ୍ୟା ପାଇବା ପାଇଁ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ.',
      inputPlaceholder: 'ଆପଣଙ୍କର ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
      errorMessage: 'କ୍ଷମା କରନ୍ତୁ, ଆପଣଙ୍କର ଅନୁରୋଧ ପ୍ରକ୍ରିୟାକରଣରେ ଏକ ତ୍ରୁଟି ଘଟିଲା. ଦୟାକରି ପରେ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ.',
      languageSelector: 'ଭାଷା'
    }
  };

  // Scroll to bottom of chat whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Add welcome message when component mounts or language changes
    setMessages([{
      role: 'assistant',
      content: translations[language].welcomeMessage
    }]);
  }, [language]);

  // Mapping of selected language to proper SpeechRecognition language code
  const getLangCode = (lang) => {
    switch (lang) {
      case 'english': return 'en-US';
      case 'hindi': return 'hi-IN';
      case 'bengali': return 'bn-IN';
      case 'tamil': return 'ta-IN';
      case 'telugu': return 'te-IN';
      case 'marathi': return 'mr-IN';
      case 'gujarati': return 'gu-IN';
      case 'kannada': return 'kn-IN';
      case 'malayalam': return 'ml-IN';
      case 'punjabi': return 'pa-IN';
      case 'odia': return 'or-IN';
      default: return 'en-US';
    }
  };

  // Function to handle voice-based input using Web Speech API
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode(language);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192', // You can change this to any Groq model
          messages: [
            {
              role: 'system',
              content: `You are a helpful and knowledgeable teaching assistant. 
                        Your goal is to help students learn and understand concepts clearly.
                        Provide detailed explanations when needed, and use examples to illustrate concepts.
                        Be encouraging, patient, and guide students through their learning process.
                        Respond in ${language} language.`
            },
            ...messages,
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error calling Groq API:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: translations[language].errorMessage
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to change language
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Function to render avatars for messages
  const renderAvatar = (role) => {
    if (role === 'assistant') {
      return (
        <div className="avatar assistant-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5" />
            <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="avatar user-avatar">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }
  };

  // Function to format code blocks in messages
  const formatMessageContent = (content) => {
    // Split by code block markers
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const firstLineEnd = part.indexOf('\n');
        const language = part.substring(3, firstLineEnd).trim();
        const code = part.substring(firstLineEnd + 1, part.length - 3).trim();
        
        return (
          <div key={i} className="code-block">
            {language && <div className="code-language">{language}</div>}
            <pre>{code}</pre>
          </div>
        );
      } else {
        // Normal text - split by newlines
        return part.split('\n').map((text, j) => (
          <p key={`${i}-${j}`}>{text}</p>
        ));
      }
    });
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5" />
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1>{translations[language].appTitle}</h1>
          </div>
          <div className="language-selector">
            <label htmlFor="language-select">{translations[language].languageSelector}: </label>
            <select 
              id="language-select" 
              value={language} 
              onChange={handleLanguageChange}
              className="language-select"
            >
              <option value="english">English</option>
              <option value="hindi">हिन्दी (Hindi)</option>
              <option value="bengali">বাংলা (Bengali)</option>
              <option value="tamil">தமிழ் (Tamil)</option>
              <option value="telugu">తెలుగు (Telugu)</option>
              <option value="marathi">मराठी (Marathi)</option>
              <option value="gujarati">ગુજરાતી (Gujarati)</option>
              <option value="kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="malayalam">മലയാളം (Malayalam)</option>
              <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="odia">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>
        </header>

        <div className="app-intro">
          <h2>{translations[language].appSubtitle}</h2>
          <p>{translations[language].appDescription}</p>
        </div>

        <div className="chat-container">
          <div className="message-list">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${message.role === 'assistant' ? 'assistant-wrapper' : 'user-wrapper'}`}
              >
                {renderAvatar(message.role)}
                <div className={`message ${message.role === 'assistant' ? 'assistant-message' : 'user-message'}`}>
                  <div className="message-content">
                    {formatMessageContent(message.content)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant-wrapper">
                {renderAvatar('assistant')}
                <div className="message assistant-message">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-area">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={translations[language].inputPlaceholder}
              className="message-input"
              rows={3}
            />
            <button onClick={handleVoiceInput} className="mic-button">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={handleSendMessage} 
              className="send-button"
              disabled={isLoading}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
