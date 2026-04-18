import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  it('returns parsed data for valid input', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        count: z.coerce.number().int().positive(),
      }),
    );

    expect(pipe.transform({ count: '3' })).toEqual({ count: 3 });
  });

  it('throws a BadRequestException for invalid input', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        name: z.string().min(1),
      }),
    );

    expect(() => pipe.transform({ name: '' })).toThrow(BadRequestException);
  });
});
