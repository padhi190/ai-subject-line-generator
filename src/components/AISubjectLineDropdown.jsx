import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { ChevronDownIcon } from '@radix-ui/react-icons';
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
      <Popover.Root open={open} onOpenChange={setOpen}>
        {children}
      </Popover.Root>
    </AIContext.Provider>
  );
}

function AISubjectLineModal({ children }) {
  return (
    <>
      <Popover.Portal>
        <Popover.Content
          className="bg-white p-5 max-w-[600px] rounded-md z-10 shadow-xl border border-gray-300 "
          align='start'
          sideOffset={5}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
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
    await callOpenAI(values);
  };

  useEffect(() => {
    descriptionRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={isLoading} className="flex">
        <ToneOfVoiceSelector
          toneOfVoice={values['toneOfVoice']}
          setToneOfVoice={setValues}
        />
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
        <Popover.Close asChild className="mr-4">
          <button disabled={isLoading}>
            Cancel
          </button>
        </Popover.Close>
        <button
          type="submit"
          disabled={isLoading}
          className={emptySuggestions ? 'bg-gray-900 text-white' : '' + 'px-4 py-2 rounded-md'}
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );

  function ToneOfVoiceSelector({ toneOfVoice, setToneOfVoice }) {
    const { toneOfVoices } = useContext(AIContext);
    return (
      <Select.Root
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
            className="bg-white min-w-[200px] shadow shadow-black z-20"
          >
            <Select.Viewport>
              <Select.Group className="mb-4">
                <Select.Label className="px-4 pt-2 mb-3 text-gray-600">
                  Tone of Voice
                </Select.Label>
                <Select.Separator className="h-[1px] bg-gray-300 mb-2" />
                {toneOfVoices.map((tone) => (
                  <Select.Item
                    key={tone.id}
                    value={tone.label}
                    className="flex items-center h-10 px-4 select-none data-[highlighted]:outline-none data-[highlighted]:bg-gray-300"
                  >
                    <Select.ItemText>{tone.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  }
}

function AISubjectLineSuggestions({ children }) {
  const {
    suggestions,
    selectedSubject,
    setSelectedSubject,
    isLoading,
    onSelect,
  } = useContext(AIContext);
  const emptySuggestions = suggestions.length === 0;

  if (emptySuggestions) return null;

  return (
    <div className={`mt-5 ${isLoading ? 'opacity-50' : ''}`}>
      {children}
      <RadioGroup.Root className="flex flex-col gap-2.5" defaultValue={selectedSubject}>
        {!emptySuggestions
          ? suggestions.map((subject) => (
              <div className="flex items-center">
                <RadioGroup.Item
                  className="bg-white w-[18px] h-[18px] rounded-full shadow-[0_2px_10px] shadow-gray-900 hover:bg-gray-100 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default"
                  value={subject}
                  id={subject}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[10px] after:h-[10px] after:rounded-[50%] after:bg-gray-500" />
                </RadioGroup.Item>
                <label
                  className="text-sm leading-none pl-[15px]"
                  htmlFor={subject}
                >
                  {subject}
                </label>
              </div>
            ))
          : null}
      </RadioGroup.Root>
      <div className="mt-4 text-right">
        <button
          type="button"
          onClick={() => onSelect(selectedSubject)}
          disabled={isLoading}
          className='bg-gray-700 px-6 py-2 mt-1 text-white rounded-md'
        >
          Select
        </button>
      </div>
    </div>
  );
}

AISubjectLine.Trigger = Popover.Trigger;
AISubjectLine.Popover = AISubjectLineModal;
AISubjectLine.Form = AISubjectLineForm;
AISubjectLine.Suggestions = AISubjectLineSuggestions;

export default AISubjectLine;
