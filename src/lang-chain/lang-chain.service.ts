import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangChainService {
  private readonly apiKey: string;
  private readonly model: ChatOpenAI;
  private readonly parser: StringOutputParser;
  private readonly codePrompt: PromptTemplate;
  private readonly mdPrompt: PromptTemplate;

  constructor(private configService: ConfigService){
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY')
    if(!this.apiKey){
      throw new Error('OPEN_API_KEY is not set')
    }
    this.model = new ChatOpenAI({
      model: 'gpt-4',
      openAIApiKey: this.apiKey,
    });
    
    this.parser = new StringOutputParser();

    this.codePrompt = PromptTemplate.fromTemplate(
      `다음 코드를 읽고 밑의 질문에 하나씩 답해주세요
      1. 해당 코드는 어떤 언어로 작성되었습니까? 만약 C언어로 작성되어있다면, 그냥 C라고만 답하고, 다른 단어는 말하지 마세요.
      2. 해당 코드에서 발생한 문제를 한 문장으로 설명해주세요.
      3. 이 코드에서 문제가 있는 부분은 어디인가요? 문제가 있는 코드만 알려주세요.
      4. 이 코드의 에러의 종류는 어떤건가요? 만약 논리적 오류라면 1이라고 답해주세요. 문법 오류라면 2라고, 런타임 오류라면 3으로, 다른 거라면 4라고 답해주세요.
      5. 이 코드의 문제를 해결한 코드를 작성해서 보여주세요.
      6. 다시 이런 실수를 하지 않으려면, 어떤 지식이 필요할까요?
      <코드>
      {code}`
    );
    this.mdPrompt = PromptTemplate.fromTemplate(
      `다음 글을 마크다운 형식에 맞춰서 문서화해야합니다. 문장들은 1. 2. 3. 4. 5. 이렇게 번호가 붙어있습니다.
      <글>
      {response}
      1. 과 2. 사이에 있는 글을 !a!, 2. 과 3. 사이에 있는 글을 !b!, 3. 과 4. 사이에 있는 글을 !c!, 4.과 5. 사이에 있는 글을 !d!, 5. 과 6. 사이에 있는 글을 !e!, 6. 뒤에 있는 글을 !f! 라고 하겠습니다.
      그럼 다음과 같이 응답해주세요.
      
      # 에러 발생
      -------------------
      !b!

      # 원인 코드
      -------------------
      !c!

      # 해결 방안
      -------------------
      !e!

      # 참고
      -------------------
      !f!
      `
    )
  }
  async callModel(code:string, question?:string) {
   
    const languageResult = await this.parser.invoke( await this.model.invoke(
      await this.codePrompt.format({code:code})
    ))
    const temp = JSON.stringify(languageResult)
    return {
      json: JSON.stringify(languageResult),
      mdFile:  await this.parser.invoke( await this.model.invoke(
        await this.mdPrompt.format({response:languageResult})
      ))
    }
  }
}
