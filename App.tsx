import React, { useState, useEffect, useCallback } from 'react';
import KeywordInput from './components/KeywordInput';
import KeywordCard from './components/KeywordCard';
import LoadingSpinner from './components/LoadingSpinner';
import { generateKeywordsAndMetrics } from './services/geminiService';
import { KeywordData } from './types';

// Declare window.aistudio for API key selection functions
// Define the AIStudio interface as expected by the environment or implicit types.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

function App() {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  const checkApiKey = useCallback(async () => {
    try {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keySelected);
      } else {
        // Fallback for environments where aistudio might not be present or fully initialized
        // Assume API_KEY is present from process.env for development/local testing.
        setHasApiKey(!!process.env.API_KEY);
      }
    } catch (e) {
      console.error("Error checking API key availability:", e);
      setHasApiKey(false);
    }
  }, []);

  const selectApiKey = useCallback(async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Assuming key selection was successful to avoid race condition
        setHasApiKey(true);
      } else {
        console.warn("window.aistudio.openSelectKey is not available.");
        setError("API Key selection is not available in this environment. Please ensure process.env.API_KEY is set.");
      }
    } catch (e) {
      console.error("Error opening API key selection:", e);
      setError("Failed to open API key selection. Please try again.");
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to check API key

  const handleGenerateKeywords = useCallback(async (seedKeyword: string, numKeywords: number) => {
    setIsLoading(true);
    setError(null);
    setKeywords([]); // Clear previous results

    try {
      if (!hasApiKey) {
        setError("API Key not selected. Please select your API key to proceed.");
        setIsLoading(false);
        return;
      }
      const generatedKeywords = await generateKeywordsAndMetrics(seedKeyword, numKeywords);
      setKeywords(generatedKeywords);
    } catch (err: any) {
      console.error("Failed to generate keywords:", err);
      // Specific handling for API key related errors
      if (err.message.includes("API Key issue")) {
        setHasApiKey(false); // Prompt user to re-select key
        setError("API Key invalid or expired. Please select your API key again.");
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasApiKey]); // Dependency on hasApiKey to re-evaluate if the key status changes

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        <KeywordInput
          onSubmit={handleGenerateKeywords}
          isLoading={isLoading}
          onApiKeySelect={selectApiKey}
          hasApiKey={hasApiKey}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {keywords.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keywords.map((kw, index) => (
              <KeywordCard key={index} keywordData={kw} />
            ))}
          </div>
        )}

        {!isLoading && keywords.length === 0 && !error && (
          <div className="text-center text-gray-500 text-lg mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p>Start by entering a seed keyword above to begin your research!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;