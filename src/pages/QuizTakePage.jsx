import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuizzes } from '../hooks/useQuizzes'
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Trophy } from 'lucide-react'

export default function QuizTakePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quizzes, userResults, submitQuizResult, loading } = useQuizzes()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const quiz = quizzes.find(q => q.id === id)
  const existingResult = userResults.find(r => r.quiz_id === id)
  const questions = quiz?.questions || []

  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(questions.length).fill(-1))
    }
  }, [quiz])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-navy-500">Quiz not found.</p>
        <Link to="/quizzes" className="text-gold-500 mt-4 inline-block">Back to Quizzes</Link>
      </div>
    )
  }

  async function handleSubmit() {
    let correct = 0
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctIndex) correct++
    }
    setScore(correct)
    setSubmitted(true)

    try {
      await submitQuizResult(id, correct, questions.length, answers)
    } catch (err) {
      console.error('Failed to save quiz result:', err)
    }
  }

  function selectAnswer(qIdx, answerIdx) {
    if (submitted) return
    const newAnswers = [...answers]
    newAnswers[qIdx] = answerIdx
    setAnswers(newAnswers)
  }

  // Results view
  if (submitted || existingResult) {
    const displayScore = submitted ? score : existingResult.score
    const displayTotal = submitted ? questions.length : existingResult.total_questions
    const displayAnswers = submitted ? answers : existingResult.answers
    const pct = Math.round((displayScore / displayTotal) * 100)

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy-100 text-center mb-8">
          <Trophy className={`h-16 w-16 mx-auto mb-4 ${pct >= 80 ? 'text-gold-400' : pct >= 60 ? 'text-navy-400' : 'text-navy-300'}`} />
          <h1 className="text-3xl font-bold text-navy-800">{displayScore}/{displayTotal}</h1>
          <p className="text-navy-500 mt-1">{pct}% — {quiz.title}</p>
          <div className="mt-4">
            {pct >= 80 ? (
              <span className="text-green-600 font-medium">Excellent work!</span>
            ) : pct >= 60 ? (
              <span className="text-gold-600 font-medium">Good effort! Keep reading.</span>
            ) : (
              <span className="text-navy-500 font-medium">Review the chapters and try again.</span>
            )}
          </div>
        </div>

        {/* Review answers */}
        <div className="space-y-4">
          {questions.map((q, i) => {
            const userAnswer = displayAnswers?.[i]
            const isCorrect = userAnswer === q.correctIndex
            return (
              <div key={i} className={`bg-white rounded-xl p-5 border ${isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-start gap-2 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="font-medium text-navy-800">{q.text}</p>
                </div>
                <div className="space-y-2 ml-7">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        j === q.correctIndex
                          ? 'bg-green-50 text-green-800 font-medium'
                          : j === userAnswer && j !== q.correctIndex
                            ? 'bg-red-50 text-red-700 line-through'
                            : 'text-navy-500'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                  {q.explanation && (
                    <p className="text-xs text-navy-400 mt-2 italic">{q.explanation}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/quizzes" className="text-gold-500 font-medium hover:text-gold-600">
            Back to Quizzes
          </Link>
        </div>
      </div>
    )
  }

  // Quiz taking view
  const question = questions[currentQ]
  const allAnswered = answers.every(a => a !== -1)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-navy-800">{quiz.title}</h1>
          <span className="text-sm text-navy-500">{currentQ + 1} / {questions.length}</span>
        </div>
        <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 mb-6">
        <p className="text-lg font-medium text-navy-800 mb-6">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(currentQ, i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                answers[currentQ] === i
                  ? 'border-gold-400 bg-gold-50 text-navy-800'
                  : 'border-navy-100 hover:border-navy-200 text-navy-600'
              }`}
            >
              <span className="font-medium text-navy-400 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(i => Math.max(0, i - 1))}
          disabled={currentQ === 0}
          className="flex items-center gap-1 px-4 py-2 text-navy-500 hover:text-navy-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {currentQ < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQ(i => Math.min(questions.length - 1, i + 1))}
            className="flex items-center gap-1 px-4 py-2 text-gold-500 font-medium hover:text-gold-600"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2.5 bg-gold-400 text-navy-900 rounded-lg font-semibold hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  )
}
