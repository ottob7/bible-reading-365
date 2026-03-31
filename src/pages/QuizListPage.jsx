import { Link } from 'react-router-dom'
import { useQuizzes } from '../hooks/useQuizzes'
import { ClipboardList, CheckCircle, ArrowRight } from 'lucide-react'

export default function QuizListPage() {
  const { quizzes, userResults, loading } = useQuizzes()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  const completedQuizIds = new Set(userResults.map(r => r.quiz_id))

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy-800 mb-2">Quizzes</h1>
      <p className="text-navy-500 text-sm mb-8">Test your knowledge of what you've been reading</p>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
          <ClipboardList className="h-12 w-12 text-navy-200 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-navy-600">No quizzes yet</h2>
          <p className="text-navy-400 text-sm mt-2">Check back later — quizzes will be posted bi-weekly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => {
            const isCompleted = completedQuizIds.has(quiz.id)
            const result = userResults.find(r => r.quiz_id === quiz.id)

            return (
              <Link
                key={quiz.id}
                to={`/quizzes/${quiz.id}`}
                className={`block bg-white rounded-xl p-5 border transition-all hover:shadow-md ${
                  isCompleted ? 'border-green-200' : 'border-navy-100 hover:border-gold-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-navy-800">{quiz.title}</h3>
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                    {quiz.description && (
                      <p className="text-navy-500 text-sm mt-1">{quiz.description}</p>
                    )}
                    <div className="text-xs text-navy-400 mt-2">
                      {quiz.questions?.length || 0} questions
                      {isCompleted && result && (
                        <span className="ml-3 text-green-600 font-medium">
                          Score: {result.score}/{result.total_questions}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-navy-300 flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
