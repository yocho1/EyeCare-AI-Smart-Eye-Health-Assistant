/**
 * Learning modules page
 */
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export function LearningPage() {
  const { request, loading } = useApi();
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    fetchModules();
    fetchProgress();
  }, [request]);

  const fetchModules = async () => {
    try {
      const data = await request(apiService.getAllModules());
      setModules(data);
    } catch (err) {
      console.log('Error fetching modules:', err);
    }
  };

  const fetchProgress = async () => {
    try {
      const data = await request(apiService.getLearningProgress());
      const progressMap = {};
      data.forEach((p) => {
        progressMap[p.module_id] = p;
      });
      setProgress(progressMap);
    } catch (err) {
      console.log('No progress yet');
    }
  };

  const handleQuizSubmit = async () => {
    if (quizAnswers.length === 0) {
      alert('Please answer all questions');
      return;
    }

    try {
      const result = await request(
        apiService.submitQuiz(activeModule.id, quizAnswers)
      );
      setQuizResult(result);
      fetchProgress();
    } catch (err) {
      console.log('Error submitting quiz:', err);
    }
  };

  if (!activeModule) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">📚 Learning Modules</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  setActiveModule(module);
                  setQuizAnswers([]);
                  setQuizResult(null);
                }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>

                  {progress[module.id] && (
                    <div className="bg-green-50 p-3 rounded mb-4">
                      <p className="text-sm font-bold text-green-700">
                        ✅ Completed
                      </p>
                      {progress[module.id].quiz_score && (
                        <p className="text-sm text-green-600">
                          Score: {progress[module.id].quiz_score}%
                        </p>
                      )}
                    </div>
                  )}

                  <button className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600 transition">
                    📖 Read & Learn
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Module view
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setActiveModule(null);
            setQuizResult(null);
          }}
          className="mb-6 text-blue-500 hover:text-blue-700 font-bold"
        >
          ← Back to Modules
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">{activeModule.title}</h1>

          {!quizResult ? (
            <div>
              <div
                className="prose prose-sm max-w-none mb-6 whitespace-pre-wrap text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: activeModule.content
                    .replace(/\n/g, '<br>')
                    .replace(/## (.*?)<br>/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                    .replace(/### (.*?)<br>/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*?)<br>/g, '<li class="ml-4">$1</li>'),
                }}
              />

              {activeModule.quiz_questions && activeModule.quiz_questions.length > 0 && (
                <div className="mt-8 pt-6 border-t">
                  <h2 className="text-2xl font-bold mb-4">📝 Quick Quiz</h2>

                  {activeModule.quiz_questions.map((q, qIdx) => (
                    <div key={qIdx} className="mb-6 bg-gray-50 p-4 rounded">
                      <p className="font-bold mb-3">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question_${qIdx}`}
                              value={oIdx}
                              checked={quizAnswers[qIdx] === oIdx}
                              onChange={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qIdx] = oIdx;
                                setQuizAnswers(newAnswers);
                              }}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuizSubmit}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-3 rounded font-bold hover:bg-green-600 disabled:bg-gray-300 transition"
                  >
                    {loading ? '⏳ Checking...' : '✅ Submit Quiz'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 p-6 rounded">
              <div className="text-center">
                <div className="text-5xl mb-4">
                  {quizResult.passed ? '🎉' : '📚'}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {quizResult.passed ? 'Great Job!' : 'Keep Learning!'}
                </h2>
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {quizResult.score}%
                </p>
                <p className="text-gray-700 mb-6">{quizResult.feedback}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setActiveModule(null);
                      setQuizResult(null);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600"
                  >
                    Back to Modules
                  </button>
                  <button
                    onClick={() => {
                      setQuizAnswers([]);
                      setQuizResult(null);
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded font-bold hover:bg-green-600"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
