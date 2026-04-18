import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import {
  CreateBugFixRunRequestSchema,
  type CreateBugFixRunRequest,
  CreateFeatureRunRequestSchema,
  type CreateFeatureRunRequest,
  CreateGenerationRunRequestSchema,
  type CreateGenerationRunRequest,
  type GenerationRunResponse,
} from './poc.dto';
import { PocService } from './poc.service';

@Controller('poc')
export class PocController {
  constructor(private readonly pocService: PocService) {}

  @Post('generation-runs')
  createGenerationRun(
    @Body(new ZodValidationPipe(CreateGenerationRunRequestSchema))
    body: CreateGenerationRunRequest,
  ): Promise<GenerationRunResponse> {
    return this.pocService.createGenerationRun(body);
  }

  @Post('feature-runs')
  createFeatureRun(
    @Body(new ZodValidationPipe(CreateFeatureRunRequestSchema))
    body: CreateFeatureRunRequest,
  ): Promise<GenerationRunResponse> {
    return this.pocService.createFeatureRun(body);
  }

  @Post('bug-fix-runs')
  createBugFixRun(
    @Body(new ZodValidationPipe(CreateBugFixRunRequestSchema))
    body: CreateBugFixRunRequest,
  ): Promise<GenerationRunResponse> {
    return this.pocService.createBugFixRun(body);
  }
}
