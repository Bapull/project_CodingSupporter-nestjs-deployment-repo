import { Body, Controller, Post } from '@nestjs/common';
import { LangChainService } from './lang-chain.service';

@Controller('lang-chain')
export class LangChainController {
  constructor(private readonly langChainService: LangChainService) {}

  
}
