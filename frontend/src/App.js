import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [tone, setTone] = useState('educational');
  const [length, setLength] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [script, setScript] = useState('');
  const [summary, setSummary] = useState('');
  const [seo, setSEO] = useState({});

  const generateScript = async () => {
    try {
      const response = await axios.post('/generate', {
        title, tone, length, language
      });
      setScript(response.data.script);
      setSummary(response.data.summary);

      const seoRes = await axios.post('/seo', { script: response.data.script });
      setSEO(seoRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "script.txt";
    document.body.appendChild(element);
    element.click();
  };

  const getVoiceover = () => {
    axios.post('/voiceover', {
      script, language
    }, { responseType: 'blob' }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `voiceover_${language}.mp3`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="app-container">
      <h1>🎬 YouTube Script Generator</h1>

      <input
        placeholder="Video Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      /><br />

      <select value={tone} onChange={e => setTone(e.target.value)}>
        <option value="educational">Educational</option>
        <option value="entertaining">Entertaining</option>
        <option value="persuasive">Persuasive</option>
      </select><br />

      <select value={length} onChange={e => setLength(e.target.value)}>
        <option value="short">Short</option>
        <option value="medium">Medium</option>
        <option value="long">Long</option>
      </select><br />

      <select value={language} onChange={e => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
      </select><br />

      <div className="button-group">
        <button onClick={generateScript}>Generate</button>
        <button onClick={downloadScript}>Download Script</button>
        <button onClick={getVoiceover}>Get Voiceover</button>
      </div>

      <h2>Generated Script:</h2>
      <textarea rows="15" value={script} readOnly />

      <h3>Summary:</h3>
      <p>{summary}</p>

      <h3>SEO Suggestions:</h3>
      <p><strong>Keywords:</strong> {seo.keywords?.join(', ')}</p>
      <p><strong>Tags:</strong> {seo.tags?.join(', ')}</p>
    </div>
  );
}

export default App;
