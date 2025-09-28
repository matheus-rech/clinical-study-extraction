/**
 * Test data for clinical study extraction tests
 */

const testFormData = {
  step1: {
    citation: 'Smith J, Doe A, Johnson B. A randomized controlled trial of clinical intervention. Medical Journal. 2023;45(3):123-145.',
    doi: '10.1234/example.2023.123',
    pmid: '12345678',
    journal: 'Medical Journal',
    year: '2023',
    country: 'United States',
    centers: 'Single center',
    funding: 'National Institute of Health (NIH)',
    conflicts: 'No conflicts of interest declared',
    registration: 'NCT01234567'
  },
  
  step2: {
    'eligibility-population': 'Adults aged 18-65 with diagnosed condition',
    'eligibility-intervention': 'Experimental treatment protocol',
    'eligibility-comparator': 'Standard care control group',
    'eligibility-outcomes': 'Primary: symptom reduction; Secondary: quality of life',
    'eligibility-timing': '12-week follow-up period',
    'eligibility-type': 'Randomized controlled trial'
  },
  
  baseline: {
    totalN: '150',
    surgicalN: '75',
    controlN: '75',
    ageMean: '45.2',
    ageSD: '12.8',
    maleN: '82',
    femaleN: '68',
    nihssMean: '8.5',
    gcsMean: '14.2'
  }
};

const mockExtractionData = [
  {
    id: 'ext_test_1',
    fieldName: 'citation',
    text: testFormData.step1.citation,
    page: 1,
    coordinates: { x: 100, y: 150, width: 400, height: 25 },
    method: 'manual',
    timestamp: new Date().toISOString(),
    documentName: 'test-study.pdf'
  },
  {
    id: 'ext_test_2',
    fieldName: 'doi',
    text: testFormData.step1.doi,
    page: 1,
    coordinates: { x: 100, y: 200, width: 200, height: 15 },
    method: 'ai',
    timestamp: new Date().toISOString(),
    documentName: 'test-study.pdf'
  }
];

const mockSystematicReviewData = {
  articles: [
    'Study_001.pdf',
    'Study_002.pdf', 
    'Study_003.pdf'
  ],
  progress: {
    'Study_001.pdf': { status: 'completed', completedFields: 25 },
    'Study_002.pdf': { status: 'in-progress', completedFields: 12 },
    'Study_003.pdf': { status: 'not-started', completedFields: 0 }
  }
};

module.exports = {
  testFormData,
  mockExtractionData,
  mockSystematicReviewData
};