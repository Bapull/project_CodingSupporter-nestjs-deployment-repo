import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate, FewShotPromptTemplate } from "@langchain/core/prompts";
import { response } from "express";
const model = new ChatOpenAI({
  model:'gpt-4',
  openAIApiKey:'your-api-key'
});
const parser = new StringOutputParser();
// const messages = [
//   new SystemMessage("당신은 친절한 도우미입니다."),
//   new HumanMessage("안녕?"),
// ];

// export const callModel = async () => {
//   const result = await model.invoke(messages)
//   const answer = await parser.invoke(result);
//   return answer
// }


// ----------------------------------------------------------------------


// const prompt = PromptTemplate.fromTemplate(
//   `Tell me a joke about {topic}, make it funny and in {language}`
// )
// const systemPrompt = PromptTemplate.fromTemplate(
//   `너는 요리사야. 내가 가진 재료들을 갖고 만들 수 있는 요리를 추천하고, 그 요리의 레시피를 제시해줘.`
// )
// const prompt = PromptTemplate.fromTemplate(
//   `
//   내가 가진 재료는 아래와 같아.
//   <재료>
//   {재료}
//   `
// )
// export const callModel = async () => {
//   //return await prompt.format({topic:'programming', language:'korean'})
  
//   return parser.invoke( await model.invoke(
//     await prompt.format({재료: '양파, 계란, 사과, 빵'})
//   ))
// }


// ----------------------------------------------------------------------

// const examplePrompt = PromptTemplate.fromTemplate(
//   "Question: {question}\n{answer}"
// );

// const examples = [
//   {
//     question: "누가 더 오래 살았나요, 무하마드 알리 아니면 앨런 튜링?",
//     answer: `  여기에 후속 질문이 필요한가요: 네.  후속 질문: 무하마드 알리가 죽었을 때 몇 살이었나요?  중간 답변: 무하마드 알리는 죽었을 때 74세였습니다.  후속 질문: 앨런 튜링이 죽었을 때 몇 살이었나요?  중간 답변: 앨런 튜링은 죽었을 때 41세였습니다.  따라서 최종 답변은: 무하마드 알리  `,
//   },
//   {
//     question: "크레이그리스트의 창립자는 언제 태어났나요?",
//     answer: `  여기에 후속 질문이 필요한가요: 네.  후속 질문: 크레이그리스트의 창립자는 누구인가요?  중간 답변: 크레이그리스트는 크레이그 뉴마크에 의해 설립되었습니다.  후속 질문: 크레이그 뉴마크는 언제 태어났나요?  중간 답변: 크레이그 뉴마크는 1952년 12월 6일에 태어났습니다.  따라서 최종 답변은: 1952년 12월 6일  `,
//   },
//   {
//     question: "조지 워싱턴의 외할아버지는 누구였나요?",
//     answer: `  여기에 후속 질문이 필요한가요: 네.  후속 질문: 조지 워싱턴의 어머니는 누구였나요?  중간 답변: 조지 워싱턴의 어머니는 메리 볼 워싱턴이었습니다.  후속 질문: 메리 볼 워싱턴의 아버지는 누구였나요?  중간 답변: 메리 볼 워싱턴의 아버지는 조셉 볼이었습니다.  따라서 최종 답변은: 조셉 볼  `,
//   },
//   {
//     question: "조스와 카지노 로얄의 감독은 같은 나라 출신인가요?",
//     answer: `  여기에 후속 질문이 필요한가요: 네.  후속 질문: 조스의 감독은 누구인가요?  중간 답변: 조스의 감독은 스티븐 스필버그입니다.  후속 질문: 스티븐 스필버그는 어느 나라 출신인가요?  중간 답변: 미국입니다.  후속 질문: 카지노 로얄의 감독은 누구인가요?  중간 답변: 카지노 로얄의 감독은 마틴 캠벨입니다.  후속 질문: 마틴 캠벨은 어느 나라 출신인가요?  중간 답변: 뉴질랜드입니다.  따라서 최종 답변은: 아니요  `,
//   },
// ];
// const prompt = new FewShotPromptTemplate({
//   examples,
//   examplePrompt,
//   suffix: "Question: {input}",
//   inputVariables: ["input"],
// });


