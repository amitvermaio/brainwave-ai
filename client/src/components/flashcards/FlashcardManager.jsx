import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncgetflashcards,
  asyncdeleteflashcardset,
  asyncgetallflashcardsets,
  asyncreviewflashcard,
  asynctogglestarflashcard,
} from '../../store/actions/flashcardActions';
import Spinner from '../common/Spinner';
import Modal from '../common/Modal';
import Flashcard from './Flashcard';
import { asyncgenerateflashcards } from '../../store/actions/aiActions';
import moment from 'moment';

const FlashcardManager = ({ documentId }) => {
  const dispatch = useDispatch();

  const { flashcardsets, status } = useSelector(
    (state) => state.flashcard
  );

  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  useEffect(() => {
    const filteredFlashcards = flashcardsets.filter(
      (f) => f.document?._id === documentId
    );
    setFlashcards(filteredFlashcards);
  }, [documentId, flashcardsets]);

  useEffect(() => {
    if (documentId) {
      dispatch(asyncgetflashcards(documentId));
      dispatch(asyncgetallflashcardsets());
    }
  }, [documentId, dispatch]);

  const handleGenerateFlashcards = async () => {
    setIsGenerating(true);
    try {
      await dispatch(asyncgenerateflashcards({ documentId }));

      await dispatch(asyncgetallflashcardsets());
      await dispatch(asyncgetflashcards(documentId));
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) %
          selectedSet.cards.length
      );
    }
  };

  const handleReview = async () => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
      await dispatch(asyncreviewflashcard(currentCard._id));
    } catch (error) {
      console.error('Error reviewing flashcard:', error);
    }
  };

  const handleToggleStar = async (cardId) => {
    // Optimistically update selectedSet locally first
    setSelectedSet((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      ),
    }));

    try {
      await dispatch(asynctogglestarflashcard(cardId));
      // Sync with server state after success
      await dispatch(asyncgetallflashcardsets());
      const updatedSet = flashcardsets.find((set) => set._id === selectedSet._id);
      if (updatedSet) setSelectedSet(updatedSet);
    } catch (error) {
      console.error('Error toggling star:', error);
      // Revert on failure
      setSelectedSet((prev) => ({
        ...prev,
        cards: prev.cards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        ),
      }));
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!setToDelete) return;

    setDeleting(true);
    try {
      await dispatch(asyncdeleteflashcardset(setToDelete._id));
      setIsDeleteModalOpen(false);
      setSelectedSet(null);

      await dispatch(asyncgetallflashcardsets());
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashCardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
      <div className='space-y-8'>
        {/* back button */}
        <button
          onClick={() => setSelectedSet(null)}
          className='group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200'
        >
          <ArrowLeft
            className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200'
            strokeWidth={2}
          />
          Back to Sets
        </button>

        {/* flashcard displat */}
        <div className='flex flex-col items-center space-y-8'>
          <div className='w-full max-w-2xl'>
            <Flashcard
              flashcard={currentCard}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* navigation control */}
          <div className='flex items-center gap-6'>
            <button
              onClick={handlePrevCard}
              disabled={selectedSet.cards.length <= 1}
              className='group flex items-center gap-2 px-5 h-11 bg-slate-200 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed diabled:bg-slate-100 '
            >
              <ChevronLeft
                className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200'
                strokeWidth={2.5}
              />
              Previous
            </button>

            <div className='px-4 py-2 bg-slate-50 rounded-lg border border-slate-200'>
              <span className='text-sm font-semibold text-slate-700'>
                {currentCardIndex + 1}{" "}
                <span className='text-slate-400 font-normal'> / </span>{" "}
                {selectedSet.cards.length}
              </span>
            </div>

            <button
              onClick={handleNextCard}
              disabled={selectedSet.cards.length <= 1}
              className='min-w-[120px] group flex items-center justify-center gap-2 px-5 h-11 bg-slate-200 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-100'
            >
              Next
              <ChevronRight
                className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200'
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </div>
    )
  };

  const renderSetList = () => {
    if (status === 'loading') {
      return (
        <div className='flex items-center justify-center py-20'>
          <Spinner />
        </div>
      );
    }

    if (flashcardsets.length === 0) {
      return (
        <div className='flex flex-col items-center py-16 px-6'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-bg-emerald-100 to-teal-100 mb-6'>
            <Brain className='w-8 h-8 text-emerald-600' strokeWidth={2} />
          </div>
          <h3 className='text-xl font-semibold text-slate-900 mb-2'>
            No Flashcard yet.
          </h3>
          <p className='text-sm text-slate-500 mb-8 text-center max-w-sm'>
            Generate flashcards from your document to start learning and reinforce your knowledge.
          </p>
          <button
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            className='groupt inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold'
          >
            {isGenerating ? (
              <>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Generating
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4' strokeWidth={2} />
                Generate Flashcard
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900'>
              Your Flashcard Sets
            </h3>
            <p className='text-sm text-slate-500 mt-1'>
              {flashcards.length}{" "}
              {flashcards.length === 1 ? "set" : "sets"} available.
            </p>
          </div>
          <button
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            className='group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:100'
          >
            {isGenerating ? (
              <>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Plus className='w-4 h-4' strokeWidth={1.5} />
                Generate New Set
              </>
            )}
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {flashcards.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className='group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 hover:border-emerald-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50'
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className='absolute top-4 right-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-200 opactity-0 group-hover:opacity-100'
              >
                <Trash2 className='w-4 h-4' strokeWidth={2} />
              </button>

              <div className='space-y-4'>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100'>
                  <Brain className='w-6 h-6 text-emerald-600' strokeWidth={2} />
                </div>

                <div>
                  <h4 className='text-base font-semibold text-slate-900 mb-1'>
                    Flashcard Set
                  </h4>
                  <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                    Created {moment(set.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>

                <div className='flex items-center gap-2 pt-2 border-t border-slate-100'>
                  <div className='px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg'>
                    <span className='text-sm font-semibold text-emerald-700'>
                      {set.cards.length}{" "}
                      {set.cards.length === 1 ? "card" : "cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate/50 p-8">
      {selectedSet ? renderFlashCardViewer() : renderSetList()}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={"Delete Flashcard Set?"}
      >
        <div className='space-y-6'>
          <p className='text-sm text-slate-600'>
            Are you sure you want to delete this flashcard set? This action
            cannot be undone and all cards will be permanently removed.
          </p>
          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className='px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className='px-5 h-11 bg-linear-to-r from-red-500 to-rose-500 hover:bg-rose-600 text-white font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {deleting ? "Deleting..." : "Delete Set"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardManager;