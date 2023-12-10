import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
// import { Button, Radio } from '@uplandsoftware/ui-library';
import { useOpenAI } from '../customHook/useOpenAI';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AIContext = createContext();

function AISubjectLine({ open, setOpen, onSelect, toneOfVoices, children }) {
  const { callOpenAI, isLoading, error, answer } = useOpenAI('subject');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [values, setValues] = useState({toneOfVoice: toneOfVoices[0].label, emailDescription: ''});

  useEffect(() => {
    if (answer) {
      setSubjects(answer);
      setSelectedSubject(answer[0]);
    }
  }, [answer]);

  return (
    <AIContext.Provider
      value={{
        callOpenAI,
        isLoading,
        error,
        answer,
        suggestions: subjects,
        setSuggestions: setSubjects,
        selectedSubject,
        setSelectedSubject,
        values,
        setValues,
        toneOfVoices,
        onSelect,
      }}
    >
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </Dialog.Root>
    </AIContext.Provider>
  );
}

function AISubjectLineModal({ children }) {
  return (
    <>
      <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50" />
      <Dialog.Portal>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 max-w-[600px] rounded-md z-40">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </>
  );
}

function AISubjectLineForm({ children }) {
  const {
    callOpenAI,
    isLoading,
    suggestions,
    values,
    setValues
  } = useContext(AIContext);
  const emptySuggestions = suggestions.length === 0;
  const descriptionRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(values)
    await callOpenAI(values);
  };

  useEffect(() => {
    descriptionRef.current.focus();
  },[])

  return (
    <form onSubmit={handleSubmit}> 
      <fieldset disabled={isLoading} className="flex">
        <ToneOfVoiceSelector toneOfVoice={values['toneOfVoice']} setToneOfVoice={setValues}/>
        <input
          name="emailDescription"
          placeholder="e.g. new launch, game console"
          defaultValue={values['emailDescription']}
          className="flex-1 px-4 py-2 border border-l-0 border-black rounded-r"
          onChange={(e) => setValues((v) => ({...v, emailDescription: e.target.value}))}
          ref={descriptionRef}
        />
      </fieldset>
      {children}
      <div className="mt-5 text-right">
        <Dialog.Close asChild className="mr-4">
          <button disabled={isLoading}>Cancel</button>
        </Dialog.Close>
        <button
          type="submit"
          disabled={isLoading}
          variant={emptySuggestions ? 'contained' : 'outlined'}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );

  function ToneOfVoiceSelector({ toneOfVoice, setToneOfVoice }) {
    const { toneOfVoices } = useContext(AIContext);
    return <Select.Root
      onValueChange={(value) => setToneOfVoice((v) => ({...v, toneOfVoice: value}))}
      value={toneOfVoice}
    >
      <Select.Trigger className="inline-flex items-center justify-center gap-4 px-2 border border-black rounded-l ">
        <Select.Value placeholder="Tone of voice" />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className="bg-white min-w-[200px] shadow shadow-black z-50"
        >
          <Select.Viewport>
          <Select.Group className='mb-4'>
            <Select.Label className='px-4 pt-2 mb-3 text-gray-600'>Tone of Voice</Select.Label>
            <Select.Separator className='h-[1px] bg-gray-300 mb-2' />
            {toneOfVoices.map((tone) => (
              <Select.Item key={tone.id} value={tone.label} className='flex items-center h-10 px-4 select-none data-[highlighted]:outline-none data-[highlighted]:bg-gray-300'>
                <Select.ItemText>{tone.label}</Select.ItemText>
              </Select.Item>
            ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>;
  }
}

function AISubjectLineSuggestions({ children }) {
  const { suggestions, selectedSubject, setSelectedSubject, isLoading, onSelect } =
    useContext(AIContext);
  const emptySuggestions = suggestions.length === 0;

  if (emptySuggestions) return null;

  return (
    <div className={`mt-5 ${isLoading ? 'opacity-50' : ''}`}>
      {children}
      <div className="flex flex-col">
        {!emptySuggestions
          ? suggestions.map((subject) => (
              <input type='radio'
                name="suggestions"
                key={subject}
                label={subject}
                value={subject}
                checked={subject === selectedSubject}
                onChange={() => setSelectedSubject(subject)}
                disabled={isLoading}
              />
            ))
          : null}
      </div>
      <div className="mt-4 text-right">
        <button type="button" onClick={() => onSelect(selectedSubject)} disabled={isLoading}>Select</button>
      </div>
    </div>
  );
}

AISubjectLine.Trigger = Dialog.Trigger;
AISubjectLine.Modal = AISubjectLineModal;
AISubjectLine.Form = AISubjectLineForm;
AISubjectLine.Suggestions = AISubjectLineSuggestions;

export default AISubjectLine;
