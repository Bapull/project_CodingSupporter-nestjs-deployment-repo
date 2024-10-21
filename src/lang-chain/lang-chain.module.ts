import { Module } from '@nestjs/common';
import { LangChainService } from './lang-chain.service';

@Module({
  providers: [LangChainService],
  exports: [LangChainService]
})
export class LangChainModule {}
