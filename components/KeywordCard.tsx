import React from 'react';
import { KeywordData, DifficultyLevel, SearchVolumeRange } from '../types';

interface KeywordCardProps {
  keywordData: KeywordData;
}

const getDifficultyColor = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case 'Low':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Very High':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getVolumeColor = (volume: SearchVolumeRange) => {
  if (volume === '100K+' || volume === '10K-100K') {
    return 'bg-indigo-100 text-indigo-800';
  }
  if (volume === '1K-10K') {
    return 'bg-blue-100 text-blue-800';
  }
  if (volume === '100-1K') {
    return 'bg-sky-100 text-sky-800';
  }
  return 'bg-gray-100 text-gray-800';
};


const KeywordCard: React.FC<KeywordCardProps> = ({ keywordData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-3 break-words">
        {keywordData.keyword}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(keywordData.difficulty)}`}>
          Difficulty: {keywordData.difficulty}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVolumeColor(keywordData.searchVolume)}`}>
          Search Volume: {keywordData.searchVolume}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Content Ideas:</h4>
        {keywordData.contentIdeas.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600 space-y-1 pl-2">
            {keywordData.contentIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No content ideas provided.</p>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">SERP Features:</h4>
        {keywordData.serpFeatures.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywordData.serpFeatures.map((feature, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {feature}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No specific SERP features noted.</p>
        )}
      </div>
    </div>
  );
};

export default KeywordCard;
