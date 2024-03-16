import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);


export const aiprompt = async (prompt: string) : Promise<string | null> => {
  const chatResponse = await client.chat({
    //model: 'mistral-large-latest',
    model: 'mistral-small-latest',
    messages: [
      {
        role: 'user',
        content: prompt,
      }
    ],
  });

  const resp = chatResponse.choices[0].message.content;
  if (!resp) {
    return null;
  }
  console.log("MistralAI Response: " + resp)
  return resp
}