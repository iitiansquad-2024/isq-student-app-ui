export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    credentials: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  coverImage: string;
  featured?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const BLOG_CATEGORIES = ['All', 'JEE Strategy', 'NEET Strategy', 'Mathematics', 'Physics', 'Chemistry', 'Study Tips'];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'How to Crack JEE Advanced: A Complete Strategy Guide by IIT Toppers',
    excerpt: 'Discover the proven strategies and techniques used by IIT toppers to crack JEE Advanced. Learn about time management, subject-wise preparation, and common mistakes to avoid.',
    featured: true,
    content: `# Introduction

Cracking JEE Advanced is one of the most challenging academic pursuits in India. With over 2.5 lakh students competing for just 17,000 seats across all IITs, the competition is fierce. However, with the right strategy, dedication, and guidance, you can join the ranks of successful IIT students.

## Understanding JEE Advanced

JEE Advanced is not just about solving problems; it's about thinking analytically, managing time effectively, and staying calm under pressure. The exam tests your conceptual understanding rather than rote learning.

### Key Characteristics:
- **Conceptual Depth**: Questions require deep understanding of fundamental concepts
- **Time Pressure**: 3 hours for each paper with complex multi-step problems
- **Negative Marking**: Incorrect answers can significantly impact your score
- **Unpredictable Pattern**: The exam pattern can vary from year to year

## Subject-wise Strategy

### Physics
Physics in JEE Advanced requires a strong foundation in concepts and mathematical skills.

**Key Topics to Focus:**
- Mechanics (25-30% weightage)
- Electromagnetism (20-25% weightage)
- Modern Physics (15-20% weightage)
- Thermodynamics (10-15% weightage)

**Preparation Tips:**
1. **Conceptual Clarity**: Start with NCERT and understand every concept thoroughly
2. **Problem Solving**: Practice numerical problems from HC Verma and IE Irodov
3. **Visualization**: Use diagrams and graphs to understand physical phenomena
4. **Formula Derivation**: Don't just memorize formulas; understand their derivations

### Chemistry
Chemistry can be your scoring subject if prepared systematically.

**Organic Chemistry:**
- Focus on reaction mechanisms rather than rote learning
- Practice name reactions and their applications
- Understand stereochemistry concepts thoroughly

**Inorganic Chemistry:**
- Create mind maps for periodic trends
- Focus on coordination compounds and metallurgy
- Practice qualitative analysis regularly

**Physical Chemistry:**
- Master numerical problems in thermodynamics and kinetics
- Understand equilibrium concepts deeply
- Practice electrochemistry calculations

### Mathematics
Mathematics requires consistent practice and pattern recognition.

**High-Weightage Topics:**
- Coordinate Geometry (20-25%)
- Calculus (25-30%)
- Algebra (20-25%)
- Trigonometry (15-20%)

**Preparation Strategy:**
1. **Concept Building**: Start with basic concepts and gradually move to advanced topics
2. **Problem Variety**: Solve problems of varying difficulty levels
3. **Speed and Accuracy**: Practice timed tests regularly
4. **Shortcut Techniques**: Learn time-saving methods for calculations

## Time Management Strategy

### Phase 1: Foundation Building (6-8 months)
- Complete NCERT thoroughly for all subjects
- Solve basic problems from standard textbooks
- Focus on concept clarity over speed

### Phase 2: Advanced Preparation (4-6 months)
- Solve previous year questions
- Take regular mock tests
- Identify and work on weak areas

### Phase 3: Final Revision (2-3 months)
- Revise important formulas and concepts
- Solve mock tests under exam conditions
- Focus on time management and accuracy

## Mock Test Strategy

Regular mock tests are crucial for JEE Advanced preparation:

1. **Frequency**: Take 2-3 mock tests per week
2. **Analysis**: Spend equal time analyzing mistakes as taking the test
3. **Time Management**: Practice completing papers within the time limit
4. **Stress Management**: Simulate exam conditions to build mental stamina

## Common Mistakes to Avoid

### During Preparation:
- **Over-reliance on coaching**: Develop self-study habits
- **Ignoring NCERT**: Don't skip basic concepts
- **Lack of revision**: Regular revision is more important than covering new topics
- **Comparing with others**: Focus on your own progress

### During Exam:
- **Rushing through questions**: Read questions carefully
- **Not managing time**: Allocate time for each section
- **Attempting all questions**: Skip difficult questions initially
- **Panic**: Stay calm and composed throughout the exam

## Mental Health and Motivation

Preparing for JEE Advanced can be mentally exhausting. Here's how to stay motivated:

1. **Set realistic goals**: Break down your preparation into smaller, achievable targets
2. **Take breaks**: Regular breaks prevent burnout
3. **Stay positive**: Maintain a positive mindset even during difficult times
4. **Seek support**: Don't hesitate to ask for help from teachers, friends, or family

## Success Stories from IIT Toppers

### Rahul Sharma (AIR 23, IIT Delhi)
*"The key to my success was consistent daily practice and never giving up on difficult topics. I made sure to solve at least 50 problems daily across all subjects."*

### Priya Patel (AIR 45, IIT Bombay)
*"Time management was crucial for me. I practiced solving papers in 2.5 hours instead of 3 hours to build speed and accuracy."*

## Final Tips for Success

1. **Stay Consistent**: Regular study is more effective than intensive cramming
2. **Focus on Weak Areas**: Spend more time on subjects/topics you find difficult
3. **Practice Regularly**: Solve problems daily to maintain problem-solving skills
4. **Stay Updated**: Keep track of any changes in exam pattern or syllabus
5. **Believe in Yourself**: Confidence plays a crucial role in exam performance

## Conclusion

Cracking JEE Advanced requires dedication, smart preparation, and the right mindset. Remember that success is not just about getting into an IIT; it's about developing problem-solving skills and analytical thinking that will serve you throughout your career.

Start your preparation early, stay consistent, and don't lose hope during difficult times. With the right approach and determination, you can achieve your dream of studying at an IIT.

*Good luck with your preparation!*`,
    author: {
      name: 'Rahul Sharma',
      avatar: '/avatars/rahul.jpg',
      bio: 'IIT Delhi Alumnus with expertise in competitive exam preparation. Has mentored over 1000 students to crack JEE Advanced.',
      credentials: 'B.Tech IIT Delhi, AIR 23 JEE Advanced'
    },
    publishedAt: '2024-01-15',
    readTime: 12,
    category: 'JEE Strategy',
    tags: ['JEE Advanced', 'Strategy', 'IIT', 'Preparation', 'Study Tips', 'Time Management'],
    views: 15420,
    likes: 892,
    coverImage: '/blog/jee-strategy.jpg'
  },
  {
    id: '2',
    title: 'NEET 2024: Biology Preparation Tips from Medical College Toppers',
    excerpt: 'Master NEET Biology with expert tips from medical college toppers. Learn effective memorization techniques, important topics, and revision strategies.',
    featured: true,
    content: `# NEET Biology: Your Path to Medical College

Biology is the backbone of NEET preparation, contributing 50% of the total marks. With the right approach, you can master this subject and secure your seat in a top medical college.

## Understanding NEET Biology

NEET Biology is divided into two main sections:
- **Botany** (50 questions, 180 marks)
- **Zoology** (50 questions, 180 marks)

### High-Weightage Topics in Botany:
1. Plant Physiology (15-18%)
2. Genetics and Evolution (12-15%)
3. Ecology and Environment (10-12%)
4. Reproduction in Plants (8-10%)
5. Cell Biology (8-10%)

### High-Weightage Topics in Zoology:
1. Human Physiology (20-25%)
2. Genetics and Evolution (12-15%)
3. Ecology and Environment (10-12%)
4. Reproduction (8-10%)
5. Cell Biology and Biomolecules (8-10%)

## Effective Study Strategies

### 1. NCERT is Your Bible
- Read NCERT textbooks thoroughly, multiple times
- Understand every diagram and its labeling
- Make notes of important points and definitions
- Practice all NCERT exercises and examples

### 2. Memorization Techniques

**For Diagrams:**
- Draw diagrams repeatedly
- Label them from memory
- Use color coding for different parts
- Create flashcards for quick revision

**For Processes:**
- Break down complex processes into steps
- Create flowcharts and mind maps
- Use mnemonics for remembering sequences
- Teach concepts to others to reinforce learning

**For Classifications:**
- Create comparison tables
- Use acronyms and memory tricks
- Practice writing classifications from memory
- Regular revision is key

### 3. Topic-wise Preparation

**Human Physiology:**
- Focus on digestive, circulatory, respiratory, and excretory systems
- Understand hormones and their functions
- Learn about diseases and disorders
- Practice diagram-based questions

**Genetics:**
- Master Mendelian genetics and pedigree analysis
- Understand DNA replication, transcription, and translation
- Learn about genetic disorders
- Practice numerical problems

**Plant Physiology:**
- Focus on photosynthesis and respiration
- Understand plant hormones and their effects
- Learn about mineral nutrition
- Practice experimental-based questions

**Ecology:**
- Understand ecosystem dynamics
- Learn about biodiversity and conservation
- Focus on environmental issues
- Practice application-based questions

## Revision Strategy

### Short-term Revision (Daily):
- Review notes made during the day
- Practice 20-30 MCQs
- Revise one diagram daily
- Quick recall of important points

### Medium-term Revision (Weekly):
- Complete revision of one major topic
- Solve previous year questions
- Take a chapter-wise test
- Update revision notes

### Long-term Revision (Monthly):
- Full syllabus revision
- Take full-length mock tests
- Analyze weak areas
- Update master revision notes

## Common Mistakes to Avoid

1. **Ignoring NCERT**: Never rely solely on reference books
2. **Skipping diagrams**: Diagram-based questions are easy scoring
3. **Not practicing MCQs**: Regular practice improves speed and accuracy
4. **Neglecting current affairs**: Environmental and health-related current affairs are important
5. **Poor time management**: Biology section should be completed in 45-50 minutes

## Memory Retention Tips

1. **Spaced Repetition**: Revise topics at increasing intervals
2. **Active Recall**: Test yourself regularly without looking at notes
3. **Visual Learning**: Use diagrams, charts, and videos
4. **Association**: Link new information with what you already know
5. **Teaching**: Explain concepts to friends or family

## Mock Test Strategy

- Take at least 2-3 full-length tests per week
- Analyze every mistake thoroughly
- Maintain an error log
- Focus on improving accuracy over speed initially
- Gradually work on time management

## Success Mantra

*"Biology is not about memorization; it's about understanding the logic of life. Once you understand the 'why' behind every process, the 'what' becomes easy to remember."*

## Final Tips

1. **Consistency is Key**: Study biology daily, even if for 2-3 hours
2. **Quality over Quantity**: Understand deeply rather than reading superficially
3. **Practice MCQs**: Solve at least 50 MCQs daily
4. **Stay Updated**: Keep track of recent discoveries and medical breakthroughs
5. **Stay Healthy**: Good health is essential for effective studying

Remember, biology can be your strongest subject in NEET if you approach it systematically. Start early, stay consistent, and believe in yourself!`,
    author: {
      name: 'Dr. Priya Patel',
      avatar: '/avatars/priya.jpg',
      bio: 'AIIMS Delhi graduate with a passion for teaching. Has helped hundreds of students crack NEET with top ranks.',
      credentials: 'MBBS AIIMS Delhi, NEET AIR 15'
    },
    publishedAt: '2024-01-12',
    readTime: 10,
    category: 'NEET Strategy',
    tags: ['NEET', 'Biology', 'Medical', 'Tips', 'Preparation'],
    views: 12350,
    likes: 654,
    coverImage: '/blog/neet-biology.jpg'
  },
  {
    id: '3',
    title: 'Mathematics Problem Solving: Advanced Techniques for Competitive Exams',
    excerpt: 'Enhance your mathematical problem-solving skills with advanced techniques. Learn shortcuts, pattern recognition, and efficient calculation methods.',
    content: `# Advanced Mathematics Problem Solving

Mathematics is often considered the most challenging subject in competitive exams. However, with the right techniques and consistent practice, you can master even the toughest problems.

## Understanding Problem Types

### 1. Direct Application Problems
These problems test your understanding of formulas and concepts directly.

**Strategy:**
- Memorize all important formulas
- Understand when to apply which formula
- Practice standard problems regularly

### 2. Multi-concept Problems
These problems require combining multiple concepts.

**Strategy:**
- Break down the problem into smaller parts
- Identify which concepts are being tested
- Solve step by step

### 3. Tricky Problems
These problems have hidden conditions or require creative thinking.

**Strategy:**
- Read the problem carefully multiple times
- Look for hidden information
- Try different approaches
- Verify your answer

## Advanced Techniques

### Pattern Recognition

Many problems can be solved quickly by recognizing patterns:

**Arithmetic Progressions:**
- Sum of first n natural numbers: n(n+1)/2
- Sum of first n odd numbers: n²
- Sum of first n even numbers: n(n+1)

**Geometric Progressions:**
- Recognize when a series is geometric
- Use sum formulas efficiently
- Look for infinite GP patterns

**Number Patterns:**
- Perfect squares and cubes
- Prime number patterns
- Divisibility rules

### Shortcut Methods

**For Algebra:**
- Use algebraic identities efficiently
- Factor before solving
- Substitute values to check answers
- Use graphical interpretation when stuck

**For Geometry:**
- Draw accurate diagrams
- Use symmetry properties
- Apply coordinate geometry when pure geometry is difficult
- Remember special angle values

**For Calculus:**
- Recognize standard forms
- Use properties of limits and derivatives
- Apply integration by parts strategically
- Use substitution effectively

### Time-Saving Techniques

1. **Approximation**: For MCQs, approximate when exact calculation is time-consuming
2. **Elimination**: Rule out obviously wrong options first
3. **Working Backwards**: Start from options when applicable
4. **Dimensional Analysis**: Check if your answer makes sense dimensionally
5. **Special Cases**: Test with simple values first

## Topic-wise Advanced Strategies

### Calculus

**Limits:**
- Master L'Hospital's rule
- Know standard limits by heart
- Use series expansion for difficult limits
- Practice indeterminate forms

**Derivatives:**
- Understand the concept, not just formulas
- Practice chain rule extensively
- Use logarithmic differentiation for complex functions
- Remember derivatives of inverse functions

**Integration:**
- Recognize standard forms
- Master substitution techniques
- Practice integration by parts
- Use properties of definite integrals

### Coordinate Geometry

**Straight Lines:**
- Use parametric forms when appropriate
- Apply distance formulas efficiently
- Use area formulas strategically
- Practice locus problems

**Conic Sections:**
- Understand the standard forms thoroughly
- Use focus-directrix properties
- Apply tangent and normal concepts
- Practice parametric equations

### Algebra

**Quadratic Equations:**
- Use discriminant properties
- Apply Vieta's formulas
- Solve graphically when needed
- Practice word problems

**Sequences and Series:**
- Recognize patterns quickly
- Use sum formulas efficiently
- Apply AM-GM-HM inequalities
- Practice convergence tests

### Trigonometry

**Identities:**
- Memorize all basic identities
- Practice compound angle formulas
- Use transformation formulas
- Apply sum-to-product formulas

**Equations:**
- Use general solutions
- Apply principal value concepts
- Practice multiple angle equations
- Solve graphically when stuck

## Practice Strategy

### Daily Practice (2-3 hours)
- Solve 20-30 problems of varying difficulty
- Focus on one topic at a time
- Maintain a problem-solving journal
- Review mistakes immediately

### Weekly Practice
- Take a topic-wise test
- Solve previous year questions
- Practice mixed problems
- Analyze time spent per problem

### Monthly Practice
- Take full-length mock tests
- Identify weak areas
- Work on speed and accuracy
- Update your formula sheet

## Common Mistakes to Avoid

1. **Calculation Errors**: Always double-check calculations
2. **Sign Mistakes**: Be careful with negative signs
3. **Skipping Steps**: Don't skip steps in complex problems
4. **Not Reading Carefully**: Read the problem statement thoroughly
5. **Giving Up Too Soon**: Try different approaches before giving up

## Mental Math Tips

1. **Square Numbers**: Memorize squares up to 30
2. **Cube Numbers**: Memorize cubes up to 15
3. **Multiplication Tricks**: Learn Vedic math techniques
4. **Division Shortcuts**: Practice mental division
5. **Percentage Calculations**: Master quick percentage methods

## Problem-Solving Framework

1. **Understand**: Read and understand what is being asked
2. **Plan**: Decide which concepts and formulas to use
3. **Execute**: Solve step by step
4. **Verify**: Check if your answer makes sense
5. **Reflect**: Think about alternative methods

## Success Tips

1. **Practice Daily**: Consistency is more important than intensity
2. **Learn from Mistakes**: Maintain an error log
3. **Time Yourself**: Practice under timed conditions
4. **Stay Calm**: Don't panic if you can't solve a problem immediately
5. **Believe in Yourself**: Confidence is key to success

Remember, mathematics is a skill that improves with practice. The more problems you solve, the better you become at recognizing patterns and applying techniques efficiently.

*"In mathematics, you don't understand things. You just get used to them." - John von Neumann*

Keep practicing, stay persistent, and success will follow!`,
    author: {
      name: 'Amit Kumar',
      avatar: '/avatars/amit.jpg',
      bio: 'IIT Bombay alumnus and Mathematics Olympiad Gold Medalist. Passionate about making mathematics accessible to all.',
      credentials: 'B.Tech IIT Bombay, Mathematics Olympiad Gold Medalist'
    },
    publishedAt: '2024-01-10',
    readTime: 15,
    category: 'Mathematics',
    tags: ['Mathematics', 'Problem Solving', 'Techniques', 'Competitive Exams'],
    views: 8920,
    likes: 423,
    coverImage: '/blog/math-techniques.jpg'
  }
];

export const MOCK_QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  '1': [
    {
      question: 'What is the recommended frequency for taking mock tests according to the article?',
      options: ['1-2 tests per week', '2-3 tests per week', '4-5 tests per week', 'Daily tests'],
      correctAnswer: 1
    },
    {
      question: 'Which subject has the highest weightage in JEE Advanced according to the article?',
      options: ['Physics - Mechanics', 'Chemistry - Organic', 'Mathematics - Calculus', 'All have equal weightage'],
      correctAnswer: 2
    },
    {
      question: 'What is the key to success according to Rahul Sharma (AIR 23)?',
      options: ['Studying 12 hours daily', 'Consistent daily practice', 'Joining the best coaching', 'Solving only previous year papers'],
      correctAnswer: 1
    },
    {
      question: 'How long should the Foundation Building phase last?',
      options: ['2-3 months', '4-5 months', '6-8 months', '10-12 months'],
      correctAnswer: 2
    },
    {
      question: 'What is emphasized as more important than covering new topics?',
      options: ['Solving tough problems', 'Regular revision', 'Taking more tests', 'Reading reference books'],
      correctAnswer: 1
    }
  ],
  '2': [
    {
      question: 'What percentage of NEET marks does Biology contribute?',
      options: ['33%', '40%', '50%', '60%'],
      correctAnswer: 2
    },
    {
      question: 'Which topic has the highest weightage in Zoology?',
      options: ['Genetics', 'Human Physiology', 'Ecology', 'Cell Biology'],
      correctAnswer: 1
    },
    {
      question: 'How much time should be allocated for the Biology section in NEET?',
      options: ['30-35 minutes', '45-50 minutes', '60-65 minutes', '75-80 minutes'],
      correctAnswer: 1
    },
    {
      question: 'What is recommended as the primary study material for NEET Biology?',
      options: ['Reference books', 'NCERT textbooks', 'Online videos', 'Coaching notes'],
      correctAnswer: 1
    },
    {
      question: 'How many MCQs should be practiced daily according to the article?',
      options: ['20-30 MCQs', '50 MCQs', '100 MCQs', '150 MCQs'],
      correctAnswer: 1
    }
  ],
  '3': [
    {
      question: 'What is the first step in the Problem-Solving Framework?',
      options: ['Plan', 'Execute', 'Understand', 'Verify'],
      correctAnswer: 2
    },
    {
      question: 'What is the sum of first n odd numbers?',
      options: ['n(n+1)/2', 'n²', 'n(n+1)', '2n-1'],
      correctAnswer: 1
    },
    {
      question: 'How many problems should be solved daily according to the practice strategy?',
      options: ['10-15 problems', '20-30 problems', '40-50 problems', '60-70 problems'],
      correctAnswer: 1
    },
    {
      question: 'Which technique is recommended for complex functions in derivatives?',
      options: ['Chain rule', 'Product rule', 'Logarithmic differentiation', 'Quotient rule'],
      correctAnswer: 2
    },
    {
      question: 'What should you memorize up to for square numbers?',
      options: ['20', '25', '30', '40'],
      correctAnswer: 2
    }
  ]
};
