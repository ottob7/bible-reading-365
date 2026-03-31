import { useState } from 'react'
import { useQuizzes } from '../../hooks/useQuizzes'
import { Plus, Trash2, Edit3, Eye, EyeOff, Save, X, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function QuizForm({ onSave, onCancel, initial = null }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [questions, setQuestions] = useState(initial?.questions || [])

  function addQuestion() {
    setQuestions(prev => [...prev, {
      text: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: ''
    }])
  }

  function updateQuestion(idx, field, value) {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q))
  }

  function updateOption(qIdx, optIdx, value) {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q
      const options = [...q.options]
      options[optIdx] = value
      return { ...q, options }
    }))
  }

  function removeQuestion(idx) {
    setQuestions(prev => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ title, description, questions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
          placeholder="e.g., Weeks 1-2: Genesis"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
          rows={2}
          placeholder="Brief description of what this quiz covers"
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy-800">Questions ({questions.length})</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-1 text-sm text-gold-500 font-medium hover:text-gold-600"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-navy-50 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-navy-400 bg-navy-100 px-2 py-1 rounded">Q{qIdx + 1}</span>
              <button
                type="button"
                onClick={() => removeQuestion(qIdx)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <input
              type="text"
              value={q.text}
              onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none bg-white"
              placeholder="Enter question text"
            />

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuestion(qIdx, 'correctIndex', optIdx)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      q.correctIndex === optIdx
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-navy-300'
                    }`}
                  >
                    {q.correctIndex === optIdx && '✓'}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={e => updateOption(qIdx, optIdx, e.target.value)}
                    required
                    className="flex-1 px-3 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none bg-white text-sm"
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                  />
                </div>
              ))}
              <p className="text-xs text-navy-400 ml-8">Click the circle to mark the correct answer</p>
            </div>

            <input
              type="text"
              value={q.explanation}
              onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none bg-white text-sm"
              placeholder="Explanation (shown after quiz submission)"
            />
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 text-navy-400 text-sm">
            No questions added yet. Click "Add Question" to get started.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-navy-100">
        <button
          type="submit"
          disabled={questions.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold-400 text-navy-900 rounded-lg font-semibold hover:bg-gold-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          Save Quiz
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2.5 text-navy-500 hover:text-navy-700 transition-colors"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  )
}

export default function AdminQuizPage() {
  const { quizzes, loading, createQuiz, updateQuiz, deleteQuiz } = useQuizzes()
  const [mode, setMode] = useState('list') // 'list', 'create', 'edit'
  const [editingQuiz, setEditingQuiz] = useState(null)

  async function handleCreate(quizData) {
    await createQuiz(quizData)
    setMode('list')
  }

  async function handleUpdate(quizData) {
    await updateQuiz(editingQuiz.id, quizData)
    setMode('list')
    setEditingQuiz(null)
  }

  async function handleTogglePublish(quiz) {
    await updateQuiz(quiz.id, { is_published: !quiz.is_published })
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await deleteQuiz(id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-400 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-navy-400 hover:text-navy-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-navy-800">Manage Quizzes</h1>
          <p className="text-navy-500 text-sm mt-1">Create and manage bi-weekly quizzes</p>
        </div>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-navy-900 rounded-lg font-medium hover:bg-gold-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Quiz
          </button>
        )}
      </div>

      {mode === 'create' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
          <h2 className="text-lg font-bold text-navy-800 mb-4">Create New Quiz</h2>
          <QuizForm onSave={handleCreate} onCancel={() => setMode('list')} />
        </div>
      )}

      {mode === 'edit' && editingQuiz && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100">
          <h2 className="text-lg font-bold text-navy-800 mb-4">Edit Quiz</h2>
          <QuizForm
            initial={editingQuiz}
            onSave={handleUpdate}
            onCancel={() => { setMode('list'); setEditingQuiz(null) }}
          />
        </div>
      )}

      {mode === 'list' && (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-navy-100">
              <p className="text-navy-400">No quizzes created yet.</p>
            </div>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-xl p-5 border border-navy-100 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy-800">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      quiz.is_published ? 'bg-green-100 text-green-700' : 'bg-navy-100 text-navy-500'
                    }`}>
                      {quiz.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {quiz.description && <p className="text-navy-500 text-sm mt-1">{quiz.description}</p>}
                  <p className="text-xs text-navy-400 mt-1">{quiz.questions?.length || 0} questions</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(quiz)}
                    className="p-2 rounded-lg hover:bg-navy-50 text-navy-400 hover:text-navy-600"
                    title={quiz.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {quiz.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { setEditingQuiz(quiz); setMode('edit') }}
                    className="p-2 rounded-lg hover:bg-navy-50 text-navy-400 hover:text-navy-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-navy-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
