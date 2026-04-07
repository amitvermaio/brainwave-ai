import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncgetquizzes,
  asyncdeletequiz
} from '../../store/actions/quizActions';
import { asyncgeneratequiz } from '../../store/actions/aiActions';
import QuizCard from './QuizCard';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { toast } from 'sonner';

const QuizManager = ({ documentId }) => {
  const dispatch = useDispatch();
  const { quizzes, status } = useSelector((state) => state.quiz);

  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    if (documentId) {
      dispatch(asyncgetquizzes(documentId));
    }
  }, [documentId, dispatch]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      await dispatch(asyncgeneratequiz({ documentId, numQuestions }));
      await dispatch(asyncgetquizzes(documentId));
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      await dispatch(asyncdeletequiz(selectedQuiz._id));
      toast.success(`${selectedQuiz.title || 'Quiz'} deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (status === 'loading') {
      return <Spinner />;
    }

    if (!quizzes || quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Yet."
          description="Generate a quiz from your document to test your knowledge."
        />
      );
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
      <div className='flex justify-end gap-2 mb-4'>
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {renderQuizContent()}

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className='space-y-4'>
          <div>
            <label className='block text-xs font-medium text-neutral-700 mb-1.5'>
              Number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              max={15}
              required
              className='w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent'
            />
          </div>
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={generating}>
              {generating ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Quiz"
      >
        <div className='space-y-4'>
          <p className='text-sm text-neutral-600'>
            Are you sure you want to delete{' '}
            <span className='font-semibold text-neutral-900'>
              {selectedQuiz?.title || 'this quiz'}
            </span>
            ? This action cannot be undone.
          </p>
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className='bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500'
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizManager;