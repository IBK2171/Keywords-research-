export interface KeywordData {
  keyword: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Very High';
  searchVolume: '0-10' | '10-100' | '100-1K' | '1K-10K' | '10K-100K' | '100K+';
  contentIdeas: string[];
  serpFeatures: string[];
}

export type DifficultyLevel = KeywordData['difficulty'];
export type SearchVolumeRange = KeywordData['searchVolume'];