// export const callModel = async () => {
//   const formatted = await prompt.format({
//     input: "세종대왕과 이순신은 같은 시기에 생존해있던 인물인가요?",
//   });
//   return parser.invoke(await model.invoke(formatted))
// }
  

// ----------------------------------------------------------------------

const errorPrompt = PromptTemplate.fromTemplate(
  `당신은 친절한 코딩 선생님입니다. 학생의 코드를 보고, 발생한 문제가 어떤 문제인지 설명해주세요.
  발생한 에러에 대해서 딱 1문장으로만 설명하세요. 원인이나 해결방안을 알려주어서는 안 됩니다.
  <코드>
  {code}
  `
)
const reasonPrompt = PromptTemplate.fromTemplate(
  `코드를 보고, 문제가 있는 부분을 찾아서 알려주세요.
  그리고 왜 이 코드가 문제인지 설명하세요.
  절대로 해결책은 제시해주면 안 됩니다.
  <코드>
  {code}
  `
)
const solutionPrompt = PromptTemplate.fromTemplate(
  `당신은 친절한 코딩 선생님입니다. 학생의 코드를 보고, 해결방법을 알려주세요.
  문제가 발생한 이유를 설명해서는 안 됩니다.
  <코드>
  {code}
  `
)
const advicePrompt = PromptTemplate.fromTemplate(
  `당신은 친절한 코딩 선생님입니다. 학생의 코드를 보고, 문제점을 찾아주세요. 그 문제점과 관련된 문법적 지식만을 알려주세요.
  <코드>
  {code}
  `
)
const answerPrompt = PromptTemplate.fromTemplate(
  `당신은 친절한 코딩 선생님입니다. 학생의 질문에 답해주세요.
  <코드>
  {question}
  `
)
const languagePrompt = PromptTemplate.fromTemplate(
  `다음 코드를 읽고 어떤 언어인지 한 단어로 대답해주세요. 예를 들어서 C언어로 작성된 코드라면 C 라고만 답해주세요. 그 이외에 다른 말을 하면 안 됩니다.
  <코드>
  {code}
  `
)
const errorTypePrompt = PromptTemplate.fromTemplate(
  `다음 코드를 읽고 에러 종류를 정해주세요. 해당 코드에 발생한 오류가 논리적 오류라면 1을, 문법 오류라면 2를, 런타임 에러라면 3을, 이 중 어디에도 해당되지 않는다면 4를 대답해주세요.
  숫자 1개 이외에 다른 대답은 해서는 안됩니다. 답은 꼭 하나의 숫자로만 해주세요.
  <코드>
  {code}
  `
)
export const callModel = async (error:string, code:string, question?:string) => {
   
  const languageResult = await parser.invoke( await model.invoke(
    await languagePrompt.format({code:code})
  ))
  const errorTypeResult = await parser.invoke( await model.invoke(
    await errorTypePrompt.format({code:code})
  ))
  const reasonResult = await parser.invoke( await model.invoke(
    await reasonPrompt.format({code:code})
  ))

  const solutionResult = await parser.invoke( await model.invoke(
    await solutionPrompt.format({code:code})
  ))

  if(question){
    const answerResult = await parser.invoke( await model.invoke(
      await answerPrompt.format({question:question})
    ))

    return {
      errorType:errorTypeResult,
      language: languageResult,
      note:`
  # 에러 발생 <br>
  ------------------ <br>
  ${error} <br>

  # 원인 코드 <br>
  ------------------ <br>
  ${reasonResult} <br>

  # 해결 방법 <br>
  ------------------ <br>
  ${solutionResult} <br>

  # 질문 및 답변 <br>
  ------------------ <br>
  질문: ${question} <br>

  답변: ${answerResult} <br>

  `}
  }else{
    const adviceResult = await parser.invoke( await model.invoke(
      await advicePrompt.format({code:code})
    ))
    return {
      errorType:errorTypeResult,
      language: languageResult,
      note:`
  # 에러 발생 <br>
  ------------------ <br>
  ${error} <br>

  # 원인 코드 <br>
  ------------------ <br>
  ${reasonResult} <br>

  # 해결 방법 <br>
  ------------------ <br>
  ${solutionResult} <br>

  # 조언 <br>
  ------------------ <br>
  ${adviceResult} <br>

  `}
  }

  
}