import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { asyncgetdocumentbyid } from '../../store/actions/documentActions';
import Spinner from '../../components/common/Spinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/chat/ChatInterface';
import AiActions from '../../components/ai/AiActions';

const DocumentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentdocument: document, currentdocumentLoading: loading } = useSelector((state) => state.document);
  const [activeTab, setActiveTab] = React.useState('Content');

  React.useEffect(() => {
    if (id) {
      dispatch(asyncgetdocumentbyid(id));
    }
  }, [id, dispatch]);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document) {
      return <div className='text-center p-8'>No document found.</div>;
    }

    return (
      <div className='bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm'>
        <div className='flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50'>
          <span className='font-medium text-sm text-gray-700'>Document Viewer</span>
          <a
            href={document.fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors'
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>
        <div className='bg-gray-100 p-1'>
          <iframe
            src={document.fileUrl}
            frameBorder="0"
            className='w-full h-[70vh] bg-white rounded border border-gray-300'
            title='Document Viewer'
            style={{
              colorScheme: 'light',
            }}
          >
          </iframe>
        </div>
      </div>
    )
  }

  const renderChat = () => {
    return <ChatInterface />;
  }

  const renderAIActions = () => {
    return <AiActions />;
  }

  const renderFlashcardsTab = () => {
    return "Render flashcards here";
  }

  const renderQuizzesTab = () => {
    return "Render quizzes here";
  }

  const tabs = [
    { name: 'Content', label: 'Content', render: renderContent() },
    { name: 'Chat', label: 'Chat', render: renderChat() },
    { name: 'AIActions', label: 'AI Actions', render: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', render: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', render: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return (
      <div className='text-center p-8'>
        <p>No document found.</p>
        <Link to="/documents" className=''>
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className='mb-4'>
        <Link to="/documents" className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
        <PageHeader title={document.title} />
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}

export default DocumentDetails