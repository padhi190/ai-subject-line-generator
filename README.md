## AI Subject Line Generator

This Proof of Concept project utilizes the OpenAI chat completion API to generate subject lines based on the user provided description and tone of voice.

### Subject Line Generator

![subject-line-demo](./public/subject-line.gif)

### Writing Assistant
I have also added an AI Writer Assistant feature that can check spelling and grammar, adjust sentence length, and modify the tone of voice.

#### Check Spelling and Grammar

![spelling](./public/spelling.gif)

#### Make Longer

![make-longer](./public/make-longer.gif)

#### Change Tone of Voice

![change-tone](./public/tone-of-voice.gif)

## Tech Stack
- NextJS
- OpenAI
- Radix UI

## Workflow
The implementation of this Proof of Concept is straightforward. It involves creating two endpoints in the NextJS route. One endpoint is a `POST` request to `api/subject` for generating an email subject line, and the other is a `POST` request to `api/writing` for the AI Writing assistant. Both endpoints will make an API call to the OpenAI chat completion API.

![change-tone](./public/workflow.gif)

The actual implementation of this feature is yet to be decided. However, I imagine that the request will pass through the API Gateway, which will invoke a lambda function. This function will then make an API call to the OpenAI API.

![change-tone](./public/future.gif)
