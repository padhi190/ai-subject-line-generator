import { NextRequest, NextResponse } from 'next/server';
import { ai as openai } from '@/lib/ai';

export async function POST(req: NextRequest) {
    try {
        const { toneOfVoice, emailDescription, withEmoji } = await req.json();
        if (!emailDescription || !toneOfVoice)
          throw new Error('No email description or tone of voice supplied');
        const useEmoji = withEmoji ||  toneOfVoice.toLowerCase() === 'quirky' ? true :false;
        const response = await openai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are a helpful email marketing expert that's responsible for creating subject lines that generates high deliverability and open rate. ${useEmoji ? 'Use' : 'Do not use'} emojis in your answer.`,
            },
            {
              role: 'user',
              content: `Help increase open rates by writing a compelling 3 subject lines for an email about: ${emailDescription}. Make the subject line to sound ${toneOfVoice}`,
            },
          ],
          model: 'gpt-3.5-turbo-0613',
          functions: [
            {
              name: 'render_subject_lines',
              parameters: {
                type: 'object',
                properties: {
                  subject_lines: {
                    type: 'array',
                    description: 'array of strings containing the subject lines',
                    items: {
                        type: "string",
                    }
                  },
                },
                required: ['subject_lines'],
              },
            },
          ],
          function_call: { name: 'render_subject_lines' },
        });
    
        const completion = response.choices[0].message;
        console.log('completion', completion)
        const args = JSON.parse(completion.function_call.arguments);
        console.log(args)
        const { subject_lines } = args;
        return NextResponse.json(subject_lines);
      } catch (error) {
        console.log(error)
        throw new Error('Something went wrong')
      }
}