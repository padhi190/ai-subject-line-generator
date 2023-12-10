import { NextRequest, NextResponse } from 'next/server';
import { ai as openai } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { userContent, instruction } = await req.json();
        if (!userContent || !instruction)
          throw new Error('no data or instruction supplied');
  
        const instructionPrompt = {
          spelling: 'Fix content spelling and grammar',
          longer: 'Make content longer. 2 paragraphs if possible.',
          shorter: 'Make content shorter.',
          professional: 'Rewrite content using professional tone of voice',
          quirky: 'Rewrite content using quirky tone of voice',
          conversational: 'Rewrite content using conversational tone of voice',
          authoritative: 'Rewrite content using authoritative tone of voice',
          casual: 'Rewrite content using casual tone of voice',
        }
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are an email marketing expert. Your job is to improve user's writing based on their instruction.`,
            },
            {
              role: 'user',
              content: `${instructionPrompt[instruction]}. content: ${userContent}`,
            },
          ],
          model: 'gpt-3.5-turbo',
        });
        console.log('response', {response})
    
        const completion = response.choices[0].message;
        console.log('completion', completion)
        return NextResponse.json(completion.content)
      } catch (error) {
        console.log(error)
        throw new Error('something went wrong') 
      }
}