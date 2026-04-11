import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import {
  asyncgetflashcards,
  asyncreviewflashcard,
  asynctogglestarflashcard,
  asyncdeleteflashcardset
} from '../../store/actions/flashcardActions';
import { asyncgenerateflashcards } from '../../store/actions/aiActions';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Flashcard from '../../components/flashcards/Flashcard';
import { useDispatch } from 'react-redux';

const FlashcardPage = () => {
  const { id: documentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await dispatch(asyncgetflashcards(documentId));
      const set = Array.isArray(response) ? response[0] : response ?? null;
      setFlashcardSet(set);
      setFlashcards(set?.cards || []);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleNextCard = async () => {
    await handleReview();
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = async () => {
    await handleReview();
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleReview = async () => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;
    try {
      await dispatch(asyncreviewflashcard(currentCard._id));
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
    }
  };

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const success = await dispatch(asyncgenerateflashcards({ documentId }));
      if (success) {
        await fetchFlashcards();
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await dispatch(asynctogglestarflashcard(cardId));
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleDeleteSet = async () => {
    if (!flashcardSet?._id) return;
    setDeleting(true);
    try {
      const success = await dispatch(asyncdeleteflashcardset(flashcardSet._id));
      if (success) {
        setIsDeleteModalOpen(false);
        navigate(`/documents/${documentId}`);
      }
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
    } finally {
      setDeleting(false);
    }
  };

  const renderFlashcardContent = () => {
    if (loading) return <Spinner />;

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet."
          description="Generate flashcards from your document to start learning."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-2xl">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-sm text-neutral-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800"
        >
          <ArrowLeft size={16} /> Back to Document
        </Link>
      </div>

      <PageHeader title="Flashcards">
        <div>
          {!loading && (
            flashcards.length > 0 ? (
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="danger"
                disabled={deleting}
              >
                <Trash2 size={16} /> Delete Set
              </Button>
            ) : (
              <Button
                onClick={handleGenerateFlashcards}
                disabled={generating}
              >
                {generating ? (
                  <Spinner />
                ) : (
                  <>
                    <Plus size={16} /> Generate Flashcards
                  </>
                )}
              </Button>
            )
          )}
        </div>
      </PageHeader>

      {renderFlashcardContent()}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleting && setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <p className="text-neutral-600 mb-6">
          Are you sure you want to delete this flashcard set?{' '}
          <span className="font-medium text-neutral-800">This cannot be undone.</span>
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleDeleteSet}
            disabled={deleting}
          >
            {deleting ? <Spinner /> : <><Trash2 size={16} /> Delete</>}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;