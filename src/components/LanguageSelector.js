import { useTranslation } from '../i18n/LanguageContext';
import './LanguageSelector.css';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ms', label: 'BM' },
];

function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      className="language-selector"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
