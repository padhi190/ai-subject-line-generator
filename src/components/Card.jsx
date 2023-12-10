export default function Card() {
    return <figure className="h-48 max-w-4xl p-8 mt-8 md:flex bg-slate-100 rounded-xl md:p-0">
      <img className="w-24 h-24 mx-auto rounded-full md:w-48 md:h-48 md:rounded-r-none md:rounded-l-xl" src="/pitra.jpeg" alt="" width="384" height="512" />
      <div className="pt-6 space-y-4 text-center md:p-6 md:text-left">
        <blockquote>
          <p className="font-medium text-slate-600 text-md">
          Here&apos;s how it works: We make a request to the OpenAI API (﻿openai.chat.completions.create) to generate subject lines. 
          We also use function calling (available in gpt-3.5-turbo-0613 model) to force openAI return the answer in an array of string format.
          </p>
        </blockquote>
        <figcaption className="font-medium">
          <div className="text-sky-500 dark:text-sky-400">
            Pitra Pamungkas
          </div>
          <div className="text-slate-700 dark:text-slate-500">
            Front End Engineer
          </div>
        </figcaption>
      </div>
    </figure>;
  }