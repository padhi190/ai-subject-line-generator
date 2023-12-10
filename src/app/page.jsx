"use client";

import { useRef, useState } from 'react';
import AISubjectLine from '../components/AISubjectLineModal';
import AISubjectLineDropdown from '../components/AISubjectLineDropdown';
import AIContext from '../components/AISimpleContext.jsx';

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'like a british person', label: 'Overly British' },
  { id: 'quirky', label: 'Quirky' },
  { id: 'conversational', label: 'Conversational' },
  { id: 'inspiring', label: 'Inspiring' },
  { id: 'informative', label: 'Informative' },
  { id: 'authoritative', label: 'Authoritative' },
  { id: 'casual', label: 'Casual' },
];

export default function Home() {
  return (
    <>
    <h1 className='mt-2 ml-20 text-3xl font-bold'>CXMI-113 Email Subject Line Generator using ChatGPT API - Demo</h1>
    <div className="flex flex-col gap-4 mt-4 ml-20">
      <TestCase1 />
      <TestCase2 />
      <TestCase3 />
    </div>
  </>
  )
}

const TestCase1 = () => {
  const [openAIModal, setOpenAIModal] = useState(false);
  const [text, setText] = useState('');
  const handleSelect = (suggestion) => {
    setText(suggestion);
    setOpenAIModal(false);
  };

  return (
    <div className="flex flex-col pb-10 border-b">
      <h2 className="mb-8 text-2xl">AI Subject Line Generator (Modal)</h2>
      <div className="flex items-center gap-1">
        <p className="mr-4">Subject</p>
        <input type='text'
          placeholder="subject line"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          width="500px"
        />
        {/* AI Modal usage*/}
        <AISubjectLine
          onSelect={handleSelect}
          open={openAIModal}
          setOpen={setOpenAIModal}
          toneOfVoices={tones}
        >
          <AISubjectLine.Trigger asChild>
            <button>recommendation</button>
          </AISubjectLine.Trigger>
          <AISubjectLine.Modal>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Subject Line Generator
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Please input keywords to outline your campaign. You may also specify the desired tone of voice for the campaign to further elaborate.
            </p>
            <AISubjectLine.Form>
            </AISubjectLine.Form>
            <AISubjectLine.Suggestions>
              <div className="border-t-[1px] border-gray-500 h-2" />
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Suggestions
              </p>
            </AISubjectLine.Suggestions>
          </AISubjectLine.Modal>
        </AISubjectLine>
      </div>
    </div>
  );
};

const TestCase2 = () => {
  const [openAIModal, setOpenAIModal] = useState(false);
  const [text, setText] = useState('');
  const handleSelect = (suggestion) => {
    setText(suggestion);
    setOpenAIModal(false);
  };
  return (
    <div className="flex flex-col pb-10 border-b">
      <h2 className="mb-8 text-2xl">AI Subject Line Generator (Dropdown)</h2>
      <div className="flex items-center gap-1">
        <p className="mr-4">Subject</p>
        <input type='text'
          placeholder="subject line"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          width="500px"
        />
        {/* AI SubjectLIne popover usage*/}
        <AISubjectLineDropdown
          onSelect={handleSelect}
          open={openAIModal}
          setOpen={setOpenAIModal}
          toneOfVoices={tones}
        >
          <AISubjectLineDropdown.Trigger asChild>
            <button>recommendation</button>
          </AISubjectLineDropdown.Trigger>
          <AISubjectLineDropdown.Popover>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Subject Line Generator
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Please input keywords to outline your campaign. You may also specify the desired tone of voice for the campaign to further elaborate.
            </p>
            <AISubjectLineDropdown.Form>
            </AISubjectLineDropdown.Form>
            <AISubjectLineDropdown.Suggestions>
              <div className="border-t-[1px] border-gray-500 h-2" />
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Suggestions
              </p>
            </AISubjectLineDropdown.Suggestions>
          </AISubjectLineDropdown.Popover>
        </AISubjectLineDropdown>
      </div>
    </div>
  );
};

const TestCase3 = () => {
  const [textAreaVal, setTextAreaVal] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [loading, setLoading] = useState(false);

  const textRef = useRef(null);

  const handleMouseUp = () => {
    let textVal = textRef.current;
    let cursorStart = textVal.selectionStart;
    let cursorEnd = textVal.selectionEnd;
    setSelectedText(textAreaVal.substring(cursorStart, cursorEnd));
  };

  const onSelect = (answer) => {
    console.log('onSelect answer', answer);
    const newText = textAreaVal.replace(selectedText, answer);
    setTextAreaVal(newText);
  };
  return (
    <div className="flex flex-col pb-10 border-b">
      <h2 className="mb-8 text-2xl">AI Writer Assistant (Context Menu)</h2>
      <div className="flex gap-1">
        <p className="mr-4 text-white" style={{ color: 'white' }}>
          Subject
        </p>
        <AIContext
          userContent={selectedText}
          onSelect={onSelect}
          setLoadingState={setLoading}
        >
          <AIContext.Trigger>
            <textarea
              className={`p-4 border border-gray-500 rounded w-[500px] ${
                loading ? 'opacity-50' : ''
              }`}
              rows={12}
              ref={textRef}
              onChange={(e) => setTextAreaVal(e.target.value)}
              value={textAreaVal}
              onMouseUp={handleMouseUp}
            />
          </AIContext.Trigger>
          <AIContext.Content>
            <AIContext.Label className="flex items-center h-10 px-4 text-gray-500 border-b border-gray-300">
              Improve writing
            </AIContext.Label>
            <AIContext.Item instruction="spelling">
              ✓ Check Spelling and Grammar
            </AIContext.Item>
            <AIContext.Item instruction="longer">↓ Make longer</AIContext.Item>
            <AIContext.Item instruction="shorter">
              ↑ Make shorter
            </AIContext.Item>

            <AIContext.Sub>
              <AIContext.SubTrigger className="flex items-center h-10 px-4 select-none data-[highlighted]:outline-none data-[highlighted]:bg-gray-300">
                <div>Change Tone of Voice</div>{' '}
                <div className="ml-auto">&gt;</div>
              </AIContext.SubTrigger>
              <AIContext.SubContent>
                <AIContext.Item instruction="professional">
                  Professional
                </AIContext.Item>
                <AIContext.Item instruction="quirky">Quirky</AIContext.Item>
                <AIContext.Item instruction="conversational">
                  Conversational
                </AIContext.Item>
                <AIContext.Item instruction="authoritative">
                  Authoritative
                </AIContext.Item>
                <AIContext.Item instruction="casual">Casual</AIContext.Item>
              </AIContext.SubContent>
            </AIContext.Sub>
          </AIContext.Content>
        </AIContext>
        <button disabled></button>
      </div>
    </div>
  );
};