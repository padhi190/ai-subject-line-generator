import * as ContextMenu from '@radix-ui/react-context-menu';
import { createContext, useContext, useEffect } from 'react';
import { useOpenAI } from '../customHook/useOpenAI';

const AIContext = createContext();

function AIContextMenu({userContent, onSelect, children, setLoadingState}) {
  const { callOpenAI, isLoading, error, answer } = useOpenAI('writing');
  useEffect(() => {
   setLoadingState(isLoading);
  },[isLoading])
  return (
    <AIContext.Provider value={{ callOpenAI, isLoading, error, answer, userContent, onSelect }}>
      <ContextMenu.Root isLoading={isLoading}>{children}</ContextMenu.Root>
    </AIContext.Provider>
  );
}

function AIContextMenuContent({children}) {
    return (
        <ContextMenu.Portal>
            <ContextMenu.Content className='bg-white min-w-[200px] shadow shadow-black z-50'>
                {children}
            </ContextMenu.Content>
        </ContextMenu.Portal>
    )
}

function AIContextMenuItem({instruction, children }) {
    const { callOpenAI, isLoading, userContent, onSelect } = useContext(AIContext);

    const handleItemClick = async () => {
        const ans = await callOpenAI({ userContent, instruction });
        onSelect(ans);
    }
   
    return (
        <ContextMenu.Item disabled={isLoading} onClick={handleItemClick} className='flex items-center h-10 px-4 select-none data-[highlighted]:outline-none data-[highlighted]:bg-gray-300'>{children}</ContextMenu.Item>
    )
}

function AIContextSubContent({ children }) {
    return (
            <ContextMenu.Portal>
                <ContextMenu.SubContent className='bg-white min-w-[200px] shadow shadow-black z-50'>
                    {children}
                </ContextMenu.SubContent>
            </ContextMenu.Portal>
    )
}

AIContextMenu.Trigger = ContextMenu.Trigger;
AIContextMenu.Content = AIContextMenuContent;
AIContextMenu.Item = AIContextMenuItem;
AIContextMenu.Label = ContextMenu.Label;
AIContextMenu.Sub = ContextMenu.Sub; 
AIContextMenu.SubTrigger = ContextMenu.SubTrigger;
AIContextMenu.SubContent = AIContextSubContent;

export default AIContextMenu;