import { Injectable } from '@nestjs/common';

@Injectable()
export class ResumeService {
  // Placeholder for AI scoring logic
  async scoreResume(file: any): Promise<{ score: number }> {
    // For now, return dummy score. Implement AI later (e.g., via external API).
    return { score: Math.floor(Math.random() * 100) };
  }
}