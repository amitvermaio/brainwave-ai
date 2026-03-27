import { useState } from 'react'
import { useParams } from 'react-router-dom';
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncgeneratesummary, asyncexplainconcept } from '../../store/actions/aiActions';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Modal from '../common/Modal';

const AiActions = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [concept, setConcept] = useState('');
  const { summary } = useSelector((state) => state.document);

  const handleGenerateSummary = async () => {
    setLoadingAction('summary');
    try {
      await dispatch(asyncgeneratesummary(id));
      setModalTitle('Document Summary');
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = () => {
    if (!concept.trim()) {
      alert('Please enter a concept to explain.');
      return;
    }
    setLoadingAction('explain');
    try {
      dispatch(asyncexplainconcept(id, concept)).then((explanation) => {
        setModalTitle(`Explanation of "${concept}"`);
        setModalContent(explanation);
        setIsModalOpen(true);
      });
    } catch (error) {
      console.error('Error explaining concept:', error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden '>
        <div className='px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white-50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center justify-center'>
              <Sparkles className='w-5 h-5 text-white' strokeWidth={2} />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>
                AI Assistant
              </h3>
              <p className='text-xs text-slate-600'>Powered by GOOGLE GEMINI</p>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          {/* generate summary */}
          <div className='group p-5 bg-linear-to-br from-slate-50/50 to-white-50 rounded-lg border border-slate-200/60 hover:bg-white/70 transition-colors'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center'>
                    <BookOpen className='w-4 h-4 text-blue-600' strokeWidth={2} />
                  </div>
                  <h4 className='font-semibold text-slate-900'>
                    Generate Summary
                  </h4>
                </div>
                <p className='text-sm text-slate-600 leading-relaxed'>
                  Get a concise overview of the document's main points.
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === 'summary'}
                className='shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-110'
              >
                {loadingAction === 'summary' ? (
                  <span className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                      Loading...
                    </div>
                  </span>
                ): (
                  "Summarize"
                )}
              </button>
            </div>
          </div>

          {/* explain concept */}
          <div className='group p-5 bg-linear-to-br from-slate-50/50 to-white-50 rounded-lg border border-slate-200/60 hover:bg-white/70 transition-colors'>
            <form onSubmit={handleExplainConcept}>
              <div className='flex items-center gap-2 mb-3'>
                <div className='w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center'>
                  <Lightbulb
                    className='w-4 h-4 text-amber-600'
                    strokeWidth={2}
                  />
                </div>
                <h4 className='font-semibold text-slate-900'>
                  Explain a Concept
                </h4>
              </div>
              <p className='text-sm text-slate-600 leading-relaxed mb-4'>
                Enter a topic or concept from the document to get a detailed explanation.
              </p>
              <div className='flex items-center gap-3'>
                <input 
                  type="text" 
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="e.g., What is Fine Tuning?"
                  className='flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-purple-500/10'
                  disabled={loadingAction === 'explain'}
                />
                <button
                  type='submit'
                  disabled={loadingAction === 'explain' || !concept.trim()}
                  className='shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-110'
                >
                  {loadingAction === 'explain' ? (
                    <span className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                        Loading...
                      </div>
                    </span>
                  ) : (
                    "Explain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* result modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className='max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate'>
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  )
}

export default AiActions;